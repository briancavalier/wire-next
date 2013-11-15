var meta = require('../lib/metadata');

module.exports = function normalizeMetadata(context) {
	return Object.create(context, {
		add: {
			value: function(metadata, create, destroy) {
				return context.add.call(this, meta.normalize(metadata), create, destroy);
			},
			configurable: true,
			writable: true
		},

		findComponents: {
			value: function(criteria) {
				return context.findComponents.call(this, meta.normalizeQuery(criteria));
			},
			configurable: true,
			writable: true
		}
	});
};
