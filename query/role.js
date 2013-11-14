module.exports = function byRole(role, matchValue) {
	return function(component) {
		var roles = component.metadata.roles;
		return roles && role in roles
			? typeof matchValue === 'function' ? matchValue(roles[role]) : true
			: false;
	};
};