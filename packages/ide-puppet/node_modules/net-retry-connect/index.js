var net = require('net');
var retry = require('retry');

function Connection() {
}

Connection.prototype.to = function(options, cb) {

    var host = options.host || 'localhost';
    var port = options.port;
    var retryOptions = options.retryOptions;

    var client = new net.Socket();
    var operation = retry.operation(retryOptions);
    var cbCalled = false;

    client.on('error', handleError);

    function handleError(err) {
        if (!operation.retry(err)) {
            cb(err, null)
        }
    }

    operation.attempt(function () {
        client.connect(port, host, function(){
            if(!cbCalled) {
                client.removeListener('error', handleError);
                cb(null, client);
                cbCalled = true;
            }
        });
    });
};


module.exports = new Connection();
