
import { query } from '../db/index.js';

class AnimalService {
	// Animals
	getAllAnimals() {
		return query("SELECT * FROM Animal",[])
	}
	createAnimal(animal: Animal) {
		const insertQuery = "INSERT INTO Animal(id, name, isAlive, sex, species_id, race_id) values (nextval('animal_id_seq'), $1, $2, $3, $4, $5) returning *";
		return query(insertQuery, [animal.name, animal.isAlive, animal.sex, animal.species_id, animal.race_id])
	}
	deleteAnimal(id: number) {
		return query("DELETE FROM Animal where id = $1", [id])
	}

	// Species
	getAllSpecies() {
		return query("SELECT * FROM Species",[])
	}
	createSpecies(label: string) {
		const insertQuery = "INSERT INTO Species(id, label) values (nextval('species_id_seq'), $1) returning *"
		return query(insertQuery, label)
	}
	deleteSpecies(id: number) {
		return query("DELETE FROM Species where id = $1", [id])
	}

	// Races
	getAllRaces() {
		return query("SELECT * FROM Race", [])
	}
	createRace(label: string) {
		const insertQuery = "INSERT INTO Race(id, label) values (nextval('race_id_seq'), $1) returning *"
		return query(insertQuery, [label])
	}
	deleteRace(id: number) {
		return query("DELETE FROM Race where id = $1", [id])
	}
}

export {
	AnimalService
};