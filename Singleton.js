var undef;

module.exports = Singleton;

function Singleton(factory) {
	this._factory = factory;
}

Singleton.prototype = {
	instance: function() {
		if(typeof this._factory === 'function') {
			this._instance = this._factory.apply(undef, arguments);
			delete this._factory;
		}

		return this._instance;
	}
};