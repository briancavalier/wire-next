var Context = require('wire/Context');
var fluent = require('wire/config/fluent');
var merge = require('wire/config/merge');
var enableLifecycle = require('wire/config/enableLifecycle');
var enableProxySupport = require('wire/config/enableProxySupport');
var Promise = require('truth');

var HelloWire = require('app/HelloWire');
var counter = 0;

var base = fluent(function(config) {
	return config
		.add({ roles: ['lifecycle'] }, function() {
			return {
				postCreate: function(x) {
					console.log('creating', x);
					return x;
				},
				preDestroy: function(x) {
					console.log('destroying', x);
					return x;
				}
			}
		})
		.add('message', function() {
			return 'I haz been wired ' + (++counter);
		})
		.proto('node', function() {
			var node = document.createElement('h1');
			node.className = 'hello';

			document.body.appendChild(node);
			return node;
		}, function(node) {
			if(node.parentNode) {
				node.parentNode.removeChild(node);
			}
		})
		.proto('helloWire', ['node'], HelloWire);
});

module.exports = merge([enableLifecycle(), enableProxySupport, base]);
