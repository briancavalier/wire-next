(function(curl) {

	window.test = true;
	var config = {
		packages: {
			app: { location: 'app', config: { moduleLoader: 'curl/loader/cjsm11' } },
			wire: { location: '.', config: { moduleLoader: 'curl/loader/cjsm11' } },
			curl: { location: 'bower_components/curl/src/curl', main: 'curl' }
		}
	};

	curl(config, ['app/main-MethodConfig', 'domReady!'], function(context) {
		context.get('helloWire').sayHello(context.get('message'));
		context.get('helloWire').sayHello(context.get('message'));

		console.log(context.get('node').innerHTML);

//		context.helloWire().sayHello(context.message);
//		context.helloWire().sayHello(context.message);
	});

})(curl);