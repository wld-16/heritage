const client = require('../db')

class PersonService {
	getAllPeople() {
		return client.query("select * from Person",[])
	}
	getAllRelationships() {
		return client.query("select * from Person_Person_Relationship",[])
	}
	findRelationshipTypeById(id) {
		return client.query("select * from Relationship where Relationship.id = $1", [id])
	}
	getAllRelationshipTypes() {
		return client.query("select * from Relationship", [])
	}
	createPerson(values) {
		const insertQuery = "INSERT INTO Person(id, forname, surname, birthdate, isAlive, gender) values (nextval('person_id_seq'), $1, $2, $3, $4, $5) returning *";
		return client.query(insertQuery, values)
	}
	createRelationship(person_1_id, person_2_id, relationship_id){
		const insertQuery = "INSERT INTO Person_Person_Relationship(id, person_from_id, person_to_id, relationship_id) values (nextval('person_person_relationship_id_seq'), $1, $2, $3) returning *";
		var values = [person_1_id, person_2_id, relationship_id]
		return client.query(insertQuery, values)
	}

	createMainRelationshipType(label) {		
		const insertQuery = "INSERT INTO Relationship(id, label, opposite_id) values (nextval('relationship_id_seq'), $1, nextval('relationship_id_seq')) returning *";
		let mainValuesEntry = [label]
		return client.query(insertQuery, mainValuesEntry)
		
	}
	createOppositeRelationshipType(mainId, label, oppositeId) {
		const insertQuery = "INSERT INTO Relationship(id, label, opposite_id) values ($1, $2, $3) returning *";
		let oppositeValuesEntry = [mainId, label, oppositeId]
		return client.query(insertQuery, oppositeValuesEntry)
	}
}

module.exports = PersonService;