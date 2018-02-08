var Gpio = require('onoff').Gpio;
var Bus = function Bus(control) {
    this.control = control;
    this.pinOut =  [4, 17, 27];
    this.gpios = [];
    this.INTERVAL = 10000;

    var _this = this;
    setInterval(function () {
        _this.setSaunaState();
    }, this.INTERVAL);

    setInterval(function () {
        _this.readTemperature();
    }, 2000);

    this.setInitialState();
};

Bus.prototype.setInitialState = function() {
    for (var i = 0, len = this.pinOut.length; i < len; i++) {
        var gpio = new Gpio(this.pinOut[i], 'out');
        this.gpios.push(gpio);
    }
    this.gpios.forEach(function (gpio) {
        gpio.write(0);
    });
};

Bus.prototype.setSaunaState = function() {
    var saunaState = this.control.actualSaunaState;
    if (saunaState.status == 1) {
        this.controlSaunaSpirals();
    } else {
        this.gpios.forEach(function (gpio) {
            gpio.write(0);
        });
    }
};

Bus.prototype.controlSaunaSpirals = function () {
    var saunaState = this.control.actualSaunaState;
    var tempDifference = saunaState.setTemperature - saunaState.temperature;
    if (tempDifference > 10) {
        this.gpios.forEach(function (gpio) {
            gpio.write(1);
        });
    } else if (tempDifference > 0 && tempDifference <= 10) {
        this.gpios[0].write(1);
        this.gpios[1].write(1);
        this.gpios[2].write(0);
    } else {
        this.gpios[0].write(1);
        this.gpios[1].write(0);
        this.gpios[2].write(0);
    }
};

Bus.prototype.readTemperature = function () {
    var saunaState = this.control.actualSaunaState;
    if (saunaState.status === 1) {
        if (saunaState.temperature < 100) {
            this.control.setActualTemperature(saunaState.temperature + 1);
        }
    } else {
        if (saunaState.temperature > 10) {
            this.control.setActualTemperature(saunaState.temperature - 1);
        }
    }
};

module.exports = Bus;
