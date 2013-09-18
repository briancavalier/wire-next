//var when = require('when');
var undef;
var Singleton = require('./Singleton');
var Prototype = require('./Prototype');

module.exports = FluentConfig;

function FluentConfig() {
	this._config = [];
}

FluentConfig.prototype = {
	configure: function(context) {
		return this._config.reduce(function(context, config) {
			config(context);
			return context;
		}, context);
	},

	register: function(name, deps, component) {

		if(arguments.length < 3) {
			this._config.push(function(context) {
				return context.register(name, createComponent(deps));
			});
		} else {

			component = createComponent(component);
			var origInstance = component.instance.bind(component);

			component = Object.create(component, {
				instance: { value: function(context) {
					return origInstance.apply(undef, deps.map(function(dep) {
						return typeof dep === 'string' ? context.get(dep) : dep;
					}));
				}}
			});

			this._config.push(function(context) {
				return context.register(name, component);
			});

		}

		return this;
	}
};

function createComponent(x) {
	if(x instanceof Prototype || x instanceof Singleton) {
		return x;
	} else if(typeof x === 'function') {
		return new Singleton(x);
	}

	return new Singleton(function() {
		return x;
	});
}
