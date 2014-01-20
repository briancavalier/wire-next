define(function(require) {
	var defaultInitializer = './config/defaultInitializer';

	var autoConfig = {
		'cola': 'app/lib/bard-init'
	};

	var slice = Array.prototype.slice;

	return {
		load: function(resourceId, resourceLocalRequire, loaded, cfg) {
			var init = (cfg && cfg.init) || defaultInitializer;

			var configs = [init].concat(parsePackages(cfg.packages));

			resourceLocalRequire([resourceId], function(appConfig) {
				require(configs, function(init) {

					var configs = slice.call(arguments, 1);

					var context = configs.reduce(function(context, config) {
						return context.configure(config);
					}, init());

					context.configure(appConfig).startup();

				}, loaded.error);
			}, loaded.error);
		}
	};

	function parsePackages(packages) {
		return Object.keys(packages).reduce(function(configs, key) {
			var config = autoConfig[packages[key].name];
			if(config) {
				configs.push(config);
			}

			return configs;
		}, []);
	}
});

