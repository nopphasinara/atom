<?php

namespace PhpIntegrator\Sockets;

use SplObjectStorage;

use React\EventLoop\LoopInterface;

use React\Socket\Server;
use React\Socket\Connection;

/**
 * Represents a socket server that handles communication with the core.
 *
 * This class simply requests a configured factory to create a handler for each new connection and does not handle any
 * communication itself.
 */
class SocketServer extends Server
{
    /**
     * @var SplObjectStorage
     */
    protected $connectionMap;

    /**
     * @var ConnectionHandlerFactoryInterface
     */
    protected $connectionHandlerFactory;

    /**
     * @param LoopInterface                     $loop
     * @param ConnectionHandlerFactoryInterface $connectionHandlerFactory
     */
    public function __construct(LoopInterface $loop, ConnectionHandlerFactoryInterface $connectionHandlerFactory)
    {
        parent::__construct($loop);

        $this->connectionMap = new SplObjectStorage();
        $this->connectionHandlerFactory = $connectionHandlerFactory;

        $this->on('connection', [$this, 'onConnectionEstablished']);
    }

    /**
     * @param Connection $connection
     */
    protected function onConnectionEstablished(Connection $connection)
    {
        $handler = $this->connectionHandlerFactory->create($connection);

        $this->connectionMap->attach($connection, $handler);

        $connection->on('close', [$this, 'onConnectionClosed']);
    }

    /**
     * @param Connection $connection
     */
    protected function onConnectionClosed(Connection $connection)
    {
        $this->connectionMap->detach($connection);
    }
}
