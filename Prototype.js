module.exports = Prototype;

function Prototype(factory) {
	this._factory = factory;
}

Prototype.prototype = {
	instance: function(context) {
		return this._factory(context);
	}
};