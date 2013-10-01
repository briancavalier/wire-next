module.exports = function byType(type) {
	return function(components) {
		var componentType, component;
		for(var id in components) {
			component = components[id];
			componentType = component.metadata.type;

			if(componentType
				&& (componentType === type || componentType.prototype instanceof type)) {
				return component;
			}
		}
	};
};
