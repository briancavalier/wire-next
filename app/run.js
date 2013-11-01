(function(curl) {

	var config = {
		packages: {
			app: { location: 'app', config: { moduleLoader: 'curl/loader/cjsm11' } },
			wire: { location: '.', config: { moduleLoader: 'curl/loader/cjsm11' } },
			curl: { location: 'bower_components/curl/src/curl', main: 'curl' },
			when: { location: 'bower_components/when', main: 'when' }
		}
	};

	curl(config, ['wire/wire!app/main', 'when/delay', 'domReady!'], function(context, delay) {
//		context.resolve(['helloWire', 'message'], function(helloWire, msg) {
//			helloWire.sayHello(msg);
//		}).done();


		context.resolve(['helloWire', 'message'], function(helloWire, msg) {
			helloWire.sayHello(msg);
		}).then(function() { return delay(1000); }).then(function() {
			return context.destroy();
		});

	});

})(curl);