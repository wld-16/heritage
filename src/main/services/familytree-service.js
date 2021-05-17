const client = require('../db')

class TreeStructure {
	hello() {
		return "hello"
	}

// TODO: Get parents with query join
	getParentsOf(person){
		let relationshipQuery = "select p.id, p.forname, p.surname, r.label, ppr.person_to_id, ppr.person_from_id from person p inner join person_person_relationship ppr on p.id = ppr.person_from_id inner join relationship r on r.id = ppr.relationship_id where r.label = 'parent' and ppr.person_to_id = $1"
		let relationshipPromise = client.query(relationshipQuery, [person.id]).then(relationshipData => {
			return relationshipData.rows
		})
		/*
		const getEachParentPerson = () =>{
			return await data.rows.map(entry => {
				let data = await client.query("select * from person where id = $1", [entry.person_from_id])
				return data.rows[0]
			})	
		} 
		*/
		return relationshipPromise
	}

	getJsonParents(person){
		return new Promise(function(resolve, reject) {
    		resolve(person["parents"]);
  		});
	}

	// TODO: Debug
	recursiveFunction(person, countsArray, backtrack, parentsFunction) {
		countsArray.currentElement.l = countsArray.currentElement.l + 1
		countsArray.currentElement.path = countsArray.currentElement.path + person.forname + "-> "

		return parentsFunction(person).then(parents => {
			if(parents.length == 0) {
				if(backtrack.length == 0) {
					// Finish
					countsArray.done.push(countsArray.currentElement)
					countsArray.currentElement = {}
					return countsArray
				} else {
					// Track next element from backtrack
					countsArray.done.push(Object.assign({}, countsArray.currentElement))
					let nxt = backtrack.shift()
					countsArray.currentElement.l = nxt.el.l
					countsArray.currentElement.path = nxt.el.path
					return this.recursiveFunction(nxt.person, countsArray, backtrack, parentsFunction)
				}
			} else { 
				// Process next parents
				let nextPerson = parents.shift()

				parents.forEach(parent => {
					backtrack.push({el: {l: countsArray.currentElement.l, path: countsArray.currentElement.path}, person: parent})
				})
				return this.recursiveFunction(nextPerson, countsArray, backtrack, parentsFunction)
			}
		})
	}

	getChildlessPeople(){
		return client.query("select * from person inner join (select ppr.person_from_id from person_person_relationship ppr inner join relationship r on ppr.relationship_id = r.id where r.label = 'child' except select ppr.person_from_id from person_person_relationship ppr inner join relationship r on ppr.relationship_id = r.id where r.label = 'parent') as ppr on ppr.person_from_id = person.id", [])
	}

	countJsonMaxDepth(childlessPeople) {
		let childlessPeopleArr = childlessPeople.childlessPeople
		let depths = []
		if(childlessPeopleArr.length !== 0){
			let count = childlessPeopleArr.map(childlessPerson => {
				return this.recursiveFunction(childlessPerson, {currentElement:{l:0,path:""}, done:[]}, [], this.getJsonParents)
			})
			return count
		} else {
			let count = [new Promise(function(resolve, reject){
				return resolve( { done: [ { l: 0} ] } )
			})]
			return count
		}
	}

	async asyncForEach(array, callback) {
	  for (let index = 0; index < array.length; index++) {
	    await callback(array[index], index, array);
	  }
	}

	countMaxDepth() {
		return this.getChildlessPeople().then(childlessPeopleData => {
			//console.log(childlessPeopleData.rows)
			let depths = []
			let count = childlessPeopleData.rows.map(entry => {
				return this.recursiveFunction(entry, {currentElement:{l:0,path:""}, done:[]}, [], this.getParentsOf)
			})
			return count
			
			/*const start = async () => {
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
			start()*/
		})
	}
}

module.exports = TreeStructure;
