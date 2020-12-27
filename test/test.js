var assert = require('assert');
const TreeStructure = require('../src/main/services/familytree-service.js');

describe('Array', function() {
	describe('#indexOf()', function() {
		it('should return -1 when the value is not present', function() {
			assert.equal([1,2,3].indexOf(4), -1);
		})
	})
})

describe('Array', function() {
	describe('#hello()', function() {
		it('test array', function() {
			let ts = new TreeStructure()
			assert.equal(ts.hello(), "hello");
		})
	})
})

describe('TreeStructure', function() {
	describe('#countJsonMaxDepth()', function() {
		it('should count depth of tree', function() {
			let treeStructure = new TreeStructure();
			assert.equal(treeStructure.countJsonMaxDepth(
				{
					"childlessPeople": [
						{
							"person":"Heather Berg",
							"parents": [{
								"person":"Mark Berg",
								"parents": []
							},{
								"person":"Narlene Berg",
								"parents": [
								{
									"person":"Janette Morning",
									"parents":[{
										"person":"Narlene Berg",
										"parents": []
									}]
								}]
							}]
						},
						{
							"person":"Carl Daga",
							"parents": [
							{
								"person":"Narlene Berg",
								"parents": []
							}]
						},
						{
							"person":"Kandi Kar",
							"parents": []
						}
					]
				}), 4)
		})
	})
})