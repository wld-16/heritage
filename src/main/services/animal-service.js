const client = require('../db')

class AnimalService {
	getAllAnimals() {
		return client.query("select * from Animal",[])
	}
	getAllSpecies() {
		return client.query("select * from Species",[])
	}
	getAllRaces() {
		return client.query("select * from Race", [])
	}
	createAnimal(values) {
		const insertQuery = "INSERT INTO Animal(id, name, isAlive, sex,species_id, race_id) values (nextval('animal_id_seq'), $1, $2, $3, $4, $5) returning *";
		return client.query(insertQuery, values)
	}
	createSpecies(values) {
		const insertQuery = "INSERT INTO Species(id, label) values (nextval('species_id_seq'), $1) returning *"
		return client.query(insertQuery, values)
	}
	createRace(values) {
		const insertQuery = "INSERT INTO Race(id, label) values (nextval('race_id_seq'), $1) returning *"
		return client.query(insertQuery, values)
	}
}

module.exports = AnimalService;