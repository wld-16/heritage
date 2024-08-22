const express = require('express')
const fs = require('fs')
const router = express.Router();
const client = require('./db')
const imageThumbnail = require('image-thumbnail');

const PersonService = require('./services/person-service')
const FamiltyTreeService = require('./services/familytree-service')
const AnimalService = require('./services/animal-service')

const familyTreeService = new FamiltyTreeService()
const personService = new PersonService()
const animalService = new AnimalService()

router.get('/api/person/list', (req, res) => {
    log("Fetch People")
    personService.getAllPeople()
        .then(data => {
            res.send(data.rows)
        })
        .catch(err => {
            console.log("OnListPerson: " + err)
        })
})

router.post('/api/person/create', (req, res) => {
    log("Create Person")
    var values = [req.body.forname, req.body.surname, req.body.birthdate, req.body.isAlive, req.body.gender]
    if (req.body.id === 0) {
        personService.createPerson(values)
            .then(data => res.send(data))
            .catch(err => {
                console.log("OnCreatePerson: " + err)
            })
    } else {
        personService.updatePerson(req.body.id, values)
            .then(data => res.send(data))
            .catch(err => {
                console.log("OnCreatePerson: " + err)
            })
    }
})

router.post('/api/person/upload-file/:personId', (req, res) => {
    log("Upload Image")
    imageThumbnail(req.files.image.data, {
        width: 79,
        height: 112
    }).then(output => {
        personService.saveImageData(req.params.personId, output).then(data => {
            res.send("Save Image File")
        })
    })
})

router.get('/api/person/get-image/:personId', (req, res) => {
    log("Fetch Image")
    personService.getImageData(req.params.personId).then(data => {
        res.set('Content-Type', 'image/jpeg');
        if (data.rows[0].imagedata == null) {
            fs.readFile("src/res/male.jpg", {}, (err, fileData) => {
                res.send(fileData)
            })
        } else {
            res.send(data.rows[0].imagedata)
        }
    })
})

router.post('/api/person/delete', (req, res) => {
    log("Delete Person with ID=" + req.body.id)
    personService.deletePerson(req.body.id)
        .then(data => res.send(true))
        .catch(err => {
            console.log("OnDeletePerson: " + err)
        })
})

router.post('/api/person/hard-delete', (req, res) => {
    log("Hard Delete Person with ID=" + req.body.id)
    personService.hardDeletePerson(req.body.id)
        .then(data => res.send(true))
        .catch(err => {
            console.log("OnDeletePerson: " + err)
        })
})

router.get('/api/animal/list', (req, res) => {
    log("Fetch Animals")
    animalService.getAllAnimals()
        .then(data => res.send(data.rows))
        .catch(err => {
            console.log("OnListAnimal: " + err)
        })
})

router.post('/api/animal/create', (req, res) => {
    log("Create Animal")
    var values = [req.body.name, req.body.isAlive, req.body.sex, req.body.species_id, req.body.race_id]
    animalService.createAnimal(values)
        .then(data => res.send(true))
        .catch(err => {
            console.log("OnCreateAnimal: " + err)
        })
})

router.post('/api/animal/delete', (req, res) => {
    log("Delete Animal with ID=" + req.body.id)
    animalService.deleteAnimal(req.body.id)
        .then(data => res.send(true))
        .catch(err => {
            console.log("OnDeleteAnimal: " + err)
        })
})

router.get('/api/species/list', (req, res) => {
    log("List all species")
    animalService.getAllSpecies()
        .then(data => res.send(data.rows))
        .catch(err => {
            console.log("OnListSpecies: " + err)
        })
})

router.post('/api/species/create', (req, res) => {
    log("Create all species")
    var values = [req.body.label]
    animalService.createSpecies(values)
        .then(data => res.send(true))
        .catch(err => {
            console.log("OnCreateSpecies: " + err)
        })
})

router.post('/api/species/delete', (req, res) => {
    log("Delete species with ID=" + req.body.id)
    animalService.deleteSpecies(req.body.id)
        .then(data => res.send(true))
        .catch(err => {
            console.log("OnDeleteSpecies: " + err)
        })
})

router.get('/api/race/list', (req, res) => {
    log("Get all Races")
    animalService.getAllRaces()
        .then(data => res.send(data.rows))
        .catch(err => {
            console.log("OnListRace: " + err)
        })
})

router.post('/api/race/create', (req, res) => {
    log("Create Race")
    var values = [req.body.label]
    animalService.createRace(values)
        .then(data => res.send(true))
        .catch(err => {
            console.log("OnCreateRace: " + err)
        })
})

router.post('/api/race/delete', (req, res) => {
    log("Delete Race with ID=" + req.body.id)
    animalService.deleteRace(req.body.id)
        .then(data => res.send(true))
        .catch(err => {
            console.log("OnDeleteRace: " + err)
        })
})

router.get('/api/relationship-label/list', (req, res) => {
    log("List all relationship labels")
    personService.getAllRelationshipTypes()
        .then(data => res.send(data.rows))
        .catch(err => {
            console.log("OnListRelationshipLabel: " + err)
        })
})

router.post('/api/relationship-label/create', (req, res) => {
    log("Create relationship label")
    let mainId = 0
    let oppositeId = 0
    personService.createMainRelationshipType(req.body.label)
        .then(data => {
            mainId = data.rows[0].id
            oppositeId = data.rows[0].opposite_id
            personService.createOppositeRelationshipType(oppositeId, req.body.opposite_label, mainId)
                .then(data => {
                    res.send(true)
                })
                .catch(err => {
                    console.log("OnCreateRelationship: " + err)
                })
        })
        .catch(err => {
            console.log("OnCreateRelationship: " + err)
        })
})

router.post('/api/relationship-label/delete', (req, res) => {
    log("Delete relationship type")
    personService.deleteRelationshipType(req.body.id)
        .then(data => res.send(true))
        .catch(err => {
            console.log("OnDeleteRace: " + err)
        })
})

router.get('/api/relationship/list', (req, res) => {
    log("List all relationship")
    personService.getAllRelationships()
        .then(data => res.send(data.rows))
        .catch(err => {
            console.log("OnListRelationship: " + err)
        })
})

router.post('/api/relationship/delete', (req, res) => {
    const relationshipId = req.body.id.replace(")", "").replace("(", "").split(',')[0]
    const person_from_id = req.body.id.replace(")", "").replace("(", "").split(',')[1]
    const person_to_id = req.body.id.replace(")", "").replace("(", "").split(',')[2]
    personService.deleteRelationship(relationshipId, person_from_id, person_to_id)
        .then(data => res.send(true))
        .catch(err => {
            console.log("OnDeleteRelationship: " + err)
        })
})

router.post('/api/relationship/create', (req, res) => {
    log("Create relationship")
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
    log("Get max height")
    familyTreeService.countMaxDepth().then(promises => {
        Promise.all(promises).then(values => {
            res.send({
                branches: values.map(d => d.done).flat().map(node => {
                    node.path = node.path.slice(0, node.path.length - 9) + ("}".repeat(node.l))
                    return node
                }), max: "" + Math.max(...values.map(d => d.done).flat().map(node => node.l))
            })
        })
    })
})

function log(content) {
    console.log("[" + new Date().toLocaleString() + "] - " + content)
}

module.exports = router;