var resolveArray = require('../inject/resolveArray');
var Promise = require('truth');

module.exports = LegacyContext;

function LegacyContext(wireContext, parent) {
	this._wireContext = wireContext;
	this._parent = parent;

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

LegacyContext.prototype = {
	resolve: function(resolve, inject) {
		if(Array.isArray(resolve)) {
			resolve = resolveArray(resolve);
		}

		return Promise.all(resolve(this, inject)).then(inject.apply.bind(inject, this));
	},

	get: function(criteria) {
		var component = typeof criteria === 'function'
			? this._find(criteria)
			: this._findById(criteria);

		return component && component.instance(this);
	},

	_findById: function(id) {
		var wireContext, parent;

		wireContext = this._wireContext;
		parent = this._parent;

		return {
			instance: function() {
				return Promise.cast(wireContext).then(function(context) {
					return context.resolve(id);
				}, function() {
					return parent.get(id);
				});
			}
		}
	},

	_find: function(criteria) {
		if(this._parent) {
			return this._parent._find(criteria);
		}

		throw new Error('LegacyContext only supports finding components by id');
	},

	destroy: function() {
		return this._wireContext.destroy();
	}
};
