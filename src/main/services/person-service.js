const client = require('../db')

class PersonService {
	getAllPeople(callback) {
		client.query("select * from Person",[], callback)
	}
	getAllRelationships(callback) {
		client.query("select * from Person_Person_Relationship",[],callback)
	}
	getAllRelationshipTypes(callback) {
		client.query("select * from Relationship", [], callback)
	}
	createPerson(values) {
		const insertQuery = "INSERT INTO Person(id, forname, surname, birthdate, isAlive, gender) values (nextval('person_id_seq'), $1, $2, $3, $4, $5) returning *";
		client.query(insertQuery, values, (err, personData) => {
			console.log(personData.rows[0])
		})
	}
	createRelationshipPair(data){
		const insertQuery = "INSERT INTO Person_Person_Relationship(id, person_from_id, person_to_id, relationship_id) values (nextval('person_person_relationship_id_seq'), $1, $2, $3) returning *";
		var values = [data.person_1_id, data.person_2_id, data.relationship_label_id]
		client.query(insertQuery, values, (err, res) => {
			console.log("Executed insert relationship query")
			const selectRelationshipQuery = "SELECT * FROM Relationship WHERE Relationship.id = $1"
			client.query(selectRelationshipQuery, [data.relationship_label_id], (err, res) => {
				client.query(insertQuery, [data.person_2_id, data.person_1_id, res.rows[0].opposite_id], (err,res) => {
					console.log("Executed insert opposite relationship query")
				})
			})
		})
	}
	createRelationshipTypePair(mainLabel, oppositeLabel) {
		const insertQuery = "INSERT INTO Relationship(id, label, opposite_id) values (nextval('relationship_id_seq'), $1, $2) returning *";
		var oppositeId = 0;
		var mainId = 0;
		var mainValuesEntry = [mainLabel, oppositeId]
		client.query(insertQuery, mainValuesEntry, (err, relationshipLabelData) => {
			mainId = relationshipLabelData.rows[0].id
			var oppositeValuesEntry = [oppositeLabel, mainId]
			client.query(insertQuery, oppositeValuesEntry, (err, oppRelationshipLabelData) => {
				oppositeId = oppRelationshipLabelData.rows[0].id
				const updateQuery = "UPDATE Relationship SET opposite_id = $1 where id = $2";
				client.query(updateQuery, [oppositeId, mainId], (err, relationshipLabelData) => {
					console.log(relationshipLabelData)
				})
			})
		})
	}
}

module.exports = PersonService;