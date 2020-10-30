import axios from 'axios';
const BASE_URL = 'http://localhost:5050';

export function getPeople() {
	return axios.get(`${BASE_URL}/api/person/list`).then(response => response.data );
}

export function getAnimals() {
	return axios.get(`${BASE_URL}/api/animal/list`).then(response => response.data );
}

export function getSpecies() {
	return axios.get(`${BASE_URL}/api/species/list`).then(response => response.data );
}

export function getRelationships() {
	return axios.get(`${BASE_URL}/api/relationship/list`).then(response => response.data )
}

export function getRaces() {
	return axios.get(`${BASE_URL}/api/race/list`).then(response => response.data );
}

export function createSpecies(data) {
	return axios.post(`${BASE_URL}/api/species/create`, { 
		label: data.label 
	}).then(response => response.data).catch(err => Promise.reject(err.message));
}

export function createRelationship(data) {
	return axios.post(`${BASE_URL}/api/relationship/create`, { 
		label: data.label 
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