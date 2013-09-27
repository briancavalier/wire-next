var singleton = require('../scope/singleton');
var prototype = require('../scope/prototype');
var inject = require('../inject/deps');
var resolveArray = require('../inject/resolveArray');

var slice = Array.prototype.slice;

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

	resolve: function(deps, handler) {
		this._commands.push(function(context) {
			return context.resolve(deps, handler);
		});

		return this;
	},

	_add: function(scope, metadata, deps, create, destroy) {
		if(typeof create === 'undefined') {
			create = typeof deps === 'function' ? deps : function() { return deps; };
		} else {
			create = inject(createResolver(deps), create);
		}

		this._commands.push(function(context) {
			return context.add(scope, metadata, create, destroy);
		});

		return this;
	}
};

function createResolver(deps) {
	return typeof deps !== 'function' ? resolveArray(deps) : deps;
}
