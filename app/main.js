var Context = require('wire/Context');
var fluent = require('wire/config/fluent');
var merge = require('wire/config/merge');
var enableLifecycle = require('wire/config/enableLifecycle');
var enableProxySupport = require('wire/config/enableProxySupport');
var type = require('wire/query/type');
var Promise = require('truth');

var HelloWire = require('app/HelloWire');
var counter = 0;

var base = function(context) {
	return context
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
		.add({ roles: ['proxy'] }, function() {
			return function(x) {
				console.log('proxy 1', x);
				return x;
			}
		})
		.add({ roles: ['proxy'] }, function() {
			return function(x) {
				console.log('proxy 2', x);
				return x;
			}
		})
		.add('message', function() {
			return 'I haz been wired ' + (++counter);
		})
		.add('node', function() {
			var node = document.createElement('h1');
			node.className = 'hello';

			document.body.appendChild(node);
			return node;
		})
		.add('helloWire', function(context) {
			return Promise.cast(context.get('node')).then(function(node) {
				return new HelloWire(node);
			});
		});
};

module.exports = merge([enableLifecycle(), base]);

//var base = literalConfig({
//	message: {
//		scope: require('wire/scope/prototype'),
//		type: String,
//		create: function() {
//			return 'I haz been wired ' + (++counter);
//		}
//	},
//
//	node: {
//		scope: require('wire/scope/prototype'),
//		create: function() {
//			var node = document.createElement('h1');
//			node.className = 'hello';
//
//			document.body.appendChild(node);
//			return node;
//		},
//		destroy: function(node) {
//			var p = node.parentNode;
//			if(p) {
//				p.removeChild(node);
//			}
//		}
//	},
//
//	helloWire: {
//		scope: require('wire/scope/prototype'),
//		using: ['node'],
//		create: function(node) {
//			return new HelloWire(node);
//		}
//	}
//});