module.exports = function byRole(role) {
	return function(component) {
		var roles = component.metadata.roles;
		return roles && roles.indexOf(role) >= 0;
	}
}