(function(curl) {

	var config = {
		packages: {
			app: { location: '.', config: { moduleLoader: 'curl/loader/cjsm11', init: 'app/init' } },
			wire: { location: '..', main: 'wire',
				config: { moduleLoader: 'curl/loader/cjsm11' }
			},
			curl: { location: 'bower_components/curl/src/curl', main: 'curl' },
			when: { location: 'bower_components/when', main: 'when' }
		}
	};

	curl(config, ['wire!app/main'], function(context) {
		context.resolve(['button', 'on'], function(button, on) {
			on('click', button, context.destroy.bind(context));
		});

		context.resolve(['helloWire', 'message', 'button'], function(helloWire, msg) {
			helloWire.sayHello(msg);
		});

		context.resolve(['@controller', 'message'], function(helloWire, msg) {
			helloWire.sayHello(msg);
		})

	});

})(curl);