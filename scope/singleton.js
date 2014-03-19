var fn = require('../lib/fn');

module.exports = function singleton(create, destroy) {
	return fn.once(createInstance);

	function createInstance(context) {
		var instance = create.call(this, context);
		this.declaringContext.addInstance(instance, destroy);
		return instance;
	}
};
