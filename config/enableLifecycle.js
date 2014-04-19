var when = require('when');
var byRole = require('../query/role');
var Map = require('../lib/Map');

var hasLifecycleRole = byRole('lifecycle');

module.exports = function enableLifecycle(context) {
	return Object.create(context, {
		add: {
			value: function(metadata, create, destroy) {
				return runLifecycle.call(this, context, metadata, create, destroy);
			},
			configurable: true, writable: true
		},

		_lifecycleProcessors: {
			value: void 0,
			configurable: true, writable: true
		},

		_postCreateHook: {
			value: postCreateHook,
			configurable: true, writable: true
		},

		_preDestroyHook: {
			value: preDestroyHook,
			configurable: true, writable: true
		}
	});
};

function runLifecycle(origContext, metadata, create, destroy) {
	if(!this._lifecycleProcessors) {
		this._lifecycleProcessors = new Map();
	}

	var self = this;
	return origContext.add.call(this, metadata, createWithLifecycle, destroyWithLifecycle);

	function createWithLifecycle() {
		return self._postCreateHook(create.apply(this, arguments), this, origContext);
	}

	function destroyWithLifecycle(instance, context) {
		return self._preDestroyHook(instance, this, destroy, context);
	}

}

function postCreateHook(instance, component, context) {
	if(hasLifecycleRole(component)) {
		return instance;
	}

	var lifecycleHandlers = context.findComponents(hasLifecycleRole);

	var state = {
		instance: instance,
		processors: [],
		lifecycleProcessors: this._lifecycleProcessors
	};

	return when.reduce(lifecycleHandlers, function(state, processor) {
		return when(processor.instance(context), function(processor) {

			if(processor && typeof processor.postCreate === 'function') {
				return when(state.instance, function(instance) {
					return when(applyPostCreate(instance, component, context, processor),
						function(instance) {
							state.instance = instance;
							state.processors.push(processor);
							return state;
						});
				});
			}

			return state;
		});

	}, state).then(function(state) {
		state.lifecycleProcessors.set(state.instance, state.processors);
		return state.instance;
	});
}

function preDestroyHook(instance, component, destroy, context) {
	var processors = this._lifecycleProcessors;

	return when(instance, function(instance) {
		var list = processors.get(instance);
		if(list) {
			instance = applyPreDestroys(list, context, instance);
			processors.delete(instance);
		}

		return instance;
	}).then(destroyInstance);

	function destroyInstance(instance) {
		return destroy ? destroy.call(component, instance, context) : instance;
	}
}

function applyPostCreate(instance, component, context, processor) {
	if (instance === processor) {
		return instance;
	}

	return processor.postCreate(instance, component, context);
}

function applyPreDestroys(list, context, instance) {
	return when.reduceRight(list, function(instance, processor) {
		return typeof processor.preDestroy === 'function'
			? processor.preDestroy(instance, context)
			: instance;
	}, instance);
}
