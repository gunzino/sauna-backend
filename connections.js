var Connections = function Connections() {
    this.connectionIDCounter = 0;
    this.connections = [];
};

Connections.prototype.addConnection = function(connection) {
    connection.id = this.connectionIDCounter ++;
    this.connections[connection.id] = connection;
};

Connections.prototype.removeConnection = function(connection) {
    delete this.connections[connection.id];
};

Connections.prototype.broadcast = function (data) {
    this.connections.forEach(function(connection) {
        if (connection.connected) {
            connection.send(data);
        }
    });
};

module.exports = Connections;
