define(function(require) {
	var Context = require('./Context');

	return {
		load: function(resourceId, require, loaded, cfg) {
			require([resourceId], function(config) {
				new Context().configure(config).configure(loaded);
			}, loaded.error);
		}
	};
});

