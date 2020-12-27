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
	personService.getAllPeople((err,data) => res.send(data.rows))
})

router.post('/api/person/create', (req, res) => {
	var values = [req.body.forname, req.body.surname, req.body.birthdate, req.body.isAlive, req.body.gender]
	personService.createPerson(values)
})

router.get('/api/animal/list', (req, res) => {
	animalService.getAllAnimals((err, data) => res.send(data.rows))
})

router.post('/api/animal/create', (req, res) => {
	var values = [req.body.name, req.body.isAlive, req.body.sex, req.body.species_id, req.body.race_id]
	animalService.createAnimal(values)
})

router.get('/api/species/list', (req, res) => {
	animalService.getAllSpecies((err, data) => res.send(data.rows))
})

router.post('/api/species/create', (req, res) => {
	var values = [req.body.label]
	animalService.createSpecies(values)
})

router.get('/api/race/list', (req, res) => {
	animalService.getAllRaces((err, data) => res.send(data.rows))
})

router.post('/api/race/create', (req, res) => {
	var values = [req.body.label]
	animalService.createRace(values)
})

router.get('/api/relationship-label/list', (req, res) => {
	personService.getAllRelationshipTypes((err, data) => res.send(data.rows))
})

router.post('/api/relationship-label/create', (req, res) => {
	personService.createRelationshipTypePair(req.body.label, req.body.opposite_label)
})

router.get('/api/relationship/list', (req, res) => {
	personService.getAllRelationships((err, data) => res.send(data.rows))
})

router.get('/api/family-tree/maxHeight', (req, res) => {
	familyTreeService.countMaxDepth();
})

router.post('/api/relationship/create', (req, res) => {
	personService.createRelationshipPair(req.body)
})

router.get('/', (req, res) => {
  res.send('Hello World!');
})

module.exports = router;