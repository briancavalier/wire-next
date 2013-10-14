var resolveArray = require('./resolveArray');

module.exports = function(factory) {
	return function(context) {
		var params = /\(([^\)]*)/.exec(factory.toString());

		params = params && params[1];
		return params ? resolveArray(params.split(/\s*,\s*/))(context) : [];
	};
};