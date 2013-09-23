var config = require('./base');
var singleton = require('../scope/singleton');
var prototype = require('../scope/prototype');
var injectDeps = require('../inject/deps');
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
			command(context);
			return context;
		}, context);
	};
}

function FluentConfig(commands) {
	this._commands = commands;
}

FluentConfig.prototype = {
	proto: function(metadata, deps, factory) {
		return this._add(prototype, metadata, deps, factory);
	},

	add: function(metadata, deps, factory) {
		return this._add(singleton, metadata, deps, factory);
	},

	_add: function(scope, metadata, deps, factory) {
		var resolver;

		if(typeof factory === 'undefined') {
			factory = typeof deps === 'function' ? deps : function() { return deps; };
		} else {
			resolver = typeof deps !== 'function' ? resolveArray(deps) : deps;
			factory = injectDeps(resolver, factory);
		}

		this._commands.push(function(context) {
			return context.add(scope, metadata, factory);
		});

		return this;
	}
};
