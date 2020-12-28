const client = require('../db')

class PersonService {
	getAllPeople() {
		return client.query("select * from Person",[])
	}
	getAllRelationships() {
		return client.query("select * from Person_Person_Relationship",[])
	}
	getAllRelationshipTypes() {
		return client.query("select * from Relationship", [])
	}
	createPerson(values) {
		const insertQuery = "INSERT INTO Person(id, forname, surname, birthdate, isAlive, gender) values (nextval('person_id_seq'), $1, $2, $3, $4, $5) returning *";
		return client.query(insertQuery, values)
	}
	createRelationshipPair(data){
		const insertQuery = "INSERT INTO Person_Person_Relationship(id, person_from_id, person_to_id, relationship_id) values (nextval('person_person_relationship_id_seq'), $1, $2, $3) returning *";
		var values = [data.person_1_id, data.person_2_id, data.relationship_label_id]
		client.query(insertQuery, values)
		console.log("Executed insert relationship query")
		const selectRelationshipQuery = "SELECT * FROM Relationship WHERE Relationship.id = $1"
		let res = client.query(selectRelationshipQuery, [data.relationship_label_id])
		client.query(insertQuery, [data.person_2_id, data.person_1_id, res.rows[0].opposite_id])
		console.log("Executed insert opposite relationship query")
	}
	createRelationshipTypePair(mainLabel, oppositeLabel) {
		const insertQuery = "INSERT INTO Relationship(id, label, opposite_id) values (nextval('relationship_id_seq'), $1, $2) returning *";
		var mainValuesEntry = [mainLabel, oppositeId]

		let relationshipLabelData = client.query(insertQuery, mainValuesEntry)
		let mainId = relationshipLabelData.rows[0].id
		var oppositeValuesEntry = [oppositeLabel, mainId]

		let oppRelationshipLabelData = client.query(insertQuery, oppositeValuesEntry)
		let oppositeId = oppRelationshipLabelData.rows[0].id

		const updateQuery = "UPDATE Relationship SET opposite_id = $1 where id = $2";
		console.log(client.query(updateQuery, [oppositeId, mainId]))
	}
}

module.exports = PersonService;