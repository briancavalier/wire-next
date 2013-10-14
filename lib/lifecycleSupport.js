module.exports = function lifecycleSupport(postCreate, preDestroy) {
	return function(context) {
		return Object.create(context, {
			add: {
				value: function(_, create, destroy) {
					return context.add.call(this, _, postCreateHook, preDestroyHook);

					function postCreateHook() {
						return postCreate.call(this, create.apply(this, arguments), context);
					}

					function preDestroyHook(instance, context) {
						var instance = preDestroy.call(this, instance, context);
						if(destroy) {
							return destroy.call(this, instance, context);
						}
					}
				},
				configurable: true,
				writable: true
			}
		});
	};
}
