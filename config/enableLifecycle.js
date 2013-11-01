var extendLifecycle = require('../lib/extendLifecycle');
var byRole = require('../query/role');
var when = require('when');
var Map = require('../lib/Map');

var hasLifecycleRole = byRole('lifecycle');

module.exports = function() {
	var processors = new Map();

	return extendLifecycle(
		function(instance, context) {
			var component, lifecycleHandlers;

			if(hasLifecycleRole(this)) {
				return instance;
			}

			component = this;
			lifecycleHandlers = context.findComponents(hasLifecycleRole);

			return lifecycleHandlers.reduce(function(instance, processor) {
				return when(processor.instance(context), function(processor) {

					return processor && typeof processor.postCreate === 'function'
						? applyPostCreate(instance, component, context,
							processor, processors)
						: instance;
				});
			}, instance);
		},

		function(instance, context) {
			return when(instance, function(instance) {
				var list = processors.get(instance);
				if(list) {
					instance = applyPreDestroys(list, context, instance);
					processors.delete(instance);
				}

				return instance;
			});
		}
	);
};

function applyPostCreate(instance, component, context, processor, processors) {
	return when(instance, function (instance) {
		if (instance === processor) {
			return instance;
		}

		addProcessor(instance, processor, processors)
		return processor.postCreate(instance, component, context);
	});
}

function applyPreDestroys(list, context, instance) {
	// TODO: Allow preDestroy to return a promise
	return list.reduceRight(function (instance, processor) {
		return typeof processor.preDestroy === 'function'
			? when(instance, function(instance) {
				return processor.preDestroy(instance, context)
			})
			: instance;
	}, instance);
}

function addProcessor(instance, processor, map) {
	var list = map.get(instance);
	if(!list) {
		map.set(instance, [processor]);
	} else {
		list.push(processor);
	}
}