var byRole = require('../query/role');
var when = require('when');

var hasFacetRole = byRole('facet');

module.exports = function enableFacetSupport(context) {
	return context
		.add('@lifecycle', function() {
			return {
				postCreate: function(instance, component, context) {
					if(!hasFacetRole(component)) {
						return instance;
					}

					var connections = context.get(byRole('connection-manager'));
					return when.join(instance, connections).spread(wrapFacet);
				}
			};
		})
		.add({ roles: { 'connection-manager': true }, scope: context },
			function() {
				return [];
			},
			function(connections) {
				return when.map(connections, function(remove) {
					return remove();
				});
			}
		);
};

function wrapFacet(facet, connections) {
	return function managedFacet() {
		var disconnect = facet.apply(this, arguments);
		connections.push.apply(connections, disconnect);
		return disconnect;
	};
}
