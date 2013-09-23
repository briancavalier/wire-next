module.exports = function injectDependencies(resolver, factory) {
	return function() {
		return factory.apply(this, resolver(this, factory))
	};
}