define(function(require) {
	var defaultInitializer = './config/defaultInitializer';

	return {
		load: function(resourceId, resourceLocalRequire, loaded, cfg) {
			var init = (cfg && cfg.init) || defaultInitializer;

			resourceLocalRequire([resourceId], function(config) {
				require([init], function(init) {
					loaded(init().configure(config));
				}, loaded.error);
			}, loaded.error);
		}
	};
});

