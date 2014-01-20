module.exports = function enableAutostart(context) {
	var initialized = false;
	return Object.create(context, {
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

				if(!initialized) {
					initialized = true;
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