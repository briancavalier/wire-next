var byRole = require('../query/role');
var Map = require('../lib/Map');
var when = require('when');

var hasProxyRole = byRole('proxy');

module.exports = function(context) {
	return context.add({ roles: ['lifecycle'] }, function() {
		var proxies = new Map();

		return {
			postCreate: function(instance, component, context) {
				var proxiers;

				if(hasProxyRole(component)) {
					return instance;
				}

				proxiers = context.findComponents(hasProxyRole);

				return proxiers.reduce(function(instance, proxier) {
					return when(proxier.instance(context), function(proxier) {

						return typeof proxier !== 'function'
							? instance
							: when(instance, function(instance) {
								if(proxier === instance) {
									return instance;
								}
								// TODO: Pass in existing proxy also
								// to allow decoration/extension?
								var proxy = proxier(instance);
								if(proxy) {
									proxies.set(instance, proxy);
								}

								return instance;
							});
					});
				}, instance);

			},
			preDestroy: function(instance) {
				var proxy = proxies.get(instance);
				if(proxy && typeof proxy.destroy === 'function') {
					return proxy.destroy();
				}
				return instance;
			}
		}
	})
};
