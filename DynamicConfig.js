module.exports = dynamicConfig;

function dynamicConfig(configFactory) {
	return function(context) {
		var config = configFactory();

		return config(context);
	};
}
