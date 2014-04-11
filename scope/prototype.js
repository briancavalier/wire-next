module.exports = function prototype(create, destroy) {
	return function createInstance(context) {
		var instance = create.call(this, context);
		context.addInstance(instance, destroy);
		return instance;
	};
};
