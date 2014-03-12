var defaultInitializer = require('./config/defaultInitializer');

module.exports = function wireRaveAutoconfig(context) {
	return new WireRave(context, defaultInitializer);
};

function WireRave(context, initializer) {
	this.raveContext = context;
	this.initializer = initializer;
}

WireRave.prototype.main = function() {
	var self = this;
	var baseContext = this.initializer();
	var appContext = this.initializer(baseContext);

	baseContext = self._addMetadata(baseContext);

	return baseContext.resolve(['@configuration'], function(configs) {
		return self._configure(configs, appContext);
	}).then(function(context) {
		return context.startup();
	});
};

WireRave.prototype._configure = function(configs, context) {
	return Promise.all(configs.map(function (config) {
		return loadConfig(config);
	})).then(function (apps) {
		return apps.reduce(function (context, config) {
			return context.configure(config);
		}, context);
	});
};

WireRave.prototype._addMetadata = function(context) {
	var rc = this.raveContext;
	var app = rc.app;
	if(app) {
		context.add(app.name + '@app', function() {
			return app;
		}).add(app.main + '@configuration', function() {
			return app.main;
		});
	}

	var seen = {};
	return Object.keys(rc.packages)
		.reduce(function(pkgs, pkgName) {
			var pkg = rc.packages[pkgName];
			if(!seen[pkg.name]) {
				seen[pkg.name] = 1;
				pkgs.push(pkg);
			}
			return pkgs;
		}, [])
		.reduce(addPackage, context);
};

function addPackage(context, pkg) {
	context = context.add(pkg.name + '@package', function() {
		return pkg;
	});
	if(pkg.metadata && pkg.metadata.wire) {
		var wire = pkg.metadata.wire;
		context = context.add(pkg.name + '@configuration', function() {
			return wire;
		})
	}

	return context;

}

function loadConfig(id) {
	return require.async(id);
}
