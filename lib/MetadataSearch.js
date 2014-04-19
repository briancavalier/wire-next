module.exports = MetadataSearch;
var Bits = require('./bitset/Bits').Bits;

function MetadataSearch() {
	this._storage = Object.create(null);
	this._components = [];
}

/*
	Algorithm for search with BitSet:
	You can represent a list of distinct integers no larger than N using exactly N bits: 
	if the integer i appears in your list, you set the ith bit to true.
	So create first a int list identifier of the different components added.
	We then build different BitSet of ids which represent the list of id corresponding to a 
	particular property.
	Operation like AND/OR are done on the BitSet instead of looping through lists
	At then we take the result of the AND/OR operation and get the list of ids 
	to build the list of components.
	Query can be expressed as follow : {foo:['bar1', 'bar2'], fred: ['john']}, this means 
	give me the component which has a property foo set at are bar1 OR bar2 and a property fred set at john
*/
MetadataSearch.prototype.add = function(metadata, object) {
	var self = this;
	var identifier = new Bits();
	identifier.set(this._components.length);
	this._components.push(object);
	
	Object.keys(metadata).forEach(function(property) {
		if(typeof metadata[property] != 'function' && property != 'id') {
			self._storage[property] = self._storage[property] || [];
			if (self._storage[property][metadata[property]] === void 0) {
				self._storage[property][metadata[property]] = identifier.clone();
			} else {
				self._storage[property][metadata[property]] = Bits.or(identifier, self._storage[property][metadata[property]]);
			}
		}
	});
};

MetadataSearch.prototype.find = function(criteria) {
	var bitset, first, found;
	var self = this;
	first = true;
	found = [];
	var keys = Object.keys(criteria);
	var length = keys.length;
	for(var index = 0; index < length; index++) {
		var key = keys[index];
		if (self._storage[key] !== void 0) {
			var value;
			for (var i = 0; i < criteria[key].length; i++) {
				var temp = this._storage[key][criteria[key][i]];
				if( temp != null) {
					if(value === void 0) {
						// Clone to not modify the original value for other search
						value = temp.clone();
					} else {
						// Always take the biggest one as the 
						// BitSet do not resize by itself
						// it clones the first arguments
						if(temp.count() > value.count()) {
							value = Bits.or(temp, value);
						} else {
							value.or(temp);
						}
					}
				} 
			}
			if(index === 0) {
				if (value !== void 0) {
					bitset = value;
				}
			} else {
				bitset.and(value);
			}
			value = void 0;
		} else {
			bitset = void 0;
		}
		// Exit early as it will be AND operation after
		if (bitset === void 0 ) { return found; }
	}
	var buckets = bitset.toBuckets();
	var bucketsLength = buckets.length;
	for (var j = 0 ; j < bucketsLength; j++) {
		var bucket, base, mask;
		bucket = buckets[j];
		base = 32 * j;
		mask = 1;
		// find the item from a 32bits integer to map it to 0..31
		for (var add = 0; (mask <= bucket || bucket == -1) && add < 32; add++) {
			(bucket & mask) && found.push(self._components[base + add]);
			mask = mask << 1;
		}			
	}
	return found;
};

