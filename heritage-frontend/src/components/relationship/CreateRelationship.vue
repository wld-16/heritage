<template>
  <div>
    <section>
      <h1>{{ head }}</h1>
      <div>
        <v-select
          :items="people"
          label="From"
          item-title="forname"
          item-value="id"
          v-model="person_1"
        ></v-select>
        <v-select
          :items="people"
          item-title="forname"
          item-value="id"
          v-model="person_2"
          label="To"
        ></v-select>
        <v-autocomplete 
          v-model="relationship" 
          :items="relationships"
          item-title="label"
          item-value="id"
          :loading="isLoading"
          label="Relationship">
        </v-autocomplete>
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

import repository from '../../repository'

export default {
  name: 'create-person',
  mixins: [ repository ],
  data(){
    return {
      person_1: 0,
      person_2: 0,
      relationship: 0,
      allPeople: [],
      allRelationships : [],
      isLoading: false
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
        this.$emit("create")
        this.forname = this.surname = this.gender = '';
      }).catch(err => console.log(err.message));
    }
  },
  mounted() {
        // Items have already been requested
      if (this.isLoading) return

      this.isLoading = true

    this.getPeople().then(data => {
      this.allPeople = data.map(person => {
        person.fullname = person.forname + ' ' + person.surname
        return person
      })
    })

    this.getRelationshipTypes().then(data => {
      this.allRelationships = data
      this.isLoading = false
    })
  },
  computed: {
    people() {
      return this.allPeople
    },
    relationships() {
      return JSON.parse(JSON.stringify(this.allRelationships))
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>