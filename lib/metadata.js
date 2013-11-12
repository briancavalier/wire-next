var defaultScope = require('../scope/singleton');
var nextId = 1;

exports.normalize = normalizeMetadata;
exports.ensureId = ensureId;

function normalizeMetadata(metadata) {
	if (typeof metadata === 'string') {
		var parts = metadata.split('@');
		metadata = { id: ensureId(metadata) };
		if(parts[1]) {
			metadata.roles = [parts[1]];
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