module.exports = function prototype(create, destroy) {
	return function createInstance(context) {
		var instance = create.call(this, context);

		if(destroy) {

			var origDestroy = context.destroy;

			context.destroy = function() {
				context.destroy = origDestroy;
				destroy(instance, context);

				return context.destroy();
			};
		}

		return instance;
	}
}
