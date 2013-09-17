var dynamicConfig = require('./DynamicConfig');

module.exports = conditionalConfig

function conditionalConfig(condition, configs) {
	return dynamicConfig(function() {
		return condition(configs);
	});
};
