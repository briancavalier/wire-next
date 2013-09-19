var config = require('./base');
var singleton = require('../Singleton');
var prototype = require('../Prototype');

module.exports = fluentConfig;

function fluentConfig(configure) {

	var commands, config;

	commands = [];
	config = new FluentConfig(commands);

	configure(config);

	return function(context) {
		return commands.reduce(function(context, config) {
			config(context);
			return context;
		}, context);
	};
}

function FluentConfig(commands) {
	this._commands = commands;
}

FluentConfig.prototype = {
	proto: function(name, deps, factory) {
		var args = Array.prototype.slice.call(arguments);
		factory = args[args.length - 1];

		if(factory.prototype !== prototype.prototype) {
			args[args.length - 1] = prototype(factory);
		}

		return this.add.apply(this, args);
	},

	add: function(name, deps, factory) {

		if(arguments.length < 3) {
			this._commands.push(function(context) {
				return context.add(name, createComponent(deps));
			});

		} else {

			factory = createComponent(factory);

			var wrappedFactory = function() {
				var context = this;
				return factory.apply(context, deps.map(function(dep) {
					return typeof dep === 'string' ? context.get(dep) : dep;
				}));
			};

			this._commands.push(function(context) {
				return context.add(name, wrappedFactory);
			});

		}

		return this;
	}
};

function createComponent(x) {
	if(typeof x === 'function') {
		if(x.prototype === config) {
			return x;
		}

		return singleton(x);
	}

	return singleton(function() {
		return x;
	});
}
