const client = require('../db')

class PersonService {
	// Person
	getAllPeople() {
		return client.query("SELECT * FROM person",[])
	}
	deletePerson(id) {
		return client.query("DELETE FROM person p WHERE p.id = $1", [id])
	}
	hardDeletePerson(person_id) {
		return client.query("delete from Person_Person_Relationship ppr where (id).from_id = $1 OR (id).to_id = $1", [person_id]).then(() => {
			return client.query("delete from Person p where p.id = $1", [person_id])
		})
	}
	createPerson(values) {
		const insertQuery = "INSERT INTO Person(id, forname, surname, birthdate, isAlive, gender) values (nextval('person_id_seq'), $1, $2, $3, $4, $5) returning *";
		return client.query(insertQuery, values)
	}
	saveImageData(id, imageData){
		const updateQuery = "UPDATE person SET imagedata = $2 WHERE id = $1 returning *";
		return client.query(updateQuery, [id, imageData])
	}
	getImageData(id) {
		const selectQuery = "SELECT imagedata from person where id = $1"
		return client.query(selectQuery, [id])
	}
	updatePerson(id, values) {
		const updateQuery = "UPDATE Person SET forname = $2, surname = $3, birthdate = $4, isAlive = $5, gender = $6 WHERE id = $1 returning *";
		return client.query(updateQuery, [id, ...values])
	}

	// Relationship
	getAllRelationships() {
		return client.query("select * from Person_Person_Relationship",[])
	}
	createRelationship(person_1_id, person_2_id, relationship_id) {
		const insertQuery = "INSERT INTO Person_Person_Relationship(id, person_from_id, person_to_id, relationship_id) values (ROW($3, $1, $2), $1, $2, $3) returning *";
		var values = [person_1_id, person_2_id, relationship_id]
		return client.query(insertQuery, values)
	}	
	deleteRelationship(relationship_id, person_from_id, person_to_id) {
		const deleteQuery = "delete from Person_Person_Relationship ppr where (id).relationship_id = $1 AND (id).from_id = $2 AND (id).to_id = $3";
		return client.query(deleteQuery, [relationship_id, person_from_id, person_to_id]).then(() => {
			client.query("select * from Relationship r where r.id = $1 LIMIT 1", [relationship_id]).then(data => {
				client.query(deleteQuery, [data.rows[0].opposite_id, person_to_id, person_from_id])
			})
		})
	}

	// Relationship Types
	getAllRelationshipTypes() {
		return client.query("select * from Relationship", [])
	}
	findRelationshipTypeById(id) {
		return client.query("select * from Relationship r where r.id = $1", [id])
	}
	deleteRelationshipType(relationshipType) {
		const deleteQuery = "delete from Relationship r where r.id = $1";
		return client.query(deleteQuery, [relationshipType.id]).then(() => client.query(deleteQuery, [relationshipType.opposite_id]))
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