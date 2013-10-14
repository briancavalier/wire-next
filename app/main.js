var Context = require('wire/Context');
var fluentConfig = require('wire/config/fluent');
var enableLifecycle = require('wire/config/enableLifecycle');
var type = require('wire/query/type');
var byRole = require('wire/query/role');
var Promise = require('truth');

var HelloWire = require('app/HelloWire');
var counter = 0;

var base = fluentConfig(function(config) {
	config
//		.add({ roles: ['lifecycle'] }, [], function() {
//			return {
//				postCreate: function(x) {
//					console.log('creating', x);
//					return x;
//				},
//				preDestroy: function(x) {
//					console.log('destroying', x);
//					var p = x.parentNode;
//					if (p) {
//						p.removeChild(x);
//					}
//					return x;
//				}
//			}
//		})
		.add({ roles: ['lifecycle'] }, [], function() {
			var proxies = new Map();

			return {
				postCreate: function(instance, component, context) {
					if(component.metadata.roles && component.metadata.roles.indexOf('proxy') >= 0) {
						return instance;
					}

					var proxiers = context.findComponents(byRole('proxy'));

					return proxiers.reduce(function(instance, proxier) {
						return when(proxier.instance(context), function(proxier) {

							return typeof proxier !== 'function' ? instance
								: when(instance, function(instance) {
									if(proxier === instance) {
										return instance;
									}
									var proxy = proxier(instance);
									if(proxy) {
										proxies.set(instance, proxy);
										return proxy;
									}

									return instance;
								});
						});
					}, instance);

				},
				preDestroy: function(instance) {
					var proxy = proxies.get(instance);
					if(proxy) {
						return when(proxy.destroy(), function() {
							return instance;
						});
					}
					return instance;
				}
			}
		})
		.add({ roles: ['proxy'] }, [], function() {
			return function(x) {
				console.log('proxy 1', x);
				return x;
			}
		})
		.add({ roles: ['proxy'] }, [], function() {
			return function(x) {
				console.log('proxy 2', x);
				return x;
			}
		})
		.proto('message', [], function() {
			return 'I haz been wired ' + (++counter);
		})
		.proto('node', [], function() {
			var node = document.createElement('h1');
			node.className = 'hello';

			document.body.appendChild(node);
			return node;
		})
		.proto('helloWire', ['node'], function(node) {
			return new HelloWire(node);
		})
});

module.exports = new Context()
	.configure(enableLifecycle())
	.configure(base);

function when(x, f) {
	return Promise.cast(x).then(f);
}

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