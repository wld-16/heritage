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
        <input v-model="race" id="race" type="number" value="1">
        <label for="race">Race</label>
        <input v-model="species" id="species" type="number" value="1">
        <label for="species">Species</label>
      </div>
      <button @click="create" class="button" type="submit">Post</button>
    </section>
  </div>
</template>

<script>

import { createAnimal } from '../repository'

export default {
  name: 'create-animal',
  data(){
    return {
      name: '',
      isAlive: false,
      species: 0,
      sex: 'female',
      race: 0,
    }
  },
  methods: {
    create(){
      let data = { name: this.name, isAlive: this.isAlive, sex: this.sex, race: this.race, species: this.species }
      createAnimal(data).then(data => {
        this.$emit('createAnimal', data.person);
      }). catch(err => console(err.message));
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>