<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <div class="container">
        <div v-if="people">
          <h2>People</h2>
          <li v-for="person in people" :key="person">
            {{ person }}
          </li>
        </div>
        <div v-if="animals">
          <h2>Animals</h2>
          <li v-for="animal in animals" :key="animal">
            {{ animal }}
          </li>
        </div>
        <div v-if="species">
          <h2>Species</h2>
          <li v-for="speciesSingular in species" :key="speciesSingular">
            {{ speciesSingular }}
          </li>
        </div>
        <div v-if="races">
          <h2>Races</h2>
          <li v-for="race in races" :key="race">
            {{ race }}
          </li>
        </div>
        <div v-if="relationships">
          <h2>Relationships</h2>
          <li v-for="relationship in relationships" :key="relationship">
            {{ relationship }}
          </li>
        </div>
        <create-person></create-person>
        <create-animal></create-animal>
        <create-label></create-label>
    </div>
  </div>
</template>

<script>

import { getPeople } from './repository'
import { getAnimals } from './repository'
import { getRelationships } from './repository'
import { getRaces } from './repository'
import { getSpecies } from './repository'
import CreatePerson from './components/CreatePerson'
import CreateAnimal from './components/CreateAnimal'
import CreateLabel from './components/CreateLabel'
export default {

  name: 'App',
  components: {
    CreatePerson,
    CreateAnimal,
    CreateLabel
  },
  data(){
    return {
      people : [],
      animals: [],
      races: [],
      species: [],
      relationships: []
    }
  },
  mounted() {
    getRaces().then(data => this.races = data).catch((err => console.log(err)))
    getSpecies().then(data => this.species = data).catch((err => console.log(err)))
    getRelationships().then(data => this.relationships = data).catch((err => console.log(err)))
    getPeople().then(data => this.people = data).catch((err => console.log(err)))
    getAnimals().then(data => this.animals = data).catch((err => console.log(err)))
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
