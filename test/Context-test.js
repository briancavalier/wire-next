require('buster').spec.expose();
var expect = require('buster').expect;

var Context = require('../Context');

describe('Context', function() {

	describe('findComponents', function() {

		it('should find a component based on role equality', function() {
			var ctx = new Context();
			ctx.add({role: 'myRole', id: 'myId', scope : function(){}});
			var components = ctx.findComponents({role: ['myRole']});
			expect(components.length).toEqual(1);
		});
		
		it('should find a component based on role equality with 2 elements', function() {
			var ctx = new Context();
			ctx.add({role: 'myRole', id: 'myId', scope : function(){}});
			ctx.add({role: 'myRole', id: 'myId2', scope : function(){}});
			var components = ctx.findComponents({role: ['myRole']});
			expect(components.length).toEqual(2);
		});

		it('should find a component based on foo', function() {
			var ctx = new Context();
			ctx.add({role: 'myRole', foo: 'bar', id: 'myId', scope : function(){}});
			var components = ctx.findComponents({foo: ['bar']});
			expect(components.length).toEqual(1);
		});

		it('should find a component based on multiple role', function() {
			var ctx = new Context();
			ctx.add({role: 'myRole1', id: 'myId', scope : function(){}});
			ctx.add({role: 'myRole2', id: 'myId2', scope : function(){}});
			var components = ctx.findComponents({role: ['myRole1', 'myRole2']});
			expect(components.length).toEqual(2);
		});

		it('should not find a component in other context', function() {
			var ctx1 = new Context();
			var ctx2 = new Context();
			ctx1.add({role: 'myRole1', id: 'myId', scope : function(){}});
			ctx2.add({role: 'myRole2', id: 'myId2', scope : function(){}});
			var components1 = ctx1.findComponents({role: ['myRole2']});
			var components2 = ctx2.findComponents({role: ['myRole1']});
			expect(components1.length).toEqual(0);
			expect(components2.length).toEqual(0);
		});

		it('should not find a component not registered in context', function() {
			var ctx = new Context();
			var components = ctx.findComponents({role: ['myRole']});
			expect(components.length).toEqual(0);
		});

		it('should find a component based on multiple role AND other tag', function() {
			var ctx = new Context();
			ctx.add({role: 'myRole1', foo:'bar', id: 'myId', scope : function(){}});
			ctx.add({role: 'myRole2', id: 'myId2', scope : function(){}});
			var components = ctx.findComponents({role: ['myRole1', 'myRole2'], foo:['bar']});
			expect(components.length).toEqual(1);
		});

		it('should not find a component based on multiple role AND other tag', function() {
			var ctx = new Context();
			ctx.add({role: 'myRole2', id: 'myId', scope : function(){}});
			ctx.add({role: 'myRole1', id: 'myId2', scope : function(){}});
			var components = ctx.findComponents({role: ['myRole1', 'myRole2'], foo:['bar']});
			expect(components.length).toEqual(0);
		});

		it('should not find a component based on multiple role AND other tag mixed', function() {
			var ctx = new Context();
			ctx.add({role: 'myRole2', foo: 'bar', id: 'myId', scope : function(){}});
			ctx.add({role: 'myRole1', id: 'myId2', scope : function(){}});
			var components = ctx.findComponents({role: ['myRole1'], foo:['bar']});
			expect(components.length).toEqual(0);
		});

		it('should not find a component based on multiple role AND other tag in second position', function() {
			var ctx = new Context();
			ctx.add({role: 'myRole2', foo: 'bar', id: 'myId', scope : function(){}});
			ctx.add({role: 'myRole1', foo: 'bar', id: 'myId2', scope : function(){}});
			var components = ctx.findComponents({role: ['myRole2'], foo:['bar']});
			expect(components.length).toEqual(1);
		});

		it('should find 31 element for a search', function() {
			var ctx = new Context();
			var number = 31;
			for (var i = 0; i < number ; i++) {
				ctx.add({role: 'myRole', id: 'myId' + i , scope : function(){}});
			}
			var components = ctx.findComponents({role: ['myRole']});
			expect(components.length).toEqual(number);
			for (var i = 0; i < number ; i++) {
				expect(components[i]['metadata'].id).toEqual('myId' + i);
			}
		});

		it('should find 32 element for a search', function() {
			var ctx = new Context();
			var number = 32;
			for (var i = 0; i < number ; i++) {
				ctx.add({role: 'myRole', id: 'myId' + i , scope : function(){}});
			}
			var components = ctx.findComponents({role: ['myRole']});
			expect(components.length).toEqual(number);
			for (var i = 0; i < number ; i++) {
				expect(components[i]['metadata'].id).toEqual('myId' + i);
			}
		});

		it('should find 34 element for a search', function() {
			var ctx = new Context();
			var number = 34;
			for (var i = 0; i < number ; i++) {
				ctx.add({role: 'myRole', id: 'myId' + i , scope : function(){}});
			}
			var components = ctx.findComponents({role: ['myRole']});
			expect(components.length).toEqual(number);
			for (var i = 0; i < number ; i++) {
				expect(components[i]['metadata'].id).toEqual('myId' + i);
			}
		});

	});
});