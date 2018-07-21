var retryConnect = require('../index');
var net = require('net');
var assert = require('assert');

var _server;
function createServer() {
    return _server = net.createServer(function (c) {

    }).listen(3000);
}

describe('net-retry-connect', function () {

    beforeEach(function (done) {
        done();
    });

    describe('When connecting to a server that takes 3 seconds to be up', function () {
        it('should wait for connection', function (done) {
            setTimeout(function () {
                createServer();
            }, 3000);
            retryConnect.to({port: 3000, host: 'localhost'}, function (error, client) {
                assert.equal(error, null);
                assert.notEqual(client, null);
                done();
            });

        });

        it('client should have no listeners attached', function(done) {
            setTimeout(function () {
                createServer();
            }, 3000);
            retryConnect.to({port: 3000, host: 'localhost'}, function (error, client) {
                assert.equal(client.listeners('error').length, 0);
                done();
            });
        })
    });

    describe('When connecting to a server that takes 3 seconds to be up but should wait only 2 seconds', function () {
        it('should not wait for connection', function (done) {

            var retryOptions = {
                retries: 2,
                factor: 1
            };

            setTimeout(function () {
                createServer();
            }, 3000);
            retryConnect.to({port: 3000, host: 'localhost', retryOptions: retryOptions}, function (error, client) {
                assert.notEqual(error, null);
                assert.equal(client, null);
                done();
            });

        });
    });

    afterEach(function (done) {
        _server.close();
        done();
    })
});