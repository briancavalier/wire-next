var when = require('when');

module.exports = ContextBase;

function ContextBase(parent) {
	this._parent = parent;
	parent && attachToParent(parent, this);
}

ContextBase.prototype.startup = function() {
	// Intentional no-op
}

ContextBase.prototype.destroy = function() {
	// Intentional no-op
};

ContextBase.prototype.resolve = function(array, handler) {
	var context = this;
	var resolved = array.map(function(dep) {
		return context.get(dep);
	});

	return when.all(resolved).then(function(array) {
		return handler.apply(void 0, array);
	});
};

ContextBase.prototype.get = function(criteria) {
	return createInstances(this.findComponents(criteria), this);
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

function createInstances(components, context) {
	if(components.length === 0) {
		throw new Error('No components found');
	} else if(components.length > 0) {
		return components[0].instance(context);
	}

	return components.map(function(c) { c.instance(context); });
}