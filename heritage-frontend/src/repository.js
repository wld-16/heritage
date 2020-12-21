import axios from 'axios';
const BASE_URL = 'http://localhost:3000';

export function getPeople() {
	return axios.get(`${BASE_URL}/api/person/list`).then(response => response.data );
}

export function getAnimals() {
	return axios.get(`${BASE_URL}/api/animal/list`).then(response => response.data );
}

export function getSpecies() {
	return axios.get(`${BASE_URL}/api/species/list`).then(response => response.data );
}

export function getRelationshipTypes() {
	return axios.get(`${BASE_URL}/api/relationship-label/list`).then(response => response.data )
}

export function getRaces() {
	return axios.get(`${BASE_URL}/api/race/list`).then(response => response.data );
}

export function getRelationship() {
	return axios.get(`${BASE_URL}/api/relationship/list`).then(response => response.data )
}

export function createSpecies(data) {
	return axios.post(`${BASE_URL}/api/species/create`, { 
		label: data.label 
	}).then(response => response.data).catch(err => Promise.reject(err.message));
}

export function createRelationshipType(data) {
	return axios.post(`${BASE_URL}/api/relationship-label/create`, { 
		label: data.label,
		oppositeLabel: data.opposite_label
	}).then(response => response.data).catch(err => Promise.reject(err.message));
}

export function createRace(data) {
	return axios.post(`${BASE_URL}/api/race/create`, { 
		label: data.label 
	}).then(response => response.data).catch(err => Promise.reject(err.message));
}

export function createPerson(data) {
	return axios.post(`${BASE_URL}/api/person/create`, { 
		forname: data.forname,
		surname: data.surname,
		birthdate: data.birthdate,
		isAlive : data.isAlive,
		gender: data.gender 
	}).then(response => response.data).catch(err => Promise.reject(err.message));
}

export function createAnimal(data) {
	return axios.post(`${BASE_URL}/api/animal/create`, { 
		name: data.name,
		isAlive: data.isAlive,
		sex: data.sex,
		species_id: data.species,
		race_id: data.race 
	}).then(response => response.data).catch(err => Promise.reject(err.message));
}

export function createRelationship(data) {
	return axios.post(`${BASE_URL}/api/relationship/create`, { 
		person_1_id: data.person_1_id,
		person_2_id: data.person_2_id,
		relationship_label_id: data.relationship_id 
	}).then(response => response.data).catch(err => Promise.reject(err.message));
}