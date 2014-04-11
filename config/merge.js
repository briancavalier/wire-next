module.exports = mergeConfigs;

var reduce = Array.prototype.reduce;

function mergeConfigs(configs) {
	return function(context) {
		return reduce.call(configs, function(context, configure) {
			return configure(context);
		}, context);
	};
}