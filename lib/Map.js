module.exports = Map;

function Map() {
	this.clear();
}

Map.prototype = {
	get: function(key) {
		var value, found;
		found = this._data.some(function(entry) {
			if(entry.key === key) {
				value = entry.value;
				return true;
			}
		});

		return found ? value : arguments[1];
	},

	set: function(key, value) {
		var replaced = this._data.some(function(entry) {
			if(entry.key === key) {
				entry.value = value;
				return true;
			}
		});

		if(!replaced) {
			this._data.push({ key: key, value: value });
		}
	},

	has: function(key) {
		return this._data.some(function(entry) {
			return entry.key === key;
		});
	},

	'delete': function(key) {
		var value, found;
		found = this._data.some(function(entry, i, array) {
			if(entry.key === key) {
				value = entry.value;
				array.splice(i, 1);
				return true;
			}
		});
	},

	clear: function() {
		this._data = [];
	}
};
