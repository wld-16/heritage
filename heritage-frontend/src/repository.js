import axios from 'axios';
const BASE_URL = process.env.VUE_APP_API_URL || "localhost:3000";

export default {
	methods: {
		// People
		getPeople: function() {
			return axios.get(`${BASE_URL}/api/person/list`).then(response => response.data );
		},
		createPerson: function(data) {
			return axios.post(`${BASE_URL}/api/person/create`, { 
				id: data.id,
				forname: data.forname,
				surname: data.surname,
				birthdate: data.birthdate,
				isAlive : data.isAlive,
				gender: data.gender
			}).then(response => response.data).catch(err => Promise.reject(err.message));
		},
		deletePerson: function(id) {
			return axios.post(`${BASE_URL}/api/person/delete`, {
				id: id
			}).then(response => response.data )	
		},
		hardDeletePerson: function(id) {
			return axios.post(`${BASE_URL}/api/person/hard-delete`, {
				id: id
			}).then(response => response.data )	
		},

		// Animal
		getAnimals: function() {
			return axios.get(`${BASE_URL}/api/animal/list`).then(response => response.data);
		},
		createAnimal: function(data) {
			return axios.post(`${BASE_URL}/api/animal/create`, { 
				name: data.name,
				isAlive: data.isAlive,
				sex: data.sex,
				species_id: data.species,
				race_id: data.race 
			}).then(response => response.data).catch(err => Promise.reject(err.message));
		},
		deleteAnimal: function(id) {
			return axios.post(`${BASE_URL}/api/animal/delete`, {
				id: id
			}).then(response => response.data )	
		},

		// Species
		getSpecies: function() {
			return axios.get(`${BASE_URL}/api/species/list`).then(response => response.data);
		},
		createSpecies: function(data) {
			return axios.post(`${BASE_URL}/api/species/create`, { 
				label: data.label 
			}).then(response => response.data).catch(err => Promise.reject(err.message));
		},
		deleteSpecies: function(id) {
			return axios.post(`${BASE_URL}/api/species/delete`, {
				id: id
			}).then(response => response.data )	
		},

		// RelationshipType
		getRelationshipTypes: function() {
			return axios.get(`${BASE_URL}/api/relationship-label/list`).then(response => response.data)
		},
		createRelationshipType: function(data) {
			return axios.post(`${BASE_URL}/api/relationship-label/create`, { 
				label: data.label,
				opposite_label: data.opposite_label
			}).then(response => response.data).catch(err => Promise.reject(err.message));
		},
		deleteRelationshipType: function(relationshipType) {
			return axios.post(`${BASE_URL}/api/relationship-label/delete`, relationshipType).then(response => response.data )	
		},

		// Race
		getRaces: function() {
			return axios.get(`${BASE_URL}/api/race/list`).then(response => response.data);
		},
		deleteRace: function(id) {
			return axios.post(`${BASE_URL}/api/race/delete`, {
				id: id
			}).then(response => response.data )
		},
		createRace: function(data) {
			return axios.post(`${BASE_URL}/api/race/create`, { 
				label: data.label 
			}).then(response => response.data).catch(err => Promise.reject(err.message));
		},


		// Relationship
		getRelationship: function() {
			return axios.get(`${BASE_URL}/api/relationship/list`).then(response => response.data);
		},
		deleteRelationship: function(relationship) {
			return axios.post(`${BASE_URL}/api/relationship/delete`, relationship).then(response => response.data )	
		},
		createRelationship: function(data) {
			return axios.post(`${BASE_URL}/api/relationship/create`, { 
				person_1_id: data.person_1_id,
				person_2_id: data.person_2_id,
				relationship_label_id: data.relationship_id 
			}).then(response => response.data).catch(err => Promise.reject(err.message));
		},

		// Get Branches
		getBranches: function() {
			return axios.get(`${BASE_URL}/api/family-tree/maxHeight`).then(response => response.data )
		}
	}
}