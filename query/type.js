module.exports = function byType(type) {
	return function(component) {
		var componentType = component.metadata.type;

		return componentType
			&& (componentType === type || componentType.prototype instanceof type);
	}
};
