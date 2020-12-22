
const express = require('express')
const { Client } = require('pg');
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const port = process.env.PORT || 3000
const dbConnection = process.env.DATABASE_URL || "postgres://sensei:herit12S@localhost:35432/heritage"

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

const client = new Client({
  connectionString: dbConnection
});
client.connect();


app.get('/api/person/list', (req, res) => {
	client.query("select * from person").then(personData => {
		res.send(personData.rows)
	})
})

app.post('/api/person/create', (req, res) => {
	const insertQuery = "INSERT INTO Person(id, forname, surname, birthdate, isAlive, gender) values (nextval('person_id_seq'), $1, $2, $3, $4, $5) returning *";
	var values = [req.body.forname, req.body.surname, req.body.birthdate, req.body.isAlive, req.body.gender]
	client.query(insertQuery, values).then(personData => {
		console.log(personData.rows[0])
	})
})

app.get('/api/animal/list', (req, res) => {
	client.query("select * from animal").then(animalData => {
		res.send(animalData.rows)
	})
})

app.post('/api/animal/create', (req, res) => {
	const insertQuery = "INSERT INTO Animal(id, name, isAlive, sex,species_id, race_id) values (nextval('animal_id_seq'), $1, $2, $3, $4, $5) returning *";
	var values = [req.body.name, req.body.isAlive, req.body.sex, req.body.species_id, req.body.race_id]
	client.query(insertQuery, values).then(animalData => {
		console.log(animalData.rows[0])
	})
})


app.get('/api/species/list', (req, res) => {
	client.query("select * from species").then(speciesData => {
		res.send(speciesData.rows)
	})
})

app.post('/api/species/create', (req, res) => {
	const insertQuery = "INSERT INTO Species(id, label) values (nextval('species_id_seq'), $1) returning *";
	var values = [req.body.label]
	client.query(insertQuery, values).then(speciesData => {
		console.log(speciesData.rows[0])
	})
})

app.get('/api/race/list', (req, res) => {
	client.query("select * from race").then(raceData => {
		res.send(raceData.rows)
	})
})

app.post('/api/race/create', (req, res) => {
	const insertQuery = "INSERT INTO Race(id, label) values (nextval('race_id_seq'), $1) returning *";
	var values = [req.body.label]
	client.query(insertQuery, values).then(res => {
		console.log(res.rows[0])
	})
})

app.get('/api/relationship-label/list', (req, res) => {
	client.query("select * from relationship").then(relationshipLabelData => {
		res.send(relationshipLabelData.rows)
	})
})

app.post('/api/relationship-label/create', (req, res) => {
	const insertQuery = "INSERT INTO Relationship(id, label, opposite_id) values (nextval('relationship_id_seq'), $1, $2) returning *";
	var oppositeId = 0;
	var mainId = 0;
	var mainValuesEntry = [req.body.label, oppositeId]
	client.query(insertQuery, mainValuesEntry).then(relationshipLabelData => {
		mainId = relationshipLabelData.rows[0].id
		var oppositeValuesEntry = [req.body.opposite_label, mainId]
		client.query(insertQuery, oppositeValuesEntry).then(oppRelationshipLabelData => {
			oppositeId = oppRelationshipLabelData.rows[0].id
			const updateQuery = "UPDATE Relationship SET opposite_id = $1 where id = $2";
			client.query(updateQuery, [oppositeId, mainId]).then(relationshipLabelData => {
				console.log(relationshipLabelData)
			})
		})
	})
})

app.get('/api/relationship/list', (req, res) => {
	client.query("select * from Person_Person_Relationship").then(data => {
		res.send(data.rows)
	})
})

app.post('/api/relationship/create', (req, res) => {
	const insertQuery = "INSERT INTO Person_Person_Relationship(id, person_from_id, person_to_id, relationship_id) values (nextval('person_person_relationship_id_seq'), $1, $2, $3) returning *";
	var values = [req.body.person_1_id, req.body.person_2_id, req.body.relationship_label_id]
	client.query(insertQuery, values).then(res => {
		console.log("Executed insert relationship query")
		const selectRelationshipQuery = "SELECT * FROM Relationship WHERE Relationship.id = $1"
		client.query(selectRelationshipQuery, [req.body.relationship_label_id]).then(res => {
			client.query(insertQuery, [req.body.person_2_id, req.body.person_1_id, res.rows[0].opposite_id]).then(res => {
				console.log("Executed insert opposite relationship query")
			})
		})
	})
})


app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
