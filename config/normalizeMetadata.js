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
	if (typeof criteria === 'string' && criteria[0] === '@') {
		return role(criteria.slice(1));
	}

	return criteria;
}
