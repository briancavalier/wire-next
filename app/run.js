(function(curl) {

	var config = {
		packages: {
			app: { location: '.', config: { moduleLoader: 'curl/loader/cjsm11' } },
			wire: { location: '..', config: { moduleLoader: 'curl/loader/cjsm11' }, main: 'wire' },
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

		context.resolve(['helloWire', 'message'], function(helloWire, msg) {
			helloWire.sayHello(msg);
		})

	});

})(curl);