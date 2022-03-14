<template>
  <div id="app">
    <v-app>
      <v-app-bar app>
        <div v-for="menuItem in Object.values(APP_BAR)" :key="menuItem.ID">
            <v-btn @click="updateApp(menuItem.ID)">{{ menuItem.label }}</v-btn>
        </div>
      </v-app-bar>
      <table id="tree" v-if="APP_BAR.BRANCHES.ID === currentlyOpen">
        <tbody>
          <tr v-for="branch in branches" :key="branch.id">
              <branch :branchData="branch"/>
          </tr>
        </tbody>
      </table>
      <div v-if="APP_BAR.TREE.ID === currentlyOpen">
        <graph-visualization></graph-visualization>
      </div>
      <div class="container">
          <div v-if="APP_BAR.DATA.ID === currentlyOpen">
            <h1>People</h1>
            <li v-for="person in computedPeople" :key="person.id">
              {{ person }}
              <button @click="deletePerson(person.id).then(() => updateView())">delete</button>
              <button @click="hardDeletePerson(person.id).then(() => updateView())">hard-delete</button>
              <button @click="showEditFragment(person.id)">edit</button>
              <create-or-update-person v-if="computedEditTable[person.id].showEdit" @created="updatePeople" :person="computedEditTable[person.id].person"></create-or-update-person>
              <br>
            </li>
            <h2>Relationship</h2>
            <li v-for="relationship in relationships" :key="relationship.id">
              {{ relationship }}
              <button @click="deleteRelationship(relationship).then(() => updateView())">delete</button>
            </li>
            <h2>Animals</h2>
            <li v-for="animal in animals" :key="animal.id">
              {{ animal }}
              <button @click="deleteAnimal(animal.id).then(() => updateView())">delete</button>
            </li>
            <h2>Species</h2>
            <li v-for="speciesSingular in species" :key="speciesSingular.id">
              {{ speciesSingular }}
              <button @click="deleteSpecies(speciesSingular.id).then(() => updateView())">delete</button>
            </li>
            <h2>Races</h2>
            <li v-for="race in races" :key="race.id">
              {{ race }}
              <button @click="deleteRace(race.id).then(() => updateView())">delete</button>
            </li>
            <h2>Relationship Types</h2>
            <li v-for="relationshipType in relationshipTypes" :key="relationshipType.label">
              {{ relationshipType }}
              <button @click="deleteRelationshipType(relationshipType).then(() => updateView())">delete</button>
            </li>
          </div>
          <div v-if="APP_BAR.FORMS.ID === currentlyOpen">
            <v-expansion-panels>
              <v-expansion-panel
                v-for="(form,i) in Object.values(FORMS)"
                :key="i"
              >
                <div v-if="form.ID === FORMS.CREATE_PERSON.ID">
                  <v-expansion-panel-header>
                  {{ form.NAME }}
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <create-or-update-person :head="form.NAME" @created="addNewPerson"></create-or-update-person>
                  </v-expansion-panel-content>
                </div>
                <div v-if="form.ID === FORMS.CREATE_RELATIONSHIP.ID">
                  <v-expansion-panel-header>
                  {{ form.NAME }}
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <create-relationship :head="form.NAME" @created="updateView"></create-relationship>
                  </v-expansion-panel-content>
                </div>
                <div v-if="form.ID === FORMS.CREATE_ANIMAL.ID">
                  <v-expansion-panel-header>
                  {{ form.NAME }}
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <create-animal :head="form.NAME" @created="updateView"></create-animal>
                  </v-expansion-panel-content>
                </div>
                <div v-if="form.ID === FORMS.CREATE_LABEL.ID">
                  <v-expansion-panel-header>
                  {{ form.NAME }}
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <create-label :head="form.NAME" @created="updateView"></create-label>
                  </v-expansion-panel-content>
                </div>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
      </div>
    </v-app>
  </div>
</template>

<script>

import repository from './repository.js'
import branches from './branches.js'
import CreateOrUpdatePerson from './components/CreateOrUpdatePerson'
import CreateAnimal from './components/CreateAnimal'
import CreateLabel from './components/CreateLabel'
import CreateRelationship from './components/CreateRelationship'
import GraphVisualization from './components/GraphVisualization'
import enums from './enums.js'
import Branch from './components/Branch'

export default {

  name: 'App',
  components: {
    CreateOrUpdatePerson,
    CreateAnimal,
    CreateLabel,
    CreateRelationship,
    GraphVisualization,
    Branch
  },
  mixins: [repository, enums, branches],
  data(){
    return {
      branches: [],
      people : [],
      peopleEditTable: {},
      animals: [],
      races: [],
      species: [],
      relationshipTypes: [],
      relationships: [],
      currentlyOpen: 0
    }
  },
  mounted() {
    this.getBranches().then(data => {
        let branchesWithPath = this.branchesWithPath(data.branches.sort((b1, b2) => b2.l - b1.l))
        let branchesWithYPosition = this.branchesWithYPosition(branchesWithPath)
        this.branches = branchesWithYPosition
      })
    this.getRaces().then(data => this.races = data).catch((err => console.log(err)))
    this.getSpecies().then(data => this.species = data).catch((err => console.log(err)))
    this.getRelationshipTypes().then(data => { this.relationshipTypes = data }).catch((err => console.log(err)))
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
    },
    updateApp(data){
      this.currentlyOpen = data
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
