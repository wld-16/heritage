const client = require('../db')

class TreeStructure {
	hello() {
		return "hello"
	}

// TODO: Get parents with query join
	async getParentsOf(person){
		console.log("try get parnets")
		let relationshipQuery = "select p.id, p.forname, p.surname, r.label, ppr.person_to_id, ppr.person_from_id from person p inner join person_person_relationship ppr on p.id = ppr.person_from_id inner join relationship r on r.id = ppr.relationship_id where r.label = 'parent' and ppr.person_to_id = $1"
		let data = await client.query(relationshipQuery, [person.id])
		let parents = []

		const getEachParentPerson = async () =>{
			return await data.rows.map(async entry => {
				let data = await client.query("select * from person where id = $1", [entry.person_from_id])
				return data.rows[0]
			})	
		} 
		console.log(getEachParentPerson())
		return await getEachParentPerson()
}

	// TODO: Debug
	async recursiveFunction(person, countsArray, backtrack) {
		countsArray[0] = countsArray[0] + 1
		let parents = await this.getParentsOf(person)
		
		console.log("parents")
		console.log(parents.rows)
			
		if(parents.length == 0) {
			if(backtrack.length == 0){
				// Finish
				countsArray.push(countsArray[0])
				countsArray.shift()
				//console.log("count arrays")
				//console.log(countsArray)
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

	async getChildlessPeople(){
		return await client.query("select * from person inner join (select ppr.person_from_id from person_person_relationship ppr inner join relationship r on ppr.relationship_id = r.id where r.label = 'child' except select ppr.person_from_id from person_person_relationship ppr inner join relationship r on ppr.relationship_id = r.id where r.label = 'parent') as ppr on ppr.person_from_id = person.id", [])
	}

	countJsonMaxDepth(childlessPeople) {
		let childlessPeopleArr = childlessPeople.childlessPeople
		let depths = []
		childlessPeopleArr.forEach(childlessPerson => {
			this.recursiveFunction(childlessPerson, [0], [])
		})
		depths = [].concat.apply([], depths)
		
		return Math.max(...depths)
	}

	async asyncForEach(array, callback) {
	  for (let index = 0; index < array.length; index++) {
	    await callback(array[index], index, array);
	  }
	}

	async countMaxDepth() {
		let childlessPeopleData = await this.getChildlessPeople()
		console.log(childlessPeopleData.rows)

		let depths = []
		const start = async () => {
			await this.asyncForEach(childlessPeopleData.rows, async (person) => {
				let entry = await this.recursiveFunction(person, [0], [])
				depths.push(entry)
			})

			//console.log("after foreach")
			//console.log(depths)

			depths = [].concat.apply([],depths)
			//console.log(depths)
			console.log("end")
			console.log(Math.max(...depths))
		}
		start()
	}
}

module.exports = TreeStructure;
