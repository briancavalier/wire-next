module.exports = typeof Map === 'function' ? Map :
(function() {
	function Map() {
		this.clear();
	}

	Map.prototype = {
		get: function(key) {
			var value, found;
			found = this._data.some(function(entry) {
				if(entry[0] === key) {
					value = entry[1];
					return true;
				}
			});

			return found ? value : arguments[1];
		},

		set: function(key, value) {
			var replaced = this._data.some(function(entry) {
				if(entry[0] === key) {
					entry[1] = value;
					return true;
				}
			});

			if(!replaced) {
				this._data.push([key, value]);
			}
		},

		has: function(key) {
			return this._data.some(function(entry) {
				return entry[0] === key;
			});
		},

		'delete': function(key) {
			var value, found;
			found = this._data.some(function(entry, i, array) {
				if(entry[0] === key) {
					value = entry[0];
					array.splice(i, 1);
					return true;
				}
			});
		},

		keys: function() {
			return this._data.map(entryToKey);
		},

		clear: function() {
			this._data = [];
		}
	};

	function entryToKey(entry) {
		return entry[0];
	}

	return Map;
}());

