var feature = require('../query/feature');

var withLifecycleSupport = feature('lifecycleSupport');

module.exports = function lifecycleSupport(postCreate, preDestroy) {
	return function(context) {
		if(context.findComponents(withLifecycleSupport, false).length) {
			return context;
		}

		context.add({ features: 'lifecycleSupport' }, function(){ return this; });

		return Object.create(context, {
			add: {
				value: function(_, create, destroy) {
					return context.add.call(this, _, postCreateHook, preDestroyHook);

					function postCreateHook() {
						return postCreate.call(this, create.apply(this, arguments), context);
					}

					function preDestroyHook(instance, context) {
						instance = preDestroy.call(this, instance, context);
						return destroy
							? destroy.call(this, instance, context)
							: instance;

					}
				},
				configurable: true,
				writable: true
			}
		});
	};
};
