import { query } from '../db/index.js'

class PersonService {
	// Person
	getAllPeople() {
		return query("SELECT * FROM person",[])
	}
	deletePerson(id: number) {
		return query("DELETE FROM person p WHERE p.id = $1", [id])
	}
	hardDeletePerson(person_id: number) {
		return query("delete from Person_Person_Relationship ppr where (id).from_id = $1 OR (id).to_id = $1", [person_id]).then(() => {
			return query("delete from Person p where p.id = $1", [person_id])
		})
	}
	createPerson(values: Person) {
		const insertQuery = "INSERT INTO Person(id, forname, surname, birthdate, isAlive, gender) values (nextval('person_id_seq'), $1, $2, $3, $4, $5) returning *";
		return query(insertQuery, values)
	}
	saveImageData(id: number, imageData: Buffer){
		const updateQuery = "UPDATE person SET imagedata = $2 WHERE id = $1 returning *";
		return query(updateQuery, [id, imageData])
	}
	getImageData(id: number) {
		const selectQuery = "SELECT imagedata from person where id = $1"
		return query(selectQuery, [id])
	}
	updatePerson(id: number, person: Person) {
		const updateQuery = "UPDATE Person SET forname = $2, surname = $3, birthdate = $4, isAlive = $5, gender = $6 WHERE id = $1 returning *";
		return query(updateQuery, [id, person.forname, person.surname, person.birthdate, person.isAlive, person.gender])
	}

	// Relationship
	getAllRelationships() {
		return query("select * from Person_Person_Relationship",[])
	}
	createRelationship(relationship: Relationship) {
		const insertQuery = "INSERT INTO Person_Person_Relationship(id, person_from_id, person_to_id, relationship_id) values (ROW($3, $1, $2), $1, $2, $3) returning *";
		var values = [relationship.person_from_id, relationship.person_to_id, relationship.relationship_id]
		return query(insertQuery, values)
	}	
	deleteRelationship(relationship: Relationship) {
		const deleteQuery = "delete from Person_Person_Relationship ppr where (id).relationship_id = $1 AND (id).from_id = $2 AND (id).to_id = $3";
		return query(deleteQuery, [relationship.relationship_id, relationship.person_from_id, relationship.person_to_id]).then(() => {
			query("select * from Relationship r where r.id = $1 LIMIT 1", [relationship.relationship_id]).then(data => {
				query(deleteQuery, [data.rows[0].opposite_id, relationship.person_to_id, relationship.person_from_id])
			})
		})
	}

	// Relationship Types
	getAllRelationshipTypes() {
		return query("select * from Relationship", [])
	}
	findRelationshipTypeById(id: number) {
		return query("select * from Relationship r where r.id = $1", [id])
	}
	deleteRelationshipType(relationshipType: RelationshipType) {
		const deleteQuery = "delete from Relationship r where r.id = $1";
		return query(deleteQuery, [relationshipType.id]).then(() => query(deleteQuery, [relationshipType.oppositeId]))
	}
	createMainRelationshipType(label: string) {
		const insertQuery = "INSERT INTO Relationship(id, label, opposite_id) values (nextval('relationship_id_seq'), $1, nextval('relationship_id_seq')) returning *";
		let mainValuesEntry = [label]
		return query(insertQuery, mainValuesEntry)	
	}
	createOppositeRelationshipType(relationship: RelationshipType) {
		const insertQuery = "INSERT INTO Relationship(id, label, opposite_id) values ($1, $2, $3) returning *";
		let oppositeValuesEntry = [relationship.id, relationship.label, relationship.oppositeId]
		return query(insertQuery, oppositeValuesEntry)
	}
}

export {
	PersonService
} ;