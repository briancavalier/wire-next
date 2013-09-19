var Map = require('./lib/Map');

module.exports = Context;

function Context(parent) {
	this._parent = parent;
	this._components = {};
	this._instances = new Map();
}

Context.prototype = {
	configure: function(config) {
		return config(this);
	},

	add: function(name, factory) {
		var components = this._components;

		if(name in components) {
			throw new Error('Component named ' + name + ' already registered');
		}

		components[name] = factory;

		return this;
	},

	get: function(name) {
		var requestingContext = arguments[1] instanceof Context ? arguments[1] : this;
		if(!(name in this._components)) {
			return this._parent && this._parent.get(name, requestingContext);
		}

		return this._getInstanceByName(name, requestingContext);
	},

	_getInstanceByName: function(name, requestingContext) {
		var factory, instances, instance;

		factory = this._components[name];

		if(factory) {
			instance = factory.call(Object.create(this, {
				currentContext: { value: requestingContext }
			}));
			instances = this._instances;

			if(!instances.has(instance)) {
				instances.set(instance, {
					component: factory
				});
			}

			return instance;
		}
	},

	destroy: function() {
		// TODO:
		// 1. destroy all instances
		// 2. clear this._instances
		// 3. clear this._components
		// 4. make destroy() a noop
	}
};
