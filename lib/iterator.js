exports.of = function(x) {
	if(x != null) {
		if(typeof x.next === 'function') {
			return x;
		}

		if(typeof x.iterator === 'function') {
			return x.iterator();
		}

		if(typeof x !== 'function' && typeof x.length === 'number') {
			return new ArrayLikeIterator(x);
		}
	}
	throw new Error('not an iterable');
}

exports.find = function(iterator, predicate) {
	var item;

	while(true) {
		item = iterator.next();
		if(item.done) {
			return;
		}

		item = item.value;
		if(predicate(item)) {
			return item;
		}
	}
};

exports.map = function(iterator, f) {
	return {
		next: function() {
			var item = iterator.next();

			return item.done
				? item
				: { done: item.done, value: f(item.value) };
		}
	};
};

function ArrayLikeIterator(array) {
	this._array = array;
	this._index = 0;
}

ArrayLikeIterator.prototype.next = function() {
	if(this._index >= this._array.length) {
		return { done: true };
	}

	return { done: false, value: this._array[this._index++] };
};