module.exports = NodeProxy;

function NodeProxy(node) {
	this._node = node;
}

NodeProxy.prototype.destroy = function() {
	var node = this._node;
	if(node && node.parentNode) {
		node.parentNode.removeChild(node);
	}
};
