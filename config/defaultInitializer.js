var Context = require('../Context');
var enableLifecycle = require('./enableLifecycle');
var enableFacetSupport = require('./enableFacetSupport');
var enableProxySupport = require('./enableProxySupport');
var normalizeMetadata = require('./normalizeMetadata');

var merge = require('wire/config/merge');

var baseConfig = merge([normalizeMetadata, enableLifecycle(), enableProxySupport, enableFacetSupport]);

module.exports = function() {
	return new Context().configure(baseConfig);
};