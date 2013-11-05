var Context = require('../Context');
var enableLifecycle = require('wire/config/enableLifecycle');
var enableFacetSupport = require('wire/config/enableFacetSupport');
var enableProxySupport = require('wire/config/enableProxySupport');

var merge = require('wire/config/merge');

var baseConfig = merge([enableLifecycle(), enableProxySupport, enableFacetSupport]);

module.exports = function() {
	return new Context().configure(baseConfig);
};