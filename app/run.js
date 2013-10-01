(function(curl) {

	var config = {
		packages: {
			app: { location: 'app', config: { moduleLoader: 'curl/loader/cjsm11' } },
			wire: { location: '.', config: { moduleLoader: 'curl/loader/cjsm11' } },
			curl: { location: 'bower_components/curl/src/curl', main: 'curl' },
			truth: { location: 'bower_components/truth', main: 'Promise',
				config: { moduleLoader: 'curl/loader/cjsm11' } }
		}
//		preloads: ['./lib/promise']
	};

	curl(config, ['app/main', 'domReady!'], function(context) {
		context.resolve(['helloWire', 'message'], function(helloWire, message) {
			helloWire.sayHello(message);
		});

		context.resolve(['helloWire', 'message'], function(helloWire, message) {
			helloWire.sayHello(message);
		});

		context.resolve(['helloWire', 'message'], function(helloWire, message) {
			helloWire.sayHello(message);
		});

	});

})(curl);