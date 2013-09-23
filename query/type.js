module.exports = function byType(type) {

	return function(components) {

		var id, component, componentType;

		for(id in components) {

			component = components[id];
			componentType = component.metadata.type;

			if(componentType
				&& (componentType === type || componentType.prototype instanceof type)) {
				return component;
			}
		}
	};
};
