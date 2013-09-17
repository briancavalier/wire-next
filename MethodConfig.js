var Singleton = require('./Singleton');
var Prototype = require('./Prototype');

module.exports = function(object) {
	return function(context) {
		var config = Object.create(object);

		return Object.keys(object).reduce(function(context, name) {
			var factory = config[name];

			if(factory instanceof Prototype || factory instanceof Singleton) {
				config[name] = wrapComponent(factory);
				context.register(name, factory);

			} else if(typeof factory === 'function') {
				var component = new Singleton(factory.bind(config));
				config[name] = wrapComponent(component);
				context.register(name, component);

			} else {
				component = new Singleton(function() {
					return factory;
				});
				config[name] = wrapComponent(component);
				context.register(name, component);
			}

			return context;
		}, context);
	};
};

function wrapComponent(component) {
	return function() {
		return component.instance.apply(component, arguments);
	};
}