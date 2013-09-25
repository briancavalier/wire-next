var fn = require('../lib/fn');
var prototype = require('./prototype');

module.exports = function percontext(create, destroy) {
	return fn.memoize(prototype(create, destroy));
};