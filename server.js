var config = require('./config');
var WebSocketServer = require('websocket').server;
var http = require('http');

var controlSaunaModule = require('./control');
var connectionsModule = require('./connections');

var server = http.createServer(function(request, response) {});

server.listen(config.listenPort, function() {
    console.log((new Date()) + ' Server is listening on port ' + config.listenPort);
});

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

var connections = new connectionsModule();
var controlSauna = new controlSaunaModule(connections);

function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }


    var connection = request.accept('', request.origin);
    connections.addConnection(connection);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            controlSauna.parseMessage(connection, message);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
        }
    });
    connection.on('close', function(reasonCode, description) {
        connections.removeConnection(connection);
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});