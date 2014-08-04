var $ = require('jquery'),
	_ = require('lodash'),
	aModule = require('./modules/a');

var a = new aModule();

_.each(a.foo(), function (output) {
	$('body').append(output);
});