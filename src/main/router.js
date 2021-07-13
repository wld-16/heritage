const express = require('express')
const router = express.Router();
const client = require('./db')

const PersonService = require('./services/person-service')
const FamiltyTreeService = require('./services/familytree-service')
const AnimalService = require('./services/animal-service')

const familyTreeService = new FamiltyTreeService()
const personService = new PersonService()
const animalService = new AnimalService()

router.get('/api/person/list', (req, res) => {
	personService.getAllPeople()
		.then(data => res.send(data.rows))
		.catch(err => { console.log("OnListPerson: " + err)} )
})

router.post('/api/person/create', (req, res) => {
	var values = [req.body.forname, req.body.surname, req.body.birthdate, req.body.isAlive, req.body.gender]
	personService.createPerson(values)
		.then(data => res.send(true))
		.catch(err => { console.log("OnCreatePerson: " + err)} )
})

router.post('/api/person/delete', (req, res) => {
	personService.deletePerson(req.body.id)
		.then(data => res.send(true))
		.catch(err => { console.log("OnDeletePerson: " + err)} )
})

router.get('/api/animal/list', (req, res) => {
	animalService.getAllAnimals()
		.then(data => res.send(data.rows))
		.catch(err => { console.log("OnListAnimal: " + err)} )
})

router.post('/api/animal/create', (req, res) => {
	var values = [req.body.name, req.body.isAlive, req.body.sex, req.body.species_id, req.body.race_id]
	animalService.createAnimal(values)
		.then(data => res.send(true))
		.catch(err => { console.log("OnCreateAnimal: " + err)} )
})

router.post('/api/animal/delete', (req, res) => {
	animalService.deleteAnimal(req.body.id)
		.then(data => res.send(true))
		.catch(err => { console.log("OnDeleteAnimal: " + err)} )
})

router.get('/api/species/list', (req, res) => {
	animalService.getAllSpecies()
		.then(data => res.send(data.rows))
		.catch(err => { console.log("OnListSpecies: " + err) } )
})

router.post('/api/species/create', (req, res) => {
	var values = [req.body.label]
	animalService.createSpecies(values)
		.then(data => res.send(true))
		.catch(err => { console.log("OnCreateSpecies: "+ err)} )
})

router.post('/api/species/delete', (req, res) => {
	animalService.deleteSpecies(req.body.id)
		.then(data => res.send(true))
		.catch(err => { console.log("OnDeleteSpecies: " + err)})
})

router.get('/api/race/list', (req, res) => {
	animalService.getAllRaces()
		.then(data => res.send(data.rows))
		.catch(err => { console.log("OnListRace: " + err)})
})

router.post('/api/race/create', (req, res) => {
	var values = [req.body.label]
	animalService.createRace(values)
		.then(data => res.send(true))
		.catch(err => { console.log("OnCreateRace: " + err)} )
})

router.post('/api/race/delete', (req, res) => {
	animalService.deleteRace(req.body.id)
		.then(data => res.send(true))
		.catch(err => { console.log("OnDeleteRace: " + err)} )
})

router.get('/api/relationship-label/list', (req, res) => {
	personService.getAllRelationshipTypes()
		.then(data => res.send(data.rows))
		.catch(err => { console.log("OnListRelationshipLabel: " + err)} )
})

router.post('/api/relationship-label/create', (req, res) => {
	let mainId = 0
	let oppositeId = 0
	personService.createMainRelationshipType(req.body.label)
		.then(data => { 
			mainId = data.rows[0].id
			oppositeId = data.rows[0].opposite_id
			personService.createOppositeRelationshipType(oppositeId, req.body.opposite_label, mainId)
				.then(data => { res.send(true) })
				.catch(err => { console.log("OnCreateRelationship: " + err) })
		})
		.catch(err => { console.log("OnCreateRelationship: " + err) })
})

router.post('/api/relationship-label/delete', (req, res) => {
	console.log("deleting: " + req.body)
	personService.deleteRelationshipType(req.body)
		.then(data => res.send(true))
		.catch(err => { console.log("OnDeleteRace: " + err)} )
})

router.get('/api/relationship/list', (req, res) => {
	personService.getAllRelationships()
		.then(data => res.send(data.rows))
		.catch(err => { console.log("OnListRelationship: " + err)})
})

router.post('/api/relationship/delete', (req, res) => {
	console.log(req.body)
	personService.deleteRelationship(req.body.relationship_id, req.body.person_from_id, req.body.person_to_id)
	.then(data => res.send(true))
	.catch(err => { console.log("OnDeleteRelationship: " + err)} )
})

router.post('/api/relationship/create', (req, res) => {
	let requestBody = req.body
	personService.createRelationship(requestBody.person_1_id, requestBody.person_2_id, requestBody.relationship_label_id)
		.then(data => {
			personService.findRelationshipTypeById(requestBody.relationship_label_id)
				.then(relationshipData => {
					personService.createRelationship(requestBody.person_2_id, requestBody.person_1_id, relationshipData.rows[0].opposite_id)
						.then(result => res.send(true))
						.catch(err => console.log("Could not create opposite relationship: " + err))
				})
				.catch(err => console.log("Could not find relationship by label: " + err))
		})
		.catch(err => console.log("Could not create main relationship: " + err))
})

router.get('/api/family-tree/maxHeight', (req, res) => {
	console.log("Count max depth")
	familyTreeService.countMaxDepth().then(promises => {
		Promise.all(promises).then(values => {
			res.send({branches: values.map(d => d.done).flat().map(node => {
				node.path = node.path.slice(0, node.path.length-10) + ("}".repeat(node.l))
				return node
			}), max: "" + Math.max(...values.map(d => d.done).flat().map(node => node.l))})
		})
	})
})

router.get('/', (req, res) => {
  	res.send('Hello World!');
})

module.exports = router;