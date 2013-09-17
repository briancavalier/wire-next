var count = 1;

function HelloWire(node) {
	this._node = node;
	this.index = count++;
}

HelloWire.prototype = {
	// The sayHello method takes a message String and renders it to
	// the DOM Node that was supplied to the constructor.
	sayHello: function(message) {
		this._node.innerHTML += '(HelloWire ' + this.index + '): Hello! ' + message;
	}
};

module.exports = HelloWire;