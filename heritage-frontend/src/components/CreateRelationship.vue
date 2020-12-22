<template>
  <div>
    <section>
      <h3>Create a Relationship Between two people</h3>
      <div>
        <label for="person_1">Person One:</label>
        <select v-model="person_1">
          <option :key="personObject.id" :value="personObject.id" v-for="personObject in allPeople">{{ personObject.forname }} {{ personObject.surname}}</option>
        </select>
      </div>
      <div>
        <label for="person_2">Person Two</label>
        <select v-model="person_2">
          <option :key="personObject.id" :value="personObject.id" v-for="personObject in allPeople">{{ personObject.forname }} {{ personObject.surname}}</option>
        </select>
      </div>
      <div>
        <label for="relationship">Relationship</label>
        <select v-model="relationship">
          <option :key="relationshipObject.id" :value="relationshipObject.id" v-for="relationshipObject in allRelationships">{{ relationshipObject.label }}</option>
        </select>
      </div>
      <button @click="create" class="button" type="submit">Post</button>
    </section>
  </div>
</template>

<script>

import { createRelationship } from '../repository'
import { getRelationshipTypes } from '../repository'
import { getPeople } from '../repository'

export default {
  name: 'create-person',
  data(){
    return {
      person_1: 0,
      person_2: 0,
      relationship: 0,
      allPeople: [],
      allRelationships : []
    }
  },
  methods: {
    create(){
      let data = { person_1_id: this.person_1, person_2_id: this.person_2, relationship_id: this.relationship }
      createRelationship(data).then(data => {
        this.$emit('createRelationship', data.person);
        this.forname = this.surname = this.gender = '';
      }).catch(err => console.log(err.message));
    }
  },
  mounted() {
    getPeople().then(data => this.allPeople = data)
    getRelationshipTypes().then(data => this.allRelationships = data)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>