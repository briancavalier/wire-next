var wire = require('wire/simple/wire');

var HelloWire = require('./HelloWire');

module.exports = wire({
	message: 'I haz been wired',

	node: document.querySelector.bind(document, '.hello'),

	helloWire: wire.proto(function() {
		return new HelloWire(this.node());
	})
});

//var base = wire({
//	message: 'I haz been wired',
//
//	node: document.querySelector.bind(document, '.hello')
//});
//
//module.exports = wire({
//	helloWire: wire.proto(function() {
//		return new HelloWire(this.node());
//	})
//}, base);
