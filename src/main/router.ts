import { AnimalService } from "./services/animal-service.js";

import express from 'express'
import { Request, Response, NextFunction } from 'express'
import fs from 'fs'
import imageThumbnail from 'image-thumbnail'

import { PersonService } from './services/person-service.js'
import { FamilyTreeService } from './services/familytree-service.js'

import { parseJwt } from "./services/jwt-service.js"

const router = express.Router();
const familyTreeService = new FamilyTreeService()
const personService = new PersonService()
const animalService = new AnimalService()

router.use((req: Request, res: Response, next: NextFunction) => {
    //console.log(req.header("Authorization"))
    if(req.header("Authorization")) {
        const expiryTimeStamp = parseJwt(req.header("Authorization").replace("Bearer ","")).exp;
        if(
            (new Date(expiryTimeStamp * 1000).valueOf() - new Date().valueOf()) < 0
        ) {
            log("JWT expired - Invalid Request")
            res.status(401)
        } else {
            //console.log(parseJwt(req.header("Authorization").replace("Bearer ","")))
        }
    }
    next()
})

router.get('/api/person/list', (req: Request, res: Response) => {
    log("Fetch People")
    personService.getAllPeople()
        .then(data => {
            res.send(data.rows)
        })
        .catch(err => {
            console.log("OnListPerson: " + err)
        })
})

router.post('/api/person/create', (req: Request, res: Response) => {
    log("Create Person")
    const person = {
        forname: req.body.forname,
        surname: req.body.surname,
        birthdate: req.body.birthdate,
        isAlive: req.body.isAlive,
        gender: req.body.gender
    };
    if (req.body.id === 0) {
        personService.createPerson(person)
            .then(data => res.send(data))
            .catch(err => {
                console.log("OnCreatePerson: " + err)
            })
    } else {
        personService.updatePerson(req.body.id, person)
            .then(data => res.send(data))
            .catch(err => {
                console.log("OnCreatePerson: " + err)
            })
    }
})

router.post('/api/person/upload-file/:personId', (req: Request, res: Response) => {
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

router.get('/api/person/get-image/:personId', (req: Request, res: Response) => {
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

router.post('/api/person/delete', (req: Request, res: Response) => {
    log("Delete Person with ID=" + req.body.id)
    personService.deletePerson(req.body.id)
        .then(data => res.send(true))
        .catch(err => {
            console.log("OnDeletePerson: " + err)
        })
})

router.post('/api/person/hard-delete', (req: Request, res: Response) => {
    log("Hard Delete Person with ID=" + req.body.id)
    personService.hardDeletePerson(req.body.id)
        .then(data => res.send(true))
        .catch(err => {
            console.log("OnDeletePerson: " + err)
        })
})

router.get('/api/animal/list', (req: Request, res: Response) => {
    log("Fetch Animals")
    animalService.getAllAnimals()
        .then(data => res.send(data.rows))
        .catch(err => {
            console.log("OnListAnimal: " + err)
        })
})

router.post('/api/animal/create', (req: Request, res: Response) => {
    log("Create Animal")
    animalService.createAnimal({
        name: req.body.name,
        isAlive: req.body.isAlive,
        sex: req.body.sex,
        species_id: req.body.species_id,
        race_id: req.body.race_id
    })
        .then(data => res.send(true))
        .catch(err => {
            console.log("OnCreateAnimal: " + err)
        })
})

router.post('/api/animal/delete', (req: Request, res: Response) => {
    log("Delete Animal with ID=" + req.body.id)
    animalService.deleteAnimal(req.body.id)
        .then(data => res.send(true))
        .catch(err => {
            console.log("OnDeleteAnimal: " + err)
        })
})

router.get('/api/species/list', (req: Request, res: Response) => {
    log("List all species")
    animalService.getAllSpecies()
        .then(data => res.send(data.rows))
        .catch(err => {
            console.log("OnListSpecies: " + err)
        })
})

router.post('/api/species/create', (req: Request, res: Response) => {
    log("Create all species")
    animalService.createSpecies(req.body.label)
        .then(data => res.send(true))
        .catch(err => {
            console.log("OnCreateSpecies: " + err)
        })
})

router.post('/api/species/delete', (req: Request, res: Response) => {
    log("Delete species with ID=" + req.body.id)
    animalService.deleteSpecies(req.body.id)
        .then(data => res.send(true))
        .catch(err => {
            console.log("OnDeleteSpecies: " + err)
        })
})

router.get('/api/race/list', (req: Request, res: Response) => {
    log("Get all Races")
    animalService.getAllRaces()
        .then(data => res.send(data.rows))
        .catch(err => {
            console.log("OnListRace: " + err)
        })
})

router.post('/api/race/create', (req: Request, res: Response) => {
    log("Create Race")

    animalService.createRace(req.body.label)
        .then(data => res.send(true))
        .catch(err => {
            console.log("OnCreateRace: " + err)
        })
})

router.post('/api/race/delete', (req: Request, res: Response) => {
    log("Delete Race with ID=" + req.body.id)
    animalService.deleteRace(req.body.id)
        .then(data => res.send(true))
        .catch(err => {
            console.log("OnDeleteRace: " + err)
        })
})

router.get('/api/relationship-label/list', (req: Request, res: Response) => {
    log("List all relationship labels")
    personService.getAllRelationshipTypes()
        .then(data => res.send(data.rows))
        .catch(err => {
            console.log("OnListRelationshipLabel: " + err)
        })
})

router.post('/api/relationship-label/create', (req: Request, res: Response) => {
    log("Create relationship label")
    let mainId = 0
    let oppositeId = 0
    personService.createMainRelationshipType(req.body.label)
        .then(data => {
            mainId = data.rows[0].id
            oppositeId = data.rows[0].opposite_id
            personService.createOppositeRelationshipType({
                oppositeId: oppositeId,
                label: req.body.opposite_label,
                id: mainId
            })
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

router.post('/api/relationship-label/delete', (req: Request, res: Response) => {
    log("Delete relationship type")
    personService.deleteRelationshipType(req.body.id)
        .then(data => res.send(true))
        .catch(err => {
            console.log("OnDeleteRace: " + err)
        })
})

router.get('/api/relationship/list', (req: Request, res: Response) => {
    log("List all relationship")
    personService.getAllRelationships()
        .then(data => res.send(data.rows))
        .catch(err => {
            console.log("OnListRelationship: " + err)
        })
})

router.post('/api/relationship/delete', (req: Request, res: Response) => {
    const relationshipId = req.body.id.replace(")", "").replace("(", "").split(',')[0]
    const person_from_id = req.body.id.replace(")", "").replace("(", "").split(',')[1]
    const person_to_id = req.body.id.replace(")", "").replace("(", "").split(',')[2]
    personService.deleteRelationship({
        relationship_id: relationshipId,
        person_from_id: person_from_id,
        person_to_id: person_to_id
    })
        .then(data => res.send(true))
        .catch(err => {
            console.log("OnDeleteRelationship: " + err)
        })
})

router.post('/api/relationship/create', (req: Request, res: Response) => {
    log("Create relationship")
    let requestBody = req.body
    personService.createRelationship({
        person_from_id: requestBody.person_1_id,
        person_to_id: requestBody.person_2_id,
        relationship_id: requestBody.relationship_label_id
    })
        .then(data => {
            personService.findRelationshipTypeById(requestBody.relationship_label_id)
                .then(relationshipData => {
                    personService.createRelationship({
                        person_to_id: requestBody.person_2_id,
                        person_from_id: requestBody.person_1_id,
                        relationship_id: relationshipData.rows[0].opposite_id
                    })
                        .then(result => res.send(true))
                        .catch(err => console.log("Could not create opposite relationship: " + err))
                })
                .catch(err => console.log("Could not find relationship by label: " + err))
        })
        .catch(err => console.log("Could not create main relationship: " + err))
})

router.get('/api/family-tree/maxHeight', (req: Request, res: Response) => {
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

export{
    router
};