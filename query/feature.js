module.exports = function feature(name) {
	return function(component) {
		var features = component.metadata.features;
		return features && features.indexOf(name) >= 0;
	};
};