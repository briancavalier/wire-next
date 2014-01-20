var when = require('when');

module.exports = ContextBase;

function ContextBase(parent) {
	this._parent = parent;
	parent && attachToParent(parent, this);
}

ContextBase.prototype.startup = function() {
	// Intentional no-op
};

ContextBase.prototype.destroy = function() {
	// Intentional no-op
};

ContextBase.prototype.resolve = function(array, handler) {
	var context = this;
	var resolved = array.map(function(dep) {
		return when.all(context.get(dep));
	});

	return when.all(resolved).spread(handler);
};

ContextBase.prototype.get = function(criteria) {
	return this.findComponents(criteria).map(createInstance, this);
};

function attachToParent(parent, self) {
	var parentDestroy = parent.destroy;
	var selfDestroy = self.destroy;

	parent.destroy = function () {
		return when(self.destroy(), function () {
			return parentDestroy.call(parent);
		});
	};

	self.destroy = function() {
		parent.destroy = parentDestroy;
		return selfDestroy.call(self);
	};
}

function createInstance(c) {
	return c.instance(this);
}