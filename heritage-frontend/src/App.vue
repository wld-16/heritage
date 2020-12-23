<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <graph-visualization></graph-visualization>
    <div class="container">
        <div v-if="people">
          <h2>People</h2>
          <li v-for="person in people" :key="person.id">
            {{ person }}
          </li>
        </div>
        <div v-if="relationships">
          <h2>Relationship</h2>
          <li v-for="relationship in relationships" :key="relationship.id">
            {{ relationship }}
          </li>
        </div>
        <div v-if="animals">
          <h2>Animals</h2>
          <li v-for="animal in animals" :key="animal.id">
            {{ animal }}
          </li>
        </div>
        <div v-if="species">
          <h2>Species</h2>
          <li v-for="speciesSingular in species" :key="speciesSingular.id">
            {{ speciesSingular }}
          </li>
        </div>
        <div v-if="races">
          <h2>Races</h2>
          <li v-for="race in races" :key="race">
            {{ race }}
          </li>
        </div>
        <div v-if="relationshipTypes">
          <h2>Relationship Types</h2>
          <li v-for="relationshipType in relationshipTypes" :key="relationshipType.id">
            {{ relationshipType }}
          </li>
        </div>
        <create-person></create-person>
        <create-relationship></create-relationship>
        <create-animal></create-animal>
        <create-label></create-label>
    </div>
  </div>
</template>

<script>

import { getPeople } from './repository'
import { getAnimals } from './repository'
import { getRelationship } from './repository'
import { getRelationshipTypes } from './repository'
import { getRaces } from './repository'
import { getSpecies } from './repository'
import CreatePerson from './components/CreatePerson'
import CreateAnimal from './components/CreateAnimal'
import CreateLabel from './components/CreateLabel'
import CreateRelationship from './components/CreateRelationship'
import GraphVisualization from './components/GraphVisualization'

export default {

  name: 'App',
  components: {
    CreatePerson,
    CreateAnimal,
    CreateLabel,
    CreateRelationship,
    GraphVisualization
  },
  data(){
    return {
      people : [],
      animals: [],
      races: [],
      species: [],
      relationshipTypes: [],
      relationships: []
    }
  },
  mounted() {
    getRaces().then(data => this.races = data).catch((err => console.log(err)))
    getSpecies().then(data => this.species = data).catch((err => console.log(err)))
    getRelationshipTypes().then(data => this.relationshipTypes = data).catch((err => console.log(err)))
    getPeople().then(data => this.people = data).catch((err => console.log(err)))
    getAnimals().then(data => this.animals = data).catch((err => console.log(err)))
    getRelationship().then(data => this.relationships = data).catch((err => console.log(err)))
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
