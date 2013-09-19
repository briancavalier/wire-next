var Context = require('wire/Context');
var fluentConfig = require('wire/config/fluent');

var HelloWire = require('app/HelloWire');

var base = fluentConfig(function(config) {
	config
		.add('message', 'I haz been wired')
		.add('node', function() {
			return document.querySelector('.hello');
		})
		.proto('helloWire', function() {
			return new HelloWire(this.get('node'));
		});
});

module.exports = new Context().configure(base);
