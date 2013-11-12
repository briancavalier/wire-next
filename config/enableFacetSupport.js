var prototype = require('../scope/prototype');
var byRole = require('../query/role');
var when = require('when');
var all = when.all;

var hasFacetRole = byRole('facet');

module.exports = function enableFacetSupport(context) {
	return context
		.add({ roles: ['lifecycle'] }, function() {
			return {
				postCreate: function(instance, component, context) {
					if(!hasFacetRole(component)) {
						return instance;
					}

					var connections = context.get(byRole('connection-manager'));
					return all([instance, connections]).spread(wrapFacet);
				}
			}
		})
		.add({ roles: ['connection-manager'], scope: context },
			function() {
				return [];
			},
			function(connections) {
				return all(connections.map(function(remove) {
					return remove();
				}));
			}
		);
};

function wrapFacet(facet, connections) {
	return function managedFacet() {
		var disconnect = facet.apply(this, arguments);
		connections.push.apply(connections, disconnect);
		return disconnect;
	}
}
