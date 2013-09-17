var Context = require('wire/Context');
var Singleton = require('wire/Singleton');
var Prototype = require('wire/Prototype');

var HelloWire = require('app/HelloWire');

var base = new Context();
var app = new Context(base);

app.register('helloWire', new Prototype(function(context) {
	return new HelloWire(context.get('node'));
}));

base.register('message', new Singleton(function() {
	return 'I haz been wired';
}));

base.register('node', new Singleton(document.querySelector.bind(document, '.hello')));

module.exports = app;