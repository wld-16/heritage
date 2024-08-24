import { query } from '../db/index.js'

class FamilyTreeService {
	getChildrenOf(person: Person){
		let relationshipQuery = "select p.id, p.forname, p.surname, r.label, p.birthdate, ppr.person_to_id, ppr.person_from_id from person p inner join person_person_relationship ppr on p.id = ppr.person_from_id inner join relationship r on r.id = ppr.relationship_id where r.label = 'child' and ppr.person_to_id = $1"
		let relationshipPromise = query(relationshipQuery, [person.id]).then(relationshipData => {
			return relationshipData.rows
		})
		return relationshipPromise
	}

	getParentsOf(person: Person){
		let relationshipQuery = "select p.id, p.forname, p.surname, r.label, p.birthdate, ppr.person_to_id, ppr.person_from_id from person p inner join person_person_relationship ppr on p.id = ppr.person_from_id inner join relationship r on r.id = ppr.relationship_id where r.label = 'parent' and ppr.person_to_id = $1"
		let relationshipPromise = query(relationshipQuery, [person.id]).then(relationshipData => {
			return relationshipData.rows
		})
		return relationshipPromise
	}

	getJsonParents(person: Person){
		return new Promise(function(resolve, reject) {
    		resolve(person["parents"]);
  		});
	}

	recursiveFunction(person, countsArray, backtrack, relationshipFunction, relationshipName) {
		countsArray.currentElement.l = countsArray.currentElement.l + 1
		countsArray.currentElement.path = countsArray.currentElement.path + '{"id":' + person.id + ',"forname":"' + person.forname + '","surname":"'+ person.surname + '","bday":"' + person.birthdate + '","' + relationshipName + '":'

		return relationshipFunction(person).then(relatedPeople => {
			if(relatedPeople.length === 0) {
				if(backtrack.length === 0) {
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
					return this.recursiveFunction(nxt.person, countsArray, backtrack, relationshipFunction, relationshipName)
				}
			} else { 
				// Process next relatedPeople
				let nextPerson = relatedPeople.shift()

				relatedPeople.forEach(parent => {
					backtrack.push({el: {l: countsArray.currentElement.l, path: countsArray.currentElement.path}, person: parent})
				})
				return this.recursiveFunction(nextPerson, countsArray, backtrack, relationshipFunction, relationshipName)
			}
		})
	}

	// Search the people, that are included in a person_relationship as parent with the restriction, that they are not included in a person_relationship as child
	getPeopleWithNoParentsRecorded(){
		return query("select * from person inner join (select ppr.person_from_id from person_person_relationship ppr inner join relationship r on ppr.relationship_id = r.id where r.label = 'parent' except select ppr.person_from_id from person_person_relationship ppr inner join relationship r on ppr.relationship_id = r.id where r.label = 'child') as ppr on ppr.person_from_id = person.id", [])
	}

	getChildlessPeople() {
		return query("select * from person inner join (select ppr.person_from_id from person_person_relationship ppr inner join relationship r on ppr.relationship_id = r.id where r.label = 'child' except select ppr.person_from_id from person_person_relationship ppr inner join relationship r on ppr.relationship_id = r.id where r.label = 'parent') as ppr on ppr.person_from_id = person.id", [])
	}

	countJsonMaxDepth(childlessPeople: any) {
		let childlessPeopleArr = childlessPeople.childlessPeople
		let depths = []
		if(childlessPeopleArr.length !== 0){
			let count = childlessPeopleArr.map(childlessPerson => {
				return this.recursiveFunction(childlessPerson, {currentElement:{l:0,path:""}, done:[]}, [], this.getJsonParents, "parent")
			})
			return count
		} else {
			let count = [new Promise(function(resolve, reject){
				return resolve( { done: [ { l: 0} ] } )
			})]
			return count
		}
	}

	countMaxDepthReverse() {
		return this.getChildlessPeople().then(childlessPeopleData => {
			let depths = []
			let count = childlessPeopleData.rows.map(entry => {
				return this.recursiveFunction(entry, {currentElement:{l:0,path:""}, done:[]}, [], this.getParentsOf, "parent")
			})
			return count
		})
	}

	countMaxDepth() {
		return this.getPeopleWithNoParentsRecorded().then(parentlessPeopleData => {
			let depths = []
			let count = parentlessPeopleData.rows.map(entry => {
				return this.recursiveFunction(entry, {currentElement:{l:0,path:""}, done:[]}, [], this.getChildrenOf, "child")
			})
			return count
		})
	}
}

export {
	FamilyTreeService
};
