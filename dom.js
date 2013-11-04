var fluent = require('./config/fluent');
var context = require('./scope/context');

var dom = require('./lib/dom');
var on = require('./lib/on');

module.exports = fluent(function(config) {
	config
		.add('id', function() {
			return dom.id;
		})
		.add('qs', function() {
			return dom.qs;
		})
		.add('qsa', function() {
			return dom.qsa;
		})
		.add('render', function() {
			return function(template, hash, css) {
				return dom.render(template, hash, void 0, css);
			};
		})
		.add('insert', function() {
			return dom.insert;
		})
		.add({ id: 'on', roles: ['facet'], scope: context }, function() {
			return on;
		})
		.add({ roles: ['proxy'], scope: context }, function() {
			return function(instance) {
				if(isNode(instance)) {
					return new NodeProxy(instance);
				}
			};
		});
});

function NodeProxy(node) {
	this._node = node;
}

NodeProxy.prototype.destroy = function() {
	var node = this._node;
	if(node && node.parentNode) {
		node.parentNode.removeChild(node);
	}
};

function isNode(it) {
	return typeof Node === "object"
		? it instanceof Node
		: it != null && typeof it === "object"
			   && typeof it.nodeType === "number"
			   && typeof it.nodeName === "string";
}