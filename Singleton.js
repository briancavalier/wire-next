module.exports = singleton;

var tag = singleton.prototype = require('./config/base');

function singleton(factory) {
	var instance = create.prototype = tag;

	return create;

	function create() {
		return instance === tag
			? (instance = factory.apply(this, arguments))
			: instance;
	}
}
