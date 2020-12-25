var assert = require('assert');
const TreeStructure = require('../src/main/services/familytree-service.js');

describe('Array', function() {
	describe('#indexOf()', function() {
		it('should return -1 when the value is not present', function() {
			assert.equal([1,2,3].indexOf(4), -1);
		})
	})
})

describe('TreeStructure', function() {
	describe('#hello()', function() {
		it('should return hello', function() {
			let treeStructure = new TreeStructure();
			assert.equal(treeStructure.hello(), 'hello')
		})
	})
})