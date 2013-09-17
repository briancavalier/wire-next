module.exports = ConditionalConfig;

function ConditionalConfig(condition, configs) {
	this._condition = condition;
	this._configs = configs;
}

ConditionalConfig.prototype = {
	configure: function(context) {
		var config = this._condition(this._configs);

		return config && config.configure(context);
	}
}