var Base = require('../lib/ContextBase');
var when = require('when');
var memoize = require('../lib/fn').memoize;

module.exports = LegacyContext;

function LegacyContext(createWireContext, parent) {
	Base.call(this, parent);
	this._wireContext = createWireContext;
	this._byId = memoize(this._byId);
}

LegacyContext.prototype = Object.create(Base.prototype);

LegacyContext.prototype.findComponents = function(id) {
	var recurse;

	if(typeof id !== 'string') {
		recurse = arguments[1] !== false && this._parent;
		return recurse ? this._parent.findComponents(id) : [];
	}

	return this._byId(id);
};

LegacyContext.prototype._byId = function(id) {
	var self, parent;

	self = this;
	parent = this._parent;

	return [{
		instance: function() {
			if(typeof self._wireContext === 'function') {
				self._wireContext = self._wireContext();
			}

			return when(self._wireContext, function(wireContext) {
				return wireContext.resolve(id);
			}, function() {
				return parent.get(id);
			});
		}
	}];
};

LegacyContext.prototype.destroy = function() {
	return this._wireContext.destroy();
};
