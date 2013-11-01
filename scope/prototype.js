var when = require('when');

module.exports = function prototype(create, destroy) {
	return function createInstance(context) {
		var instance = create.call(this, context);

		if(destroy) {

			var origDestroy = context.destroy;

			context.destroy = function() {
				context.destroy = origDestroy;
				return when(destroy(instance, context), function() {
					return context.destroy();
				});

			};
		}

		return instance;
	}
}
