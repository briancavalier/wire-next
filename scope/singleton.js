var fn = require('../lib/fn');

module.exports = function singleton(create, destroy) {
	return fn.once(createInstance);

	function createInstance(context) {
		var instance = create.call(this, context);

		if(destroy) {

			var declaringContext = this.declaringContext;
			var origDestroy = declaringContext.destroy;

			declaringContext.destroy = function() {
				declaringContext.destroy = origDestroy;
				destroy(instance, context);

				return  declaringContext.destroy();
			};
		}

		return instance;
	}
}
