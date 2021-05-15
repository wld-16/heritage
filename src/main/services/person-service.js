const client = require('../db')

class PersonService {
	// Person
	getAllPeople() {
		return client.query("select * from Person",[])
	}
	deletePerson(id) {
		return client.query("delete from Person p where p.id = $1", [id])
	}
	createPerson(values) {
		const insertQuery = "INSERT INTO Person(id, forname, surname, birthdate, isAlive, gender) values (nextval('person_id_seq'), $1, $2, $3, $4, $5) returning *";
		return client.query(insertQuery, values)
	}

	// Relationship
	getAllRelationships() {
		return client.query("select * from Person_Person_Relationship",[])
	}
	createRelationship(person_1_id, person_2_id, relationship_id) {
		const insertQuery = "INSERT INTO Person_Person_Relationship(id, person_from_id, person_to_id, relationship_id) values (nextval('person_person_relationship_id_seq'), $1, $2, $3) returning *";
		var values = [person_1_id, person_2_id, relationship_id]
		return client.query(insertQuery, values)
	}	
	deleteRelationship(id) {
		return client.query("delete from Person_Person_Relationship ppr where ppr.id = $1", [id])
	}

	// Relationship Types
	getAllRelationshipTypes() {
		return client.query("select * from Relationship", [])
	}
	findRelationshipTypeById(id) {
		return client.query("select * from Relationship r where r.id = $1", [id])
	}
	deleteRelationshipType(id) {
		return client.query("delete from Relationship r where r.id = $1", [id])
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