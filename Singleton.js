module.exports = Singleton;

function Singleton(factory) {
	this._factory = factory;
}

Singleton.prototype = {
	instance: function(context) {
		if(typeof this._factory === 'function') {
			this._instance = this._factory(context);
			delete this._factory;
		}

		return this._instance;
	}
};