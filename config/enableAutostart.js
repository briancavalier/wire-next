module.exports = function enableAutostart(context) {
	return Object.create(context, {
		_initialized: {
			value: false,
			configurable: true,
			writable: true
		},
		startup: {
			value: function() {
				return this.resolve(['@startup'], identity);
			},
			configurable: true, writable: true
		},

		resolve: {
			value: function() {
				var args, self;

				args = Array.prototype.slice.call(arguments);

				if(!this._initialized) {
					this._initialized = true;
					self = this;
					return this.resolve(['@init'], function() {
						return context.resolve.apply(self, args);
					});
				}

				return context.resolve.apply(this, args);
			},
			configurable: true, writable: true
		}
	});
};

function identity(x) {
	return x;
}