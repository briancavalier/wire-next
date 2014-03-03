var defaultInitializer = 'wire/config/defaultInitializer';
var autoConfig = {
	'cola': 'cola/wire/init'
};

module.exports = function wireRaveAutoconfig(context) {
	return new WireRave(parsePackages(context.packages, [defaultInitializer, context.app.main]));
};

function WireRave(configs) {
	this._configs = configs;
}

WireRave.prototype.main = function() {
	var configs = this._configs.map(loadConfig);

	return Promise.all(configs).then(function(configs) {
		var init = configs[0];
		var mainSpec = configs[1];

		var wireContext = configs.slice(2).reduce(function(context, config) {
			return context.configure(config);
		}, init());

		return wireContext.configure(mainSpec).startup();
	});
};

function loadConfig(id) {
	return require.async(id);
}

function parsePackages(packages, appendTo) {
	var unique = appendTo.reduce(function(unique, key) {
		unique[key] = 1;
		return unique;
	}, {});

	return Object.keys(packages).reduce(function(configs, key) {
		var name = packages[key].name;

		var config = autoConfig[name];
		if(config && !(name in unique)) {
			unique[name] = 1;
			configs.push(autoConfig[name]);
		}

		return configs;
	}, appendTo);
}
