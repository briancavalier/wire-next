var undef;

module.exports = Prototype;

function Prototype(factory) {
	this._factory = factory;
}

Prototype.prototype = {
	instance: function() {
		return this._factory.apply(undef, arguments);
	}
};