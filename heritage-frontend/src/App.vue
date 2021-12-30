<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <graph-visualization></graph-visualization>
    <div class="container">
        <div v-if="computedPeople">
          <h2>People</h2>
          <li v-for="person in computedPeople" :key="person.id">
            {{ person }}
            <button @click="deletePerson(person.id).then(() => updateView())">delete</button>
            <button @click="hardDeletePerson(person.id).then(() => updateView())">hard-delete</button>
            <button @click="showEditFragment(person.id)">edit</button>
            <create-or-update-person v-if="computedEditTable[person.id].showEdit" @created="updatePeople" :person="computedEditTable[person.id].person"></create-or-update-person>
            <br>
          </li>
        </div>
        <div v-if="relationships">
          <h2>Relationship</h2>
          <li v-for="relationship in relationships" :key="relationship.id">
            {{ relationship }}
            <button @click="deleteRelationship(relationship).then(() => updateView())">delete</button>
          </li>
        </div>
        <div v-if="animals">
          <h2>Animals</h2>
          <li v-for="animal in animals" :key="animal.id">
            {{ animal }}
            <button @click="deleteAnimal(animal.id).then(() => updateView())">delete</button>
          </li>
        </div>
        <div v-if="species">
          <h2>Species</h2>
          <li v-for="speciesSingular in species" :key="speciesSingular.id">
            {{ speciesSingular }}
            <button @click="deleteSpecies(speciesSingular.id).then(() => updateView())">delete</button>
          </li>
        </div>
        <div v-if="races">
          <h2>Races</h2>
          <li v-for="race in races" :key="race.id">
            {{ race }}
            <button @click="deleteRace(race.id).then(() => updateView())">delete</button>
          </li>
        </div>
        <div v-if="relationshipTypes">
          <h2>Relationship Types</h2>
          <li v-for="relationshipType in relationshipTypes" :key="relationshipType.id">
            {{ relationshipType }}
            <button @click="deleteRelationshipType(relationshipType).then(() => updateView())">delete</button>
          </li>
        </div>
        <create-or-update-person @created="addNewPerson"></create-or-update-person>
        <create-relationship @created="updateView"></create-relationship>
        <create-animal @created="updateView"></create-animal>
        <create-label @created="updateView"></create-label>
    </div>
  </div>
</template>

<script>

import repository from './repository.js'
import CreateOrUpdatePerson from './components/CreateOrUpdatePerson'
import CreateAnimal from './components/CreateAnimal'
import CreateLabel from './components/CreateLabel'
import CreateRelationship from './components/CreateRelationship'
import GraphVisualization from './components/GraphVisualization'

export default {

  name: 'App',
  components: {
    CreateOrUpdatePerson,
    CreateAnimal,
    CreateLabel,
    CreateRelationship,
    GraphVisualization
  },
  mixins: [repository],
  data(){
    return {
      people : [],
      peopleEditTable: {},
      animals: [],
      races: [],
      species: [],
      relationshipTypes: [],
      relationships: []
    }
  },
  mounted() {
    this.getRaces().then(data => this.races = data).catch((err => console.log(err)))
    this.getSpecies().then(data => this.species = data).catch((err => console.log(err)))
    this.getRelationshipTypes().then(data => this.relationshipTypes = data).catch((err => console.log(err)))
    this.getPeople()
      .then(data => {
        this.people = data
        data.forEach(person => {
          this.peopleEditTable[person.id] = { showEdit: false, person }
        })
      })
      .catch((err => console.log(err)))
    this.getAnimals().then(data => this.animals = data).catch((err => console.log(err)))
    this.getRelationship().then(data => this.relationships = data).catch((err => console.log(err)))
  },
  methods: {
    initEditTable(data){
      data.forEach(person => {
        this.peopleEditTable[person.id] = { showEdit: false || (this.peopleEditTable[person.id] && this.peopleEditTable[person.id].showEdit), person }
      })
    },
    addNewPerson(newPerson) {
      this.people = this.people.concat(newPerson)
      this.peopleEditTable[newPerson.id] = { showEdit: false || (this.peopleEditTable[newPerson.id] && this.peopleEditTable[newPerson.id].showEdit), newPerson }
      this.updateView()
    },
    updatePeople(updatedPerson) {
      this.people = this.people.filter(person => person.id !== updatedPerson.id)
      this.people = this.people.concat(updatedPerson)
      this.peopleEditTable[updatedPerson.id].showEdit = false
      this.updateView()
    },
    updateView(){
      this.getRaces().then(data => this.races = data).catch((err => console.log(err)))
      this.getSpecies().then(data => this.species = data).catch((err => console.log(err)))
      this.getRelationshipTypes().then(data => this.relationshipTypes = data).catch((err => console.log(err)))
      this.getPeople().then(data => {
        this.people = data
        this.initEditTable(this.people) 
      }).catch((err => console.log(err)))
      this.getAnimals().then(data => this.animals = data).catch((err => console.log(err)))
      this.getRelationship().then(data => this.relationships = data).catch((err => console.log(err)))
    },
    showEditFragment(id){
      this.peopleEditTable[id].showEdit = true
      this.updateView()
    }
  },
  computed: {
    computedEditTable() {
      return this.peopleEditTable
    },
    computedPeople() {
      return this.people
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
