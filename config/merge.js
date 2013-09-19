module.exports = mergeConfigs;

function mergeConfigs() {
	var args = Array.prototype.slice.call(arguments);
	return function(context) {
		return args.reduce(function(context, configure) {
			return configure(context);
		}, context);
	}
}