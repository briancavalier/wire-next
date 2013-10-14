var resolveArray = require('../inject/resolveArray');
var Promise = require('truth');

module.exports = ContextBase;

function ContextBase(parent) {
	this._parent = parent;

	if(parent) {
		var parentDestroy = parent.destroy;
		var self = this;
		parent.destroy = function() {
			parent.destroy = parentDestroy;

			return Promise.cast(self.destroy()).then(function() {
				return parentDestroy.call(parent);
			});
		};
	}
}

ContextBase.prototype.resolve = function(resolver) {
	if(Array.isArray(resolver)) {
		resolver = resolveArray(resolver);
	}

	return resolver(this);
};

ContextBase.prototype.get = function(criteria) {
	var components = this.findComponents(criteria);
	return components.length && components[0].instance(this);
};