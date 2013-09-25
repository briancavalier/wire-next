var Map = require('./Map');

exports.once = function(f) {
	var called, value;

	return function() {
		if(!called) {
			called = true;
			value = f.apply(this, arguments);
		}

		return value;
	};
};

exports.memoize = function(f) {
	var cache = new Map();

	return function(x) {
		var value;

		if(cache.has(x)) {
			value = cache.get(x);
		} else {
			value = f.call(this, x);
			cache.set(x, value);
		}

		return value;
	};
};
