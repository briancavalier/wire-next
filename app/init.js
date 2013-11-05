var defaultInitializer = require('wire/config/defaultInitializer');
var dom = require('wire/dom');

module.exports = function() {
	return defaultInitializer().configure(dom);
}