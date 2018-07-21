# net-retry-connect
Attempt to connect to net Sockets using retry patterns.

```net-retry-connect``` is based on the Node.js ```net``` module as well as the [retry](https://www.npmjs.com/package/retry) module.

## Installation

```npm install net-retry-connect --save```


## API

### retryConnect.to(options, callback)

```options``` provides this options:
* ```port```: the TCP port
* ```host```: optional, defaults to ```'localhost'```
* ```retryOptions```, optional, see retry options for [retry.operation](https://github.com/tim-kos/node-retry#retryoperationoptions)

```callback``` returns a client object if connection has been successful. Otherwise it returns the error.

```js
var retryConnect = require('net-retry-connect');
retryConnect.to({port: 3000, host: 'localhost'}, function (error, client) {
    // use the client
});
```

#### Usage of retryOptions

```js
var retryConnect = require('net-retry-connect');

// retry for 2 seconds only
var retryOptions = {
  retries: 2,
  factor: 1
};

retryConnect.to({port: 3000, host: 'localhost', retryOptions: retryOptions }, function (error, client) {
    // use the client
});
```

## Running the tests:

```
npm install   
npm test
```
