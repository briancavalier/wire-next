var Context = require('wire/Context');
var methodConfig = require('wire/MethodConfig');
var dynamicConfig = require('wire/DynamicConfig');
var Prototype = require('wire/Prototype');

var HelloWire = require('app/HelloWire');

var baseConfig = dynamicConfig(function() {
		return window.test
		? methodConfig({
			message: 'I iz being tested',

			node: { innerHTML: 'foo' }
		})
		: methodConfig({
			message: 'I haz been wired',

			node: function() {
				return document.querySelector('.hello');
			}
		})
	}
);

var appConfig = methodConfig({
//	helloWire: function(context) {
//		return new HelloWire(context.get('node'));
//	}
	helloWire: new Prototype(function(context) {
		return new HelloWire(context.get('node'));
	})
});

var base = baseConfig(new Context());

//module.exports = appConfig.configure(base);
module.exports = appConfig(new Context(base));
//module.exports = appConfig.configure(new Context());