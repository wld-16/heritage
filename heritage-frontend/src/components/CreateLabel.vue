<template>
  <div>
   <section>
      <h1>Create a Label</h1>
      <div>
        <label for="label">Label:</label>
        <input v-model="label" type="text" placeholder="" id="label">
      </div>
      <div>
        <label for="type">Type:</label>
        <input v-model="type" type="radio" value="relationship" id="type-relationship">
          <label for="type-relationship">Relationship</label>
          <input v-model="type" type="radio" value="species" id="type-species">
          <label for="type-species">Species</label>
          <input v-model="type" type="radio" value="race" id="type-race">
          <label for="type-race">Race</label>
      </div>
      <button @click="create" class="button" type="submit">Post</button>
    </section>
  </div>
</template>

<script>

import { createRelationship } from '../repository'
import { createRace } from '../repository'
import { createSpecies } from '../repository'

export default {
  name: 'create-label',
  data(){
    return {
      type: 'relationship',
      label: ''
    }
  },
  methods: {
    create(){
      let data = { label: this.label}
      switch (this.type){
        case 'relationship': 
          console.log("create relationship")
          createRelationship(data).then(data => { this.$emit('createRelationship', data.label); }).catch(err => console(err.message));
          break;
        case 'race': 
          console.log("create race")
          createRace(data).then(data => { this.$emit('createRace', data.label); }).catch(err => console(err.message));
          break;
        case 'species': 
          console.log("create species")
          createSpecies(data).then(data => { this.$emit('createSpecies', data.label); }).catch(err => console(err.message));
          break;
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>