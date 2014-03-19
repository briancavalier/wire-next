var Base = require('./lib/ContextBase');

module.exports = Context;

function Context(parent) {
	Base.apply(this, arguments);
	this._components = {};
}

Context.prototype = Object.create(Base.prototype);

Context.prototype.configure = function(config) {
	return config(this);
};

Context.prototype.add = function(metadata, create, destroy) {
	var id = metadata.id;
	var components = this._components;

	if (id in components) {
		throw new Error('Component named ' + id + ' already registered');
	}

	components[id] = {
		instance: metadata.scope(create, destroy),
		metadata: metadata,
		declaringContext: this
	};

	return this;
};

Context.prototype.findComponents = function(criteria) {
	var recurse = arguments[1] !== false && this._parent;
	var components = typeof criteria === 'function' ? this._queryComponents(criteria)
		: criteria in this._components ? [this._components[criteria]] : [];

	return recurse
		? components.concat(this._parent.findComponents(criteria))
		: components;
};

Context.prototype.destroy = function() {
	delete this._components;
	return Base.prototype.destroy.apply(this, arguments);
};

Context.prototype._queryComponents = function(criteria) {
	var components = this._components;
	return Object.keys(components).reduce(function(found, id) {
		var component = components[id];

		if(criteria(component)) {
			found.push(component);
		}

		return found;
	}, []);
};
