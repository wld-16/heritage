<template>
  <div>
   <section>
      <h1>Create an Animal</h1>
      <div>
        <input v-model="name" type="text" placeholder="kujo">
      </div>
      <div>
        <label for="isAlive">isAlive:</label>
        <input v-model="isAlive" id="isAlive" type="checkbox" value="true">
      </div>
      <div>
        <label for="sex">sex:</label>
        <span id="sex">
          <input v-model="sex" type="radio" value="male" id="sex-male">
          <label for="gender-male">Male</label>
          <input v-model="sex" type="radio" value="female" id="sex-female">
          <label for="sex-female">Female</label>
        </span>
      </div>
      <div>
        <label for="race">Race:</label>
        <select v-model="race">
          <option :key="raceObject.id" :value="raceObject.id" v-for="raceObject in allRaces">{{ raceObject.label }}</option>
        </select>
        <label for="species">Species</label>
        <select v-model="species">
          <option :key="speciesObject.id" :value="speciesObject.id" v-for="speciesObject in allSpecies">{{ speciesObject.label }}</option>
        </select>
      </div>
      <button @click="create" class="button" type="submit">Post</button>
    </section>
  </div>
</template>

<script>

import { createAnimal } from '../repository'
import { getRaces } from '../repository'
import { getSpecies } from '../repository'

export default {
  name: 'create-animal',
  data(){
    return {
      name: '',
      isAlive: false,
      species: 0,
      sex: 'female',
      race: 0,
      allRaces : [],
      allSpecies: []
    }
  },
  methods: {
    create(){
      let data = { name: this.name, isAlive: this.isAlive, sex: this.sex, race: this.race, species: this.species }
      createAnimal(data).then(data => {
        this.$emit('createAnimal', data.person);
      }). catch(err => console(err.message));
    }
  },
  mounted(){
    getRaces().then(data => this.allRaces = data)
    getSpecies().then(data => this.allSpecies = data)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>