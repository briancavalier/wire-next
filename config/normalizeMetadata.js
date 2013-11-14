var meta = require('../lib/metadata');
var role = require('../query/role');

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
				return context.findComponents.call(this, normalizeCriteria(criteria));
			},
			configurable: true,
			writable: true
		}
	});
};

function normalizeCriteria(criteria) {
	var split;
	if (typeof criteria === 'string') {
		split = criteria.split('@');
		if(split.length > 1) {
			return split[0]
				? role(split[1], function(value) { return value === split[0]; })
				: role(split[1]);
		}
	}

	return criteria;
}
