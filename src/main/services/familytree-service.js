const client = require('../db')

class TreeStructure {
	hello() {
		return 'hello'
	}

	getParentsOf(person){
		//client.query("select * from Person_Person_Relationship where ", [])
		//((client.query("select * from person where id = $1 || id = $2", [parent1_id, parent2_id])
	}

	recursiveFunction(person, count) {
		count += 1
		if(person.parents.length == 0) {
			console.log("Returning: " + person.person + " " + count)
			return count
		}
		var parents = person.parents
		parents.forEach(parent => 
		{
			console.log(parent.person + count)
			return this.recursiveFunction(parent, count)
		})
	}

	countJsonMaxDepth(childlessPeople) {
		let childlessPeopleArr = childlessPeople.childlessPeople
		let depths =[]
		childlessPeopleArr.forEach(childlessPerson => {
			depths.push(this.recursiveFunction(childlessPerson, 0))
		})
		console.log(depths)
		return Math.max(...depths)

	}

}

module.exports = TreeStructure;
