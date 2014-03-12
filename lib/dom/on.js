var dom = require('./core');

module.exports = on;

var thisLooksLikeCssRx = /#|\.|-|[^,]\s[^,]/;
var eventSplitterRx = /\s*,\s*/;

var contains;
if (document && document.compareDocumentPosition) {
	contains = function w3cContains (refNode, testNode) {
		return (refNode.compareDocumentPosition(testNode) & 16) == 16;
	};
}
else {
	contains = function oldContains (refNode, testNode) {
		return refNode.contains(testNode);
	};
}

function on(eventString, node, handler) {
	var events = splitEventSelectorString(eventString);

	return events.map(function (event) {
		return registerEvent(node, event, makeEventHandler(handler), events.selector);
	});
}

function registerEvent(node, event, handler /*, selector */) {
	var selector = arguments[3];

	if (selector) {
		handler = filteringHandler(node, selector, handler);
	}

	node.addEventListener(event, handler, false);

	return function remove () {
		node.removeEventListener(node, handler, false);
	};
}

function makeEventHandler (handler) {
	return function (e) {
		preventDefaultIfNav(e);
		return handler.apply(this, arguments);
	};
}

function filteringHandler (node, selector, handler) {
	return function (e) {
		var target, matches;

		// if e.target matches the selector, call the handler
		target = e.target;
		matches = dom.qsa(selector, node);

		Array.prototype.forEach.call(matches, function(match) {
			if (target == match || contains(match, target)) {
				e.selectorTarget = match;
				handler(e);
			}
		});
	};
}

function preventDefaultIfNav (e) {
	var node, nodeName, nodeType, isNavEvent;
	node = e.selectorTarget || e.target || e.srcElement;
	if (node) {
		nodeName = node.tagName;
		nodeType = node.type && node.type.toLowerCase();
		// catch links and submit buttons/inputs in forms
		isNavEvent = ('click' == e.type && 'A' == nodeName)
			|| ('submit' == nodeType && node.form)
			|| ('submit' == e.type && 'FORM' == nodeName);
		if (isNavEvent) {
			e.preventDefault();
		}
	}
}

function never () {}

/**
 * Splits an event-selector string into one or more combinations of
 * selectors and event types.
 * @private
 * @param {string} eventString
 * @param {string?} defaultSelector {String}
 * @returns {Array} an array of event names. if a selector was specified
 *   the array has a selectors {String} property
 */
function splitEventSelectorString (eventString, defaultSelector) {
	var split, events, selectors;

	// split on first colon to get events and selectors
	split = eventString.split(':', 2);
	events = split[0];
	selectors = split[1] || defaultSelector;

	// look for css stuff in event (dev probably forgot event?)
	// css stuff: hash, dot, spaces without a comma
	if (thisLooksLikeCssRx.test(events)) {
		throw new Error('on! resolver: malformed event-selector string (event missing?)');
	}

	// split events
	events = events.split(eventSplitterRx);
	if (selectors) {
		events.selector = selectors;
	}

	return events;
}