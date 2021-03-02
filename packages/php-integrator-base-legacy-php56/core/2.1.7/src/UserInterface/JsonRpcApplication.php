<?php

namespace PhpIntegrator\UserInterface;

use React;
use ArrayObject;
use UnexpectedValueException;

use PhpIntegrator\Indexing\Indexer;
use PhpIntegrator\Indexing\IncorrectDatabaseVersionException;

use PhpIntegrator\Sockets\JsonRpcError;
use PhpIntegrator\Sockets\SocketServer;
use PhpIntegrator\Sockets\JsonRpcRequest;
use PhpIntegrator\Sockets\JsonRpcResponse;
use PhpIntegrator\Sockets\JsonRpcErrorCode;
use PhpIntegrator\Sockets\RequestParsingException;
use PhpIntegrator\Sockets\JsonRpcRequestHandlerInterface;
use PhpIntegrator\Sockets\JsonRpcResponseSenderInterface;
use PhpIntegrator\Sockets\JsonRpcConnectionHandlerFactory;

use React\EventLoop\LoopInterface;

use React\Socket\ConnectionException;

use Symfony\Component\DependencyInjection\ContainerBuilder;

use Symfony\Component\DependencyInjection\Exception\ServiceNotFoundException;

/**
 * Application extension that can handle JSON-RPC requests.
 */
class JsonRpcApplication extends AbstractApplication implements JsonRpcRequestHandlerInterface
{
    /**
     * A stream that is used to read and write STDIN data from.
     *
     * As there is no actual STDIN when working with sockets, this temporary stream is used to transparently replace
     * it with another stream.
     *
     * @var resource|null
     */
    protected $stdinStream;

    /**
     * @inheritDoc
     */
    public function run()
    {
        $options = getopt('p:', [
            'port:'
        ]);

        $requestHandlingPort = $this->getRequestHandlingPortFromOptions($options);

        $this->stdinStream = fopen('php://memory', 'w+');

        /** @var LoopInterface $loop */
        $loop = React\EventLoop\Factory::create();

        try {
            $this->setupRequestHandlingSocketServer($loop, $requestHandlingPort);
        } catch (ConnectionException $e) {
            fwrite(STDERR, 'Socket already in use!');
            fclose($this->stdinStream);
            return 2;
        }

        echo "Starting socket server on port {$requestHandlingPort}...\n";

        $loop->run();

        fclose($this->stdinStream);

        return 0;
    }

    /**
     * @param array $options
     *
     * @throws UnexpectedValueException
     *
     * @return int
     */
    protected function getRequestHandlingPortFromOptions(array $options)
    {
        if (isset($options['p'])) {
            return (int) $options['p'];
        } elseif (isset($options['port'])) {
            return (int) $options['port'];
        }

        throw new UnexpectedValueException('A socket port for handling requests must be specified');
    }

    /**
     * @param React\EventLoop\LoopInterface $loop
     * @param int                           $port
     */
    protected function setupRequestHandlingSocketServer(React\EventLoop\LoopInterface $loop, $port)
    {
        $connectionHandlerFactory = new JsonRpcConnectionHandlerFactory($this);

        $requestHandlingSocketServer = new SocketServer($loop, $connectionHandlerFactory);
        $requestHandlingSocketServer->listen($port);
    }

    /**
     * @inheritDoc
     */
    public function handle(JsonRpcRequest $request, JsonRpcResponseSenderInterface $jsonRpcResponseSender = null)
    {
        $error = null;
        $result = null;

        try {
            $result = $this->handleRequest($request, $jsonRpcResponseSender);
        } catch (RequestParsingException $e) {
            $error = new JsonRpcError(JsonRpcErrorCode::INVALID_PARAMS, $e->getMessage());
        } catch (Command\InvalidArgumentsException $e) {
            $error = new JsonRpcError(JsonRpcErrorCode::INVALID_PARAMS, $e->getMessage());
        } catch (IncorrectDatabaseVersionException $e) {
            $error = new JsonRpcError(JsonRpcErrorCode::DATABASE_VERSION_MISMATCH, $e->getMessage());
        } catch (\RuntimeException $e) {
            $error = new JsonRpcError(JsonRpcErrorCode::GENERIC_RUNTIME_ERROR, $e->getMessage());
        } catch (\Exception $e) {
            $error = new JsonRpcError(JsonRpcErrorCode::FATAL_SERVER_ERROR, $e->getMessage(), [
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);
        } catch (\Throwable $e) {
            // On PHP < 7, throwable simply won't exist and this clause is never triggered.
            $error = new JsonRpcError(JsonRpcErrorCode::FATAL_SERVER_ERROR, $e->getMessage(), [
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);
        }

        return new JsonRpcResponse($request->getId(), $result, $error);
    }

    /**
     * @param JsonRpcRequest                      $request
     * @param JsonRpcResponseSenderInterface|null $jsonRpcResponseSender
     *
     * @return string
     */
    protected function handleRequest(
        JsonRpcRequest $request,
        JsonRpcResponseSenderInterface $jsonRpcResponseSender = null
    ) {
        $params = $request->getParams();

        $this->configureProgressStreamingCallback($request, $jsonRpcResponseSender);

        if (isset($params['stdinData'])) {
            ftruncate($this->stdinStream, 0);
            fwrite($this->stdinStream, $params['stdinData']);
            rewind($this->stdinStream);
        }

        if (isset($params['database'])) {
            $this->setDatabaseFile($params['database']);
        }

        unset($params['stdinData'], $params['database']);

        $command = $this->getCommandByMethod($request->getMethod());

        $result = $command->execute(new ArrayObject($params));

        return $result;
    }

    /**
     * @param string $method
     *
     * @return Command\CommandInterface
     */
    protected function getCommandByMethod($method)
    {
        try {
            return $this->getContainer()->get($method . 'Command');
        } catch (ServiceNotFoundException $e) {
            throw new RequestParsingException('Method "' . $method . '" was not found');
        }

        return null; // Never reached.
    }

    /**
     * @param JsonRpcRequest                      $request
     * @param JsonRpcResponseSenderInterface|null $jsonRpcResponseSender
     */
    protected function configureProgressStreamingCallback(
        JsonRpcRequest $request,
        JsonRpcResponseSenderInterface $jsonRpcResponseSender = null
    ) {
        $progressStreamingCallback = null;

        if ($jsonRpcResponseSender) {
            $progressStreamingCallback = $this->createProgressStreamingCallback($request, $jsonRpcResponseSender);
        }

        /** @var Indexer $indexer */
        $indexer = $this->getContainer()->get('indexer');
        $indexer->setProgressStreamingCallback($progressStreamingCallback);
    }

    /**
     * @inheritDoc
     */
    protected function createContainer()
    {
        $value = parent::createContainer();

        $this->instantiateRequiredServices($value);

        return $value;
    }

    /**
     * Instantiates services that are required for the application to function correctly.
     *
     * Usually we prefer to rely on lazy loading of services, but some services aren't explicitly required by any other
     * service, but do provide necessary interaction (i.e. they are required by the application itself).
     *
     * @param ContainerBuilder $container
     */
    protected function instantiateRequiredServices(ContainerBuilder $container)
    {
        $container->get('cacheClearingEventMediator');
    }

    /**
     * @inheritDoc
     */
    public function getStdinStream()
    {
        return $this->stdinStream;
    }

    /**
     * @param JsonRpcRequest                 $request
     * @param JsonRpcResponseSenderInterface $jsonRpcResponseSender
     *
     * @return \Closure
     */
    public function createProgressStreamingCallback(
        JsonRpcRequest $request,
        JsonRpcResponseSenderInterface $jsonRpcResponseSender
    ) {
        return function ($progress) use ($request, $jsonRpcResponseSender) {
            $jsonRpcResponse = new JsonRpcResponse(null, [
                'type'      => 'reindexProgressInformation',
                'requestId' => $request->getId(),
                'progress'  => $progress
            ]);

            // We may well be sending data to the connection as needed, but during this process we never end up back in
            // the main loop, thus the writes are never actually performed by the React event loop. For this reason
            // we force the write.
            $jsonRpcResponseSender->send($jsonRpcResponse, true);
        };
    }
}
