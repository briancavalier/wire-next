module.exports = function(condition, configs) {
	return function(context) {
		var config = condition(configs);

		return config && config(context);
	};
};
