var singleton = require('../scope/singleton');
var prototype = require('../scope/prototype');
var meta = require('../lib/metadata');
var when = require('when');

module.exports = fluentConfig;

function fluentConfig(configure) {
	var commands, config;

	commands = [];
	config = new FluentConfig(commands);

	configure(config);

	return function(context) {
		return commands.reduce(function(context, command) {
			return command(context);
		}, context);
	};
}

function FluentConfig(commands) {
	this._commands = commands;
}

FluentConfig.prototype = {
	proto: function(metadata, deps, create, destroy) {
		return this._add(prototype, metadata, deps, create, destroy);
	},

	add: function(metadata, deps, create, destroy) {
		return this._add(singleton, metadata, deps, create, destroy);
	},

	_add: function(scope, metadata, deps, create, destroy) {
		var metaExtensions = { scope: { value: scope }};
		var command;

		if(typeof deps === 'function') {
			destroy = create;
			create = deps;
			deps = void 0;
		}

		if(isConstructor(create)) {
			metaExtensions.type = { value: create };
			create = wrapConstructor(create);
		}

		metadata = extendMeta(metadata, metaExtensions);

		if(deps === void 0) {
			command = function(context) {
				return context.add(metadata, create, destroy);
			};
		} else {
			command = function(context) {
				return context.add(metadata, function(context) {
					var component = this;
					return context.resolve(deps, function() {
						var args = resolveArgs(arguments, deps);
						return create.apply(component, args);
					});
				}, destroy);
			};
		}

		this._commands.push(command);

		return this;
	}
};

function resolveArgs(args, deps) {
	return Array.prototype.map.call(args, function(components, i) {
		if(components.length === 0) {
			throw new Error("No components found: " + deps[i]);
		} else if(components.length === 1) {
			return components[0];
		}

		return components;
	});
}

function isConstructor(create) {
	for(var p in create.prototype) {
		return true;
	}

	return false;
}

function wrapConstructor(C) {
	return function() {
		var instance = Object.create(C.prototype, {
			constructor: {
				value: C,
				enumerable: false
			}
		});

		C.apply(instance, arguments);

		return instance;
	};
}

function extendMeta(metadata, props) {
	return Object.create(meta.normalize(metadata), props);
}
