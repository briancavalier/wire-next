var resolveArray = require('../inject/resolveArray');
var Promise = require('truth');

module.exports = ContextBase;

function ContextBase(parent) {
	this._parent = parent;
	parent && attachToParent(parent, this);
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

ContextBase.prototype.destroy = function() {
	// Intentional no-op
};

function attachToParent(parent, self) {
	var parentDestroy = parent.destroy;
	var selfDestroy = self.destroy;

	parent.destroy = function () {
		return Promise.cast(self.destroy()).then(function () {
			return parentDestroy.call(parent);
		});
	};

	self.destroy = function() {
		parent.destroy = parentDestroy;
		return selfDestroy.call(self);
	};
}
