module.exports = function resolveParamNames() {
	return function(context, factory) {
		var params = /\(([^\)]*)/.exec(factory.toString());

		params = params && params[1];
		if(params) {
			params = params.split(/\s*,\s*/);
			return params.map(function(name) {
				return context.get(name);
			});
		}

		return [];
	};
};