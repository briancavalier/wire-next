var defaultScope = require('../scope/singleton');
var byRole = require('../query/role');

var nextId = 1;

exports.normalize = normalizeMetadata;
exports.fromString = fromString;
exports.normalizeQuery = normalizeQuery;
exports.queryFromString = queryFromString;
exports.ensureId = ensureId;

function normalizeMetadata(metadata) {
	if (typeof metadata === 'string') {
		metadata = fromString(metadata);
	} else {
		metadata.id = ensureId(metadata.id);
	}

	if(typeof metadata.scope !== 'function') {
		metadata.scope = defaultScope;
	}

	return metadata;
}

function normalizeQuery(query) {
	return typeof query === 'string' ? queryFromString(query) : query;
}

function fromString(s) {
	var metadata, role, qualifier;
	var split = s.indexOf('@');

	if (split < 0) {
		metadata = { id: ensureId(s) };
	} else {
		qualifier = s.slice(0, split);
		role = s.slice(split + 1, s.length);
		metadata = { id: ensureId(), roles: {} };
		metadata.roles[role] = qualifier || true;
	}

	return metadata;
}

function queryFromString(s) {
	var role, qualifier;
	var split = s.indexOf('@');

	if(split >= 0) {
		role = s.slice(split + 1, s.length);
		qualifier = s.slice(0, split);
		return qualifier
			? byRole(role, function(value) { return value === qualifier; })
			: byRole(role);
	}

	return s;
}

function ensureId(id) {
	return typeof id !== 'string' || id.length === 0
		? '!' + Date.now() + (nextId++)
		: id;
}