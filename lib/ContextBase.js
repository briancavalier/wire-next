var resolveArray = require('../inject/resolveArray');
var Promise = require('truth');

module.exports = ContextBase;

function ContextBase(parent) {
	this._parent = parent;
}

ContextBase.prototype.resolve = function(resolve, inject) {
	if(Array.isArray(resolve)) {
		resolve = resolveArray(resolve);
	}

	return Promise.all(resolve(this, inject)).then(inject.apply.bind(inject, this));
};

ContextBase.prototype.get = function(criteria) {
	var component = this.findComponent(criteria);

	return component && component.instance(this);
};