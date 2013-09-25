module.exports = function injectDependencies(resolver, create) {
	return function(context) {
		return create.apply(this, resolver(context, create))
	};
}