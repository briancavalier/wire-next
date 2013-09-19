var Map = require('./lib/Map');

percontext.prototype = require('./config/base');

module.exports = percontext;

function percontext(factory) {
	var instancesByContext = new Map();

	instance.prototype = percontext.prototype;

	return instance;

	function instance() {
		var currentContext, contextInstance;

		currentContext = this.currentContext;

		if (instancesByContext.has(currentContext)) {
			contextInstance = instancesByContext.get(currentContext);
		} else {
			contextInstance = factory.apply(this, arguments);
			instancesByContext.set(currentContext, contextInstance);
		}

		return contextInstance;
	}
}