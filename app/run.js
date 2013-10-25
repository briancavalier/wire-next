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

	curl(config, ['wire/wire!app/main', 'domReady!'], function(context) {
		context.resolve(['helloWire', 'message'], function(helloWire, msg) {
			helloWire.sayHello(msg);
		});


		context.resolve(['helloWire', 'message'], function(helloWire, msg) {
			helloWire.sayHello(msg);
			setTimeout(function() {
				context.destroy();
			}, 1000)
		});

	});

})(curl);