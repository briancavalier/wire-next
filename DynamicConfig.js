module.exports = DynamicConfig;

function DynamicConfig(configFactory) {
	this._configFactory = configFactory;
}

DynamicConfig.prototype = {
	configure: function(context) {
		var config = this._configFactory();

		return config.configure(context);
	}
}