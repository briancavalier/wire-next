var defaultInitializer = 'wire/config/defaultInitializer';
var autoConfig = {
	'cola': 'cola/wire/init'
};

//var hardcodedMainSpecFixMe = 'boot-todos/main';

module.exports = function bootAutoconfig(context) {
	var configs = [defaultInitializer, context.main];

	configs = parsePackages(context.packages, configs)
		.map(normalizeAndImport(context.loader, context.main));

	return Promise.all(configs).then(function(configs) {
		var init = configs[0];
		var mainSpec = configs[1];

		var wireContext = configs.slice(2).reduce(function(context, config) {
			return context.configure(config);
		}, init());

		return wireContext.configure(mainSpec).startup();
	}).catch(function(e) {
			console.error(e.stack);
		});
};

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

function normalizeAndImport(loader, referrerName) {
	return function(id) {
		return loader.import(loader.normalize(id, referrerName));
	};
}
