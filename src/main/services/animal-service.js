const client = require('../db')

class AnimalService {
	// Animals
	getAllAnimals() {
		return client.query("select * from Animal",[])
	}
	createAnimal(values) {
		const insertQuery = "INSERT INTO Animal(id, name, isAlive, sex, species_id, race_id) values (nextval('animal_id_seq'), $1, $2, $3, $4, $5) returning *";
		return client.query(insertQuery, values)
	}
	deleteAnimal(id) {
		return client.query("DELETE FROM Animal where id = $1", [id])
	}

	// Species
	getAllSpecies() {
		return client.query("select * from Species",[])
	}
	createSpecies(values) {
		const insertQuery = "INSERT INTO Species(id, label) values (nextval('species_id_seq'), $1) returning *"
		return client.query(insertQuery, values)
	}
	deleteSpecies(id) {
		return client.query("DELETE FROM Species where id = $1", [id])
	}

	// Races
	getAllRaces() {
		return client.query("select * from Race", [])
	}
	createRace(values) {
		const insertQuery = "INSERT INTO Race(id, label) values (nextval('race_id_seq'), $1) returning *"
		return client.query(insertQuery, values)
	}
	deleteRace(id) {
		return client.query("DELETE FROM Race where id = $1", [id])
	}
}

module.exports = AnimalService;