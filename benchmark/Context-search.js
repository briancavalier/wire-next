var Benchmark, suite, Context, roles, matchRole, multipleRole, context;

Benchmark = require('benchmark');
suite = new Benchmark.Suite();
Context = require('../Context');
roles = 10000;
sameRole = false;
matchRole = sameRole ? 'myRole' + roles/2 : 'myRole';

var context = new Context();
for (var i = 0 ; i< roles ; i++) { 
	if(sameRole) {
		context.add({role: 'myRole' + i, id: 'myId' + i, scope : function(){}});
	} else {
		context.add({role: 'myRole', id: 'myId' + i, scope : function(){}});
	}
}

// add tests
suite.add('MetadataSearch', function() {
	context.findComponents({role: [matchRole]});
})
.add('WholeLoop', function() {
	context.findComponents(function(component) {
		return component.metadata.role === matchRole;
	});
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('start', function(event) {
  console.log(String(event.target));
})
.on('error', function(error) {
  console.log(error);
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// run async
.run({ 'async': true });

