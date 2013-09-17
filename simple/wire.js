var isPrototype = {};

module.exports = wire;
wire.proto = prototype;

function wire(descriptor, parent) {
	var context = Object.create(parent || null);

	for(var key in descriptor) {
		var factory = descriptor[key];

		if(typeof factory === 'function') {
			if(factory._isPrototype === isPrototype) {
				context[key] = factory.bind(context);
			} else {
				context[key] = singleton(factory, context, key);
			}
		} else {
			context[key] = factory;
		}
	}

	return context;
}

function prototype(factory) {
	var protoFactory = function() {
		return factory.apply(this, arguments);
	};
	protoFactory._isPrototype = isPrototype;
	return protoFactory;
}

function singleton(f, context, key) {
	var memoized;

	return function() {
		memoized = f.apply(context, arguments);

		context[key] = function() {
			return memoized;
		}

		return memoized;
	};
}