module.exports = function enableAutostart(context) {
	return Object.create(context, {
		startup: {
			value: function() {
				return this.resolve(['@startup'], identity);
			}
		}
	});
};

function identity(x) {
	return x;
}