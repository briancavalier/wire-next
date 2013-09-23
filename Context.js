var Map = require('./lib/Map');
var componentId = 0;

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

	add: function(scope, metadata, create) {
		var id, components, component;

		metadata = normalizeMetadata(metadata);
		id = metadata.id;

		component = { id: id, create: scope(create), metadata: metadata };

		components = this._components;
		if (id in components) {
			throw new Error('Component named ' + id + ' already registered');
		}

		components[id] = component;

		return this;
	},

	get: function(query) {
		var component, requestingContext;

		if(typeof query !== 'function') {
			query = byId(query);
		}

		requestingContext = arguments[1] instanceof Context ? arguments[1] : this;
		component = query(this._components);

		if(!component) {
			return this._parent && this._parent.get(query, requestingContext);
		}

		// TODO: Find a better way to provide access to both contexts:
		// The context that actually contains this instance, and the
		// context from which the instance was just requested
		return this.createInstance(component, Object.create(this, {
			currentContext: { value: requestingContext }
		}));
	},

	createInstance: function(component, context) {
		var instances, instance;

		instances = this._instances;
		instance = component.create.call(context);

		instances.set(instance, component);

		return instance;
	},

	destroyInstance: function(instance) {
		this._instances.delete(instance);
	},

	destroy: function() {
		if(!this._instances) {
			return;
		}

		var instances, self;

		self = this;
		instances = this._instances;

		instances.keys().forEach(function(instance) {
			self.destroyInstance(instance);
		});

		instances.clear();

		delete this._instances;
		delete this._components;
	}
};

function byId(id) {
	return function(components) {
		return components[id];
	}
}

function normalizeMetadata(metadata) {
	if (typeof metadata === 'string') {
		return { id: ensureId(metadata) };
	}

	metadata.id = ensureId(metadata.id);

	return metadata;
}

function ensureId(id) {
	return typeof id !== 'string' || id.length === 0
		? '!' + Date.now() + (componentId++)
		: id;
}