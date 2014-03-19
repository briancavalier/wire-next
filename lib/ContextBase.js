var when = require('when');

module.exports = ContextBase;

function ContextBase(parent) {
	this._parent = parent;
	this._instances = [];
	parent && attachToParent(parent, this);
}

ContextBase.prototype.startup = function() {
	// Intentional no-op
};

ContextBase.prototype.destroy = function() {
	if(!(this._instances && this._instances.length > 0)) {
		return when.resolve();
	}

	var self = this;
	return when.reduceRight(this._instances, function(_, instance) {
		return instance.destroy();
	}, void 0).then(function() {
		self._instances = void 0;
		return self._parent && self._parent.removeInstance(self);
	});
};

ContextBase.prototype.addInstance = function(instance, destroy) {
	this._instances.push(new Instance(instance, destroy));
};

ContextBase.prototype.removeInstance = function(instance) {
	var found;
	this._instances.some(function(inst, i, instances) {
		if(inst.is(instance)) {
			found = inst.get();
			instances.splice(i, 1);
			return true;
		}
	});

	return found;
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
	parent.addInstance(self, destroyContext);
}

function destroyContext(context) {
	return context.destroy();
}

function createInstance(c) {
	return c.instance(this);
}

function Instance(instance, destroy) {
	this._instance = instance;
	this._destroy = destroy;
}

Instance.prototype.is = function(x) {
	return this._instance === x;
};

Instance.prototype.get = function() {
	return this._instance;
};

Instance.prototype.destroy = function() {
	return typeof this._destroy === 'function'
		? this._destroy(this._instance) : when.resolve();
};