var fluent = require('./config/fluent');
var context = require('./scope/context');
var dom = require('./lib/dom/core');
var domReady = require('./lib/dom/ready');
var on = require('./lib/dom/on');
var render = require('./lib/dom/render');
var NodeProxy = require('./lib/dom/NodeProxy');

var when = require('when');

module.exports = fluent(function wireDomConfig(config) {
	return config
		.add('domReady', function() {
			return when.promise(function(resolve) {
				domReady(resolve);
			});
		})
		.add('id', ['domReady'], function() {
			return dom.id;
		})
		.add('qs', ['domReady'], function() {
			return dom.qs;
		})
		.add('qsa', ['domReady'], function() {
			return dom.qsa;
		})
		.add('render', function() {
			return function(template, hash, css) {
				return render(template, hash, void 0, css);
			};
		})
		.add('insert', function() {
			return dom.insert;
		})
		.add({ id: 'on', roles: { facet: true }, scope: context }, function() {
			return on;
		})
		.add({ roles: { proxy: true }, scope: context }, function() {
			return function(instance) {
				if(dom.isNode(instance)) {
					return new NodeProxy(instance);
				}
			};
		});
});
