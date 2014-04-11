var Base = require('./lib/ContextBase');
var MetadataSearch = require('./lib/MetadataSearch');

module.exports = Context;

function Context(parent) {
	Base.call(this, parent);
	this._components = {};
	this._metadataSearch = new MetadataSearch();
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
	
	this._metadataSearch.add(metadata, components[id]);

	return this;
};

Context.prototype.findComponents = function(criteria) {
	var recurse = arguments[1] !== false && this._parent;
	
	var components = typeof criteria === 'function' ? this._queryComponents(criteria)
		: this._metadataSearch.find(criteria);
	
	return recurse
		? components.concat(this._parent.findComponents(criteria))
		: components;
};

Context.prototype.destroy = function() {
	delete this._metadataSearch;
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
