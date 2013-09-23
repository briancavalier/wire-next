module.exports = function resolveArray(deps) {
	return function(context) {
		return deps.map(function(dep) {
			return context.get(dep);
		});
	};
};