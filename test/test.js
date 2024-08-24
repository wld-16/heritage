var assert = require('assert');
const TreeStructure = require('../src/main/services/familytree-service.ts');
const R = require('ramda');

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
	describe('#shouldCountJsonMaxDepth()', function() {
		it('should count max depth as 3', async() => {
			// Given
			let treeStructure = new TreeStructure();

			// When
			return Promise.all(treeStructure.countJsonMaxDepth(
				{
					"childlessPeople": [
						{
							"person":"Heather Berg",
							"forname":"Heather",
							"parents": [{
								"person":"Mark Berg",
								"forname": "Mark",
								"parents": []
							},
							{
								"person":"Sara Berg",
								"forname": "Sara",
								"parents": [{
									"person":"Anna Berg",
									"forname": "Anna",
									"parents": []
								}]
							}
							]
						}
					]
				})).then(data => {

				// Then
				assert.equal(Math.max(...data.map(branch => Math.max(...branch.done.map(el => el.l)))), 3)
			})
		})
	})
})

describe('TreeStructure', function() {
	describe('#shouldCountJsonMaxDepth()', function() {
		it('should count max depth 0 when no elements', async() => {
			// Given
			let treeStructure = new TreeStructure();

			// When
			return Promise.all(treeStructure.countJsonMaxDepth(
				{
					"childlessPeople": []
				})).then(data => {

				// Then
				assert.equal(Math.max(...data.map(branch => Math.max(...branch.done.map(el => el.l)))), 0)
			})
		})
	})
})

describe('TreeStructure', function() {
	describe('#shouldCountJsonMaxDepth()', function() {
		it('should count max depth 1 when one person', async() => {
			// Given
			let treeStructure = new TreeStructure();

			// When
			return Promise.all(treeStructure.countJsonMaxDepth(
				{
					"childlessPeople": [
						{
							"person":"Heather Berg",
							"forname":"Heather",
							"parents": []
						}
					]
				})).then(data => {
				// Then
				assert.equal(Math.max(...data.map(branch => Math.max(...branch.done.map(el => el.l)))), 1)
			})
		})
	})
})

describe('TreeStructure', function() {
	describe('#shouldCountJsonMaxDepth()', function() {
		it('should count max depth as 4', async() => {
			// Given
			let treeStructure = new TreeStructure();

			// When
			return Promise.all(treeStructure.countJsonMaxDepth(
				{
					"childlessPeople": [
						{
							"person":"Heather Berg",
							"forname":"Heather",
							"parents": [{
								"person":"Mark Berg",
								"forname": "Mark",
								"parents": []
							},
							{
								"person":"Sara Berg",
								"forname": "Sara",
								"parents": [{
									"person":"Anna Berg",
									"forname": "Anna",
									"parents": [{
										"person":"Karl Karl",
										"forname": "Anna",
										"parents": []
									}]
								}]
							}]
						},
						{
							"person":"Heather Berg",
							"forname":"Heather",
							"parents": [{
								"person":"Mark Berg",
								"forname": "Mark",
								"parents": []
							},
							{
								"person":"Sara Berg",
								"forname": "Sara",
								"parents": [{
									"person":"Anna Berg",
									"forname": "Anna",
									"parents": [{
										"person":"Karl Karl",
										"forname": "Karl",
										"parents": []
									}]
								}]
							}]
						}
					]
				})).then(data => {
				// Then
				assert.equal(Math.max(...data.map(branch => Math.max(...branch.done.map(el => el.l)))), 4)
			})
		})
	})
})

describe('TreeStructure', function() {
	describe('#shouldCountQuiteHighJsonMaxDepth()', function() {
		it('should count max depth as 201', async() => {
			// Given
			let treeStructure = new TreeStructure();
			
			let gens = [{"person": "A", "forname": "a", "parents": []}, {"person": "B", "forname": "b", "parents": []}, {"person": "C", "forname": "c", "parents": []}]

			let arr = [[0,'parents'], [1,'parents'], [2,'parents']]

			const xLens = R.lensProp('x');

			for (var i = 0; i < 100; i++) {
				
			    let max = arr.length;
			    
			    for(var j = 0; j < max; j++ ){
			    
			    	accessor = R.lensPath(arr[j])
			        
			    	gens = R.set(accessor, gens, gens)
			    
			    }
			    
						
			    let tempArr = [...arr];
			    
			  for(var k = max-1; k <= 0; k--) {
			    	tempArr[k] = [arr[k].concat(0, 'parents'), arr[k].concat(1, 'parents'), arr[k].concat(2, 'parents')]
			    }

			    
			    arr = [...tempArr]
			    
			}
		
			// When
			return Promise.all(
				treeStructure.countJsonMaxDepth(
				{
					"childlessPeople": gens
				})).then(data => {
				// Then
				assert.equal(Math.max(...data.map(branch => Math.max(...branch.done.map(el => el.l)))), 201)

			})
		})
	})
})