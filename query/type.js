var iterator = require('../lib/iterator');

module.exports = function byType(type) {
	return function(components) {
		return iterator.find(components, function(component) {
			var componentType = component.metadata.type;

			return componentType
				&& (componentType === type || componentType.prototype instanceof type)
		});
	};
};
