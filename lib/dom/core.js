exports.id = id;
exports.qs = qs;
exports.qsa = qsa;
exports.insert = insert;
exports.isNode = isNode;

function id(htmlId) {
	return document.getElementById(htmlId);
}

function qs(selector, root) {
	return (root || document).querySelector(selector);
}

function qsa(selector, root) {
	return (root || document).querySelectorAll(selector);
}

function isNode(it) {
	return typeof Node === 'object'
		? it instanceof Node
		: it !== null && typeof it === 'object'
			   && typeof it.nodeType === 'number'
			   && typeof it.nodeName === 'string';
}

/**
 * Places a node into the DOM at the location specified around
 * a reference node.
 * Note: replace is problematic if the dev expects to use the node
 * as a wire component.  The component reference will still point
 * at the node that was replaced.
 * @param node {HTMLElement}
 * @param refNode {HTMLElement}
 * @param location {String} or {Number} "before", "after", "first", "last",
 *   or the position within the children of refNode
 */
function insert(node, refNode, location) {
	var parent, i;

	if ('length' in refNode) {
		for (i = 0; i < refNode.length; i++) {
			placeAt(i === 0 ? node : node.cloneNode(true), refNode[i], location);
		}
		return node;
	}

	parent = refNode.parentNode;

	if(arguments.length < 3) {
		location = 'last';
	}

	// `if else` is more compressible than switch
	if (!isNaN(location)) {
		if (location < 0) {
			location = 0;
		}
		_insertBefore(refNode, node, refNode.childNodes[location]);
	}
	else if(location == 'at') {
		refNode.innerHTML = '';
		_appendChild(refNode, node);
	}
	else if(location == 'last') {
		_appendChild(refNode, node);
	}
	else if(location == 'first') {
		_insertBefore(refNode, node, refNode.firstChild);
	}
	else if(location == 'before') {
		// TODO: throw if parent missing?
		_insertBefore(parent, node, refNode);
	}
	else if(location == 'after') {
		// TODO: throw if parent missing?
		if (refNode == parent.lastChild) {
			_appendChild(parent, node);
		}
		else {
			_insertBefore(parent, node, refNode.nextSibling);
		}
	}
	else {
		throw new Error('Unknown dom insertion command: ' + location);
	}

	return node;
}

// these are for better compressibility since compressors won't
// compress native DOM methods.
function _insertBefore(parent, node, refNode) {
	parent.insertBefore(node, refNode);
}

function _appendChild(parent, node) {
	parent.appendChild(node);
}
