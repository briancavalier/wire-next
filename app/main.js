var fluent = require('wire/config/fluent');
var merge = require('wire/config/merge');
var enableLifecycle = require('wire/config/enableLifecycle');
var enableFacetSupport = require('wire/config/enableFacetSupport');
var enableProxySupport = require('wire/config/enableProxySupport');
var dom = require('wire/dom');

var HelloWire = require('app/HelloWire');
var counter = 0;

var base = fluent(function(config) {
	return config
		.proto('message', function() {
			return 'I haz been wired ' + (++counter);
		})
		.proto('node', ['render', 'insert'], function(render, insert) {
			return insert(render('<h1 class="hello"></h1>'), document.body, 'first');
		})
		.proto('helloWire', ['node'], HelloWire)
		.add('button', ['render', 'insert'], function(render, insert) {
			return insert(render('<button>Destroy</button>'), document.body,
				'last');
		})
});

module.exports = merge([enableLifecycle(), enableProxySupport, enableFacetSupport, dom, base]);
