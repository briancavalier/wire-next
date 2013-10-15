(function(curl) {

	var config = {
		packages: {
			app: { location: 'app', config: { moduleLoader: 'curl/loader/cjsm11' } },
			wire: { location: '.', config: { moduleLoader: 'curl/loader/cjsm11' } },
			curl: { location: 'bower_components/curl/src/curl', main: 'curl' },
			truth: { location: 'bower_components/truth', main: 'Promise',
				config: { moduleLoader: 'curl/loader/cjsm11' } }
		}
	};

	curl(config, ['app/main', 'truth', 'domReady!'], function(context, Promise) {
		Promise.all(context.resolve(['helloWire', 'message'])).then(function(args) {
			args[0].sayHello(args[1]);
		});

		Promise.all(context.resolve(['helloWire', 'message'])).then(function(args) {
			args[0].sayHello(args[1]);
			setTimeout(function() {
				context.destroy();
			}, 1000)
		});

//
//		context.resolve(['helloWire', 'message'], function(helloWire, message) {
//			helloWire.sayHello(message);
//		});
//
//		context.resolve(['helloWire', 'message'], function(helloWire, message) {
//			helloWire.sayHello(message);
//		});

	});

})(curl);