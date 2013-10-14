var installLifecycle = require('../lib/lifecycleSupport');
var byRole = require('../query/role');
var Promise = require('truth');
var Map = require('../lib/Map');

module.exports = function() {
	var processors = new Map();

	return installLifecycle(
		function(instance, context) {
			var component = this;
			var lifecycleHandlers = context.findComponents(byRole('lifecycle'));

			return lifecycleHandlers.reduce(function(instance, processor) {
				return when(processor.instance(context), function(processor) {

					return processor && typeof processor.postCreate === 'function'
						? applyPostCreate(instance, component, processor, context).then(stashProcessor)
						: instance;

					function stashProcessor(instance) {
						addProcessor(instance, processor, processors);
						return instance;
					}
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

function applyPostCreate(instance, component, processor, context) {
	return when(instance, function (instance) {
		if (instance === processor) {
			return instance;
		}

		return processor.postCreate(instance, component, context);
	});
}

function applyPreDestroys(list, context, instance) {
	return list.reduceRight(function (instance, processor) {
		return typeof processor.preDestroy === 'function'
			? processor.preDestroy(instance, context)
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

function when(x, f) {
	return Promise.cast(x).then(f);
}