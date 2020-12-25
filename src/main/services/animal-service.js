const client = require('../db')

class AnimalService {
	getAllAnimals(callback) {
		client.query("select * from Animal",[], callback)
	}
	getAllSpecies(callback) {
		client.query("select * from Species",[], callback)
	}
	getAllRaces(callback) {
		client.query("select * from Race", [], callback)
	}
	createAnimal(values) {
		const insertQuery = "INSERT INTO Animal(id, name, isAlive, sex,species_id, race_id) values (nextval('animal_id_seq'), $1, $2, $3, $4, $5) returning *";
		client.query(insertQuery, values, (err, data) => {
			console.log(data.rows[0])
		})
	}
	createSpecies(values) {
		const insertQuery = "INSERT INTO Species(id, label) values (nextval('species_id_seq'), $1) returning *"
		client.query(insertQuery, values, (err, data) => {
			console.log(data.rows[0])
		})
	}
	createRace(values) {
		const insertQuery = "INSERT INTO Race(id, label) values (nextval('race_id_seq'), $1) returning *"
		client.query(insertQuery, values, (err, data) => {
			console.log(data.rows[0])
		})
	}
}

module.exports = AnimalService;