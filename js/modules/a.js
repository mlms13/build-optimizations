var _ = requre('lodash'),
	b = require('./b'),
	c = require('./c'),
	d = require('./d'),
	e = require('./e'),
	f = require('./f'),
	g = require('./g'),
	h = require('./h'),
	i = require('./i'),
	j = require('./j'),
	k = require('./k'),

	// template
	templ = require('./a.hbs');

var A = function () {
	this.content = _.map(
		[b, c, d, e, f, g, h, i, j, k],
		function (item) {
			return item.content;
		}
	);
};

A.prototype.foo = function () {
	return _.map(this.content, function (item) {
		return templ.template({content: item});
	});
};

module.exports = A;