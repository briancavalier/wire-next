var fn = require('./lib/fn');
var meta = require('./lib/metadata');
var iterator = require('./lib/iterator');
var resolveArray = require('./inject/resolveArray');

module.exports = Context;

function Context(parent) {
	this._parent = parent;
	this._components = {};
}

Context.prototype = {
	configure: function(config) {
		return config(this);
	},

	add: function(scope, metadata, create, destroy) {
		var id, components;

		metadata = meta.normalize(metadata);
		id = metadata.id;

		components = this._components;
		if (id in components) {
			throw new Error('Component named ' + id + ' already registered');
		}

		components[id] = fn.once(function(context) {
			var createInstance = scope(create, destroy);
			return {
				instance: function() {
					return createInstance(context);
				},
				metadata: metadata,
				declaringContext: context
			};
		});

		return this;
	},

	resolve: function(resolve, inject) {
		if(Array.isArray(resolve)) {
			resolve = resolveArray(resolve);
		}

		inject.apply(this, resolve(this, inject));
		return this;
	},

	get: function(criteria) {
		var component = typeof criteria === 'function'
			? this._find(criteria) : this._findById(criteria);

		return component && component.instance();
	},

	_findById: function(id) {
		var component = this._components[id];

		return component ? component(this) : this._parent && this._parent._findById(id);
	},

	_find: function(query) {
		var component = query(createIterator(this._components, this));

		return component || this._parent && this._parent._find(query);
	},

	destroy: function() {
		delete this._components;
	}
};

function createIterator(components, context) {
	return iterator.map(iterator.of(Object.keys(components)), function (key) {
		return components[key](context);
	});
}
