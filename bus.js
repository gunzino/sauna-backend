var Gpio = require('onoff').Gpio;
var Bus = function Bus(control) {
    this.control = control;
    this.gpios =  [4, 17, 22, 27];
    this.INTERVAL = 10000;

    var _this = this;
    setInterval(function () {
        _this.setSaunaState();
    }, this.INTERVAL);

    setInterval(function () {
        _this.readTemperature();
    }, 2000);
};

Bus.prototype.setSaunaState = function() {
    var saunaState = this.control.actualSaunaState;
    if (saunaState.status == 1) {
        this.gpios.forEach(function (gpio) {
            var spiral = new Gpio(gpio, 'out');
            spiral.write(1);
        });
    } else {
        this.gpios.forEach(function (gpio) {
            var spiral = new Gpio(gpio, 'out');
            spiral.write(0);
        });
    }
}

Bus.prototype.readTemperature = function () {
    var saunaState = this.control.actualSaunaState;
    if (saunaState.status === 1) {
        if (saunaState.temperature < 100) {
            this.control.setActualTemperature(saunaState.temperature + 1);
        }
    } else {
        if (saunaState.temperature > 10) {
            this.control.setActualTemperature(saunaState.temperature + 1);
        }
    }
}

module.exports = Bus;
