var DynamicConfig = require('./DynamicConfig');

module.exports = ConditionalConfig;

function ConditionalConfig(condition, configs) {
	DynamicConfig.call(this, function() {
		return condition(configs);
	});
}

ConditionalConfig.prototype = Object.create(DynamicConfig.prototype);