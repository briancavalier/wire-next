var Context = require('wire/Context');
var MethodConfig = require('wire/MethodConfig');
var ConditionalConfig = require('wire/ConditionalConfig');
var Prototype = require('wire/Prototype');

var HelloWire = require('app/HelloWire');

var baseConfig = new ConditionalConfig(
	function(configs) {
		return window.test ? configs.test : configs.prod
	},
	{
		test: new MethodConfig({
			message: 'I iz being tested',

			node: { innerHTML: 'foo' }
		}),

		prod: new MethodConfig({
			message: 'I haz been wired',

			node: function() {
				return document.querySelector('.hello');
			}
		})
	}
);

var appConfig = new MethodConfig({
//	message: 'I haz been wired',
//
//	node: document.querySelector.bind(document, '.hello'),
//
//	helloWire: new Prototype(function() {
//		return new HelloWire(this.node());
//	})

//	helloWire: function(context) {
//		return new HelloWire(context.get('node'));
//	}
	helloWire: new Prototype(function(context) {
		return new HelloWire(context.get('node'));
	})
});

var base = baseConfig.configure(new Context());

//module.exports = appConfig.configure(base);
module.exports = appConfig.configure(new Context(base));
//module.exports = appConfig.configure(new Context());