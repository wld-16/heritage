const client = require('../db')

class TreeStructure {
	hello() {
		return "hello"
	}

	getParentsOf(person, callback){
		let relationshipQuery = "select p.id, p.forname, p.surname, r.label, ppr.person_to_id, ppr.person_from_id from person p inner join person_person_relationship ppr on p.id = ppr.person_from_id inner join relationship r on r.id = ppr.relationship_id where r.label = 'parent' and ppr.person_from_id = $1"
		client.query(relationshipQuery, [person.id], (err, data) => {
			data.rows.forEach(entry => {
				console.log(entry)
				client.query("select * from person where id = $1", [entry.person_to_id], callback)
			})
		})
	}

	// TODO: use promise pattern
	recursiveFunction(person, countsArray, backtrack) {
		countsArray[0] = countsArray[0] + 1
		let parents = []
		this.getParentsOf(person, (err, data) => parents.push(data))
		console.log("parents: ")
		console.log(parents)

		if(parents.length == 0) {
			if(backtrack.length == 0){
				// Finish
				countsArray.push(countsArray[0])
				countsArray.shift()
				return countsArray
			} else {
				// Track next element from backtrack
				countsArray[0] = backtrack.shift()
				let nextPerson = backtrack.shift()
				countsArray.push(countsArray[0])
				return this.recursiveFunction(nextPerson, countsArray, backtrack)
			}
		} else { 
			// Process next parents
			let nextPerson = parents.shift()

			parents.forEach(parent => {
				backtrack.push(countsArray[0])
				backtrack.push(parent)
			})
			return this.recursiveFunction(nextPerson, countsArray, backtrack)
		}
	}

	getChildlessPeople(callback){
		client.query("select * from person inner join (select ppr.person_from_id from person_person_relationship ppr inner join relationship r on ppr.relationship_id = r.id where r.label = 'child' except select ppr.person_from_id from person_person_relationship ppr inner join relationship r on ppr.relationship_id = r.id where r.label = 'parent') as ppr on ppr.person_from_id = person.id", [], callback)
	}

	countJsonMaxDepth(childlessPeople) {
		let childlessPeopleArr = childlessPeople.childlessPeople
		let depths = []
		childlessPeopleArr.forEach(childlessPerson => {
			depths.push(this.recursiveFunction(childlessPerson, [0], []))
		})
		depths = [].concat.apply([],depths)
		
		return Math.max(...depths)
	}

	countMaxDepth() {
		let childlessPeopleArr = []
		this.getChildlessPeople((err, data) => {
			childlessPeopleArr = data.rows
			console.log(childlessPeopleArr)
			let depths = []
			childlessPeopleArr.forEach(childlessPerson => {
				depths.push(this.recursiveFunction(childlessPerson, [0], []))
			})
			depths = [].concat.apply([],depths)
			
			console.log(Math.max(...depths)) 
		})
	}

}

module.exports = TreeStructure;
