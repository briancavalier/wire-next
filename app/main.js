var Context = require('wire/Context');
var literalConfig = require('wire/config/literal');
var fluentConfig = require('wire/config/fluent');
var resolveParamNames = require('wire/inject/resolveParamNames');
var type = require('wire/query/type');

var HelloWire = require('app/HelloWire');
var counter = 0;

//var base = fluentConfig(function(config) {
//	config
//		.add({ id: 'message', type: String }, function() {
//			return 'I haz been wired ' + (++counter);
//		})
//		.proto('node', [], function() {
//			var node = document.createElement('h1');
//			node.className = 'hello';
//
//			document.body.appendChild(node);
//			return node;
//		}, function(node) {
//			var p = node.parentNode;
//			if(p) {
//				p.removeChild(node);
//			}
//		})
//		.proto({ id: 'helloWire', type: HelloWire }, ['node'], function(node) {
//			return new HelloWire(node);
//		})
//		.resolve(['helloWire', 'message'], function(helloWire, message) {
//			helloWire.sayHello(message);
//		})
//		.resolve([type(HelloWire), type(String)], function(helloWire, message) {
//			helloWire.sayHello(message);
//		})
//		.resolve(resolveParamNames, function(helloWire, message) {
//			helloWire.sayHello(message);
//		})
//});

var base = literalConfig({
	message: {
		scope: require('wire/scope/prototype'),
		type: String,
		create: function() {
			return 'I haz been wired ' + (++counter);
		}
	},

	node: {
		scope: require('wire/scope/prototype'),
		create: function() {
			var node = document.createElement('h1');
			node.className = 'hello';

			document.body.appendChild(node);
			return node;
		},
		destroy: function(node) {
			var p = node.parentNode;
			if(p) {
				p.removeChild(node);
			}
		}
	},

	helloWire: {
		scope: require('wire/scope/prototype'),
		deps: ['node'],
		create: function(node) {
			return new HelloWire(node);
		}
	}
});

function postCreate(f) {
	return function(context) {
		return Object.create(context, {
			add: { value: function(_, __, create, destroy) {
				context.add(_, __, function() {
					return f(create.apply(this, arguments));
				}, destroy);
				return this;
			}}
		});
	};
}

function preDestroy(f) {
	return function(context) {
		return Object.create(context, {
			add: { value: function(_, __, create, destroy) {
				context.add(_, __, create, function(instance, context) {
					var instance = f(instance);
					if(destroy) {
						return destroy.call(this, instance, context);
					}
				});
				return this;
			}}
		});
	};
}

module.exports = new Context()
	.configure(postCreate(function(x) {
		console.log('creating', x);
		return x;
	}))
	.configure(preDestroy(function(x) {
		console.log('destroying', x);
		return x;
	}))
	.configure(base);
