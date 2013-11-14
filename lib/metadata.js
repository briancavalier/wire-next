var defaultScope = require('../scope/singleton');
var nextId = 1;

exports.normalize = normalizeMetadata;
exports.ensureId = ensureId;

function normalizeMetadata(metadata) {
	if (typeof metadata === 'string') {
		var parts = metadata.split('@');
		if(parts[1]) {
			metadata = { roles: {} };
			metadata.roles[parts[1]] = parts[0] || true;
		} else {
			metadata = { id: ensureId(metadata) };
		}
	} else {
		metadata.id = ensureId(metadata.id);
	}

	if(typeof metadata.scope !== 'function') {
		metadata.scope = defaultScope;
	}

	return metadata;
}

function ensureId(id) {
	return typeof id !== 'string' || id.length === 0
		? '!' + Date.now() + (nextId++)
		: id;
}