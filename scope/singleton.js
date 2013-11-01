var fn = require('../lib/fn');
var when = require('when');

module.exports = function singleton(create, destroy) {
	return fn.once(createInstance);

	function createInstance(context) {
		var instance = create.call(this, context);

		if(destroy) {

			var declaringContext = this.declaringContext;
			var origDestroy = declaringContext.destroy;

			declaringContext.destroy = function() {
				declaringContext.destroy = origDestroy;

				return when(destroy(instance, context), function() {
					return declaringContext.destroy();
				});
			};
		}

		return instance;
	}
}
