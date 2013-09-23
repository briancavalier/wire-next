module.exports = prototype;

prototype.prototype = require('./../config/base');

function prototype(factory) {
	instance.prototype = prototype.prototype;

	return instance;

	function instance() {
		return factory.apply(this, arguments);
	}
}
