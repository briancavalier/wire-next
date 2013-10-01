var resolveArray = require('./resolveArray');

module.exports = function(context, factory) {
	var params = /\(([^\)]*)/.exec(factory.toString());

	params = params && params[1];
	return params ? resolveArray(params.split(/\s*,\s*/))(context) : [];

};