var Base = require('../lib/ContextBase');
var Promise = require('truth');

module.exports = LegacyContext;

function LegacyContext(createWireContext, parent) {
	Base.call(this, parent);

	this._wireContext = createWireContext;

	if(parent) {
		var parentDestroy = parent.destroy;
		var self = this;
		parent.destroy = function() {
			parent.destroy = parentDestroy;

			return self.destroy().then(function() {
				return parentDestroy.call(parent);
			});
		}
	}
}

LegacyContext.prototype = Object.create(Base.prototype);

LegacyContext.prototype.findComponent = function(id) {
	if(typeof id !== 'string') {
		return this._parent && this._parent.findComponent(id);
	}

	var self, parent;

	self = this;
	parent = this._parent;

	return {
		instance: function() {
			if(typeof self._wireContext === 'function') {
				self._wireContext = self._wireContext();
			}

			return Promise.cast(self._wireContext).then(function(context) {
				return context.resolve(id);
			}, function() {
				return parent.get(id);
			});
		}
	}
};

LegacyContext.prototype.destroy = function() {
	return this._wireContext.destroy();
};