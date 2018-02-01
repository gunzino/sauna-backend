var Control = function Control(connections) {
    this.SAUNA_ON = 0;
    this.SAUNA_OFF = 1;
    this.connections = connections;
    this.actualSaunaState = {
        status: this.SAUNA_OFF,
        temperature: 37.4,
        humidity: 60,
    }
};

Control.prototype.parseMessage = function(connection, message) {
    var data;
    try {
        data = JSON.parse(message.utf8Data);
    } catch (e) {
        console.log(e);
    }
    if (data) {
        switch (data.type) {
            case 'parseGetActualSaunaState':
                this.sendActualSaunaState(connection);
                break;
            case 'setSaunaStatus':
                this.parseSetSaunaStatus(connection, data.data);
                break;
            case 'setTemperature':
                this.parseSetTemperature(connection, data.data);
                break;
            default:
                console.log('Unknown message type: ' + data.type);
        }
    }
};

Control.prototype.parseGetActualSaunaState = function (connection) {
    connection.send(JSON.stringify({
            type : 'actualSaunaState',
            data : this.actualSaunaState}));
};

Control.prototype.broadcastActualSaunaState = function () {
    this.connections.broadcast(JSON.stringify({
        type : 'actualSaunaState',
        data : this.actualSaunaState}));
};

Control.prototype.parseSetSaunaStatus = function (connection, data) {
    var status = parseInt(data.status);
    if (!isNaN(status)) {
        this.actualSaunaState.status = status;
        this.broadcastActualSaunaState();
    } else {
        console.log("problem " + status);
    }
};


Control.prototype.parseSetTemperature = function (connection, data) {
    var temperature = parseFloat(data.temperature);
    if (temperature) {
        this.actualSaunaState.temperature = temperature;
        this.broadcastActualSaunaState();
    } else {
        console.log("problem " + temperature);
    }
};


module.exports = Control;
