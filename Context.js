var Base = require('./lib/ContextBase');
var meta = require('./lib/metadata');
var merge = require('./config/merge');

module.exports = Context;

function Context(parent) {
	Base.apply(this, arguments);
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

Context.prototype = Object.create(Base.prototype);

Context.prototype.configure = function(config) {
	return merge(arguments)(this);
};

Context.prototype.add = function(scope, metadata, create, destroy) {
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
};

Context.prototype.findComponent = function(criteria) {
	var component = criteria === 'function'
		? criteria(this._components)
		: this._components[criteria];

	return component || this._parent && this._parent.findComponent(criteria);
}

Context.prototype.destroy = function() {
	delete this._components;
};
