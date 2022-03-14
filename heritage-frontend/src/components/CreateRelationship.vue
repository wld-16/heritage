<template>
  <div>
    <section>
      <h1>{{ head }}</h1>
      <div>
        <v-select
          :items="allPeople"
          label="From"
          v-model="person_1"
          item-text="fullname"
          item-value="id"
        ></v-select>
        <v-select
          :items="allPeople"
          v-model="person_2"
          item-text="fullname"
          item-value="id"
          label="To"
        ></v-select>
        <v-select 
          v-model="relationship" 
          :items="allRelationships" 
          item-text="label" 
          item-value="id"
          label="Relationship">
        </v-select>
      </div>
      <v-btn
       @click="create" 
       color="success"
       class="mr-4">
     Save</v-btn>
    </section>
  </div>
</template>

<script>

import repository from '../repository'

export default {
  name: 'create-person',
  mixins: [ repository ],
  data(){
    return {
      person_1: 0,
      person_2: 0,
      relationship: 0,
      allPeople: [],
      allRelationships : []
    }
  },
  props: {
    head: {
      type: String,
      default: 'Create a Relationship Between two people'
    }
  },
  methods: {
    create(){
      let data = { person_1_id: this.person_1, person_2_id: this.person_2, relationship_id: this.relationship }
      this.createRelationship(data).then(() => {
        this.$emit('created');
        this.forname = this.surname = this.gender = '';
      }).catch(err => console.log(err.message));
    }
  },
  mounted() {
    this.getPeople().then(data => this.allPeople = data.map(person => {
      person.fullname = person.forname + ' ' + person.surname
      return person
    }))
    this.getRelationshipTypes().then(data => this.allRelationships = data)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>