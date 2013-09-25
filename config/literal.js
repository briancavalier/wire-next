var singleton = require('../scope/singleton');
var inject = require('../inject/deps');
var resolveArray = require('../inject/resolveArray');

module.exports = function literal(config) {
	return function(context) {
		return Object.keys(config).reduce(function(context, key) {
			var def = config[key];

			var metadata = Object.create(def);
			metadata.id = key;

			var create = def.create;
			if(def.deps) {
				create = inject(createResolver(def.deps), create);
			}

			return context.add(def.scope || singleton, metadata, create, def.destroy);
		}, context);
	};
}

function createResolver(deps) {
	return typeof deps !== 'function' ? resolveArray(deps) : deps;
}
