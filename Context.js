var meta = require('./lib/metadata');
var iterator = require('./lib/iterator');
var resolveArray = require('./inject/resolveArray');
var Promise = require('truth');

module.exports = Context;

function Context(parent) {
	this._parent = parent;
	this._components = {};

	if(parent) {
		var parentDestroy = parent.destroy;
		var self = this;
		parent.destroy = function() {
			parent.destroy = parentDestroy;

			self.destroy();
			parentDestroy.call(parent);
		}
	}
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

		components[id] = {
			instance: scope(create, destroy),
			metadata: metadata,
			declaringContext: this
		};

		return this;
	},

	resolve: function(resolve, inject) {
		if(Array.isArray(resolve)) {
			resolve = resolveArray(resolve);
		}

		return Promise.all(resolve(this, inject))
			.then(inject.apply.bind(inject, this));
	},

	get: function(criteria) {
		var component = typeof criteria === 'function'
			? this._find(criteria)
			: this._findById(criteria);

		return component && component.instance(this);
	},

	_findById: function(id) {
		var component = this._components[id];
		return component || this._parent && this._parent._findById && this._parent._findById(id);
	},

	_find: function(query) {
		var component = query(this._components);
		return component || this._parent && this._parent._find && this._parent._find(query);
	},

	destroy: function() {
		delete this._components;
	}
};
