(function(curl) {

	var config = {
		packages: {
			app: { location: 'app', config: { moduleLoader: 'curl/loader/cjsm11' } },
			wire: { location: '.', config: { moduleLoader: 'curl/loader/cjsm11' } },
			curl: { location: 'bower_components/curl/src/curl', main: 'curl' }
		}
	};

	curl(config, ['app/main', 'domReady!'], function(context) {
		context.get('helloWire').sayHello(context.get('message'));
		context.get('helloWire').sayHello(context.get('message'));

		context.destroy();
	});

})(curl);