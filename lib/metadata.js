exports.normalize = normalizeMetadata;
exports.ensureId = ensureId;

var nextId = 1;

function normalizeMetadata(metadata) {
	if (typeof metadata === 'string') {
		return { id: ensureId(metadata) };
	}

	metadata.id = ensureId(metadata.id);

	return metadata;
}

function ensureId(id) {
	return typeof id !== 'string' || id.length === 0
		? '!' + Date.now() + (nextId++)
		: id;
}