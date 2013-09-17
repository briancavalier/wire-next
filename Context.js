var Map = require('./lib/Map');

module.exports = Context;

function Context(parent) {
	this._parent = parent;
	this._components = {};
	this._instances = new Map();
}

Context.prototype = {
	register: function(name, component) {
		var components = this._components;

		if(name in components) {
			throw new Error('Component named ' + name + ' already registered');
		}

		this._components[name] = component;

		return this;
	},

	get: function(name) {
		if(!(name in this._components)) {
			return this._parent && this._parent.get(name);
		}

		return this._getInstanceByName(name);
	},

	_getInstanceByName: function(name) {
		var component, instance;

		component = this._components[name];

		if(component) {
			instance = component.instance(this);

			if(!this._instances.has(instance)) {
				this._instances.set(instance, {
					component: component
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
