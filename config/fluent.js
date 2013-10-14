var singleton = require('../scope/singleton');
var prototype = require('../scope/prototype');
var inject = require('../inject/deps');
var Promise = require('truth');

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
	create: function(metadata, deps, create, destroy) {
		if(typeof metadata === 'string') {
			metadata = { id: metadata };
		}
		metadata = Object.create(metadata, {
			type: { value: create }
		});
		return this._add(singleton, metadata, deps, function() {
			var instance;

			if(create.prototype && Object.keys(create.prototype).length) {
				instance = Object.create(create.prototype, {
					constructor: {
						value: create,
						enumerable: false
					}
				});

				create.apply(instance, arguments);
			} else {
				instance = create.apply(void 0, arguments);
			}

			return instance;
		}, destroy);
	},

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
		if(typeof metadata === 'string') {
			metadata = { id: metadata };
		}
		var meta = Object.create(metadata, {
			scope: { value: scope }
		});

		this._commands.push(function(context) {
			return context.add(meta, function(context) {
				return Promise.all(context.resolve(deps)).then(function(deps) {
					return create.apply(this, deps);
				});
			}, destroy);
		});

		return this;
	}
};
