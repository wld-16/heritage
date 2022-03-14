<template>
  <div>
    <v-form v-model="valid" lazy-validation ref="form">
      <h1>{{ head }}</h1>
      <div>
        <v-text-field v-model="label" :rules="labelRules" label="label" :counter="10" required></v-text-field>
      </div>
      <v-radio-group v-model="type">
        <v-radio
          :label="'Relationship'"
          :value="'relationship'"
        >
        </v-radio>
        <v-radio
          :label="'Species'"
          :value="'species'"
        ></v-radio>
        <v-radio
          :label="'Race'"
          :value="'race'"
        ></v-radio>
      </v-radio-group>
      <div v-if="isRelationshipType">
        <label for="oppositeLabel">Opposite Label:</label>
        <v-text-field v-model="opposite_label" :rules="oppLabelRules" label="opposite_label" :counter="10" required></v-text-field>
      </div>
      <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="validate"
        >
          Save
        </v-btn>
    </v-form>
  </div>
</template>

<script>

import repository from '../repository'

export default {
  name: 'create-label',
  mixins: [ repository ],
  data(){
    return {
      type: 'relationship',
      label: '',
      opposite_label: '',
      labelRules: [
        v => !!v || 'Label is required',
        v => v && v.length <= 10 || 'Label must be less than 10 characters',
      ],
      oppLabelRules: [
        v => !!v || 'Label is required',
        v => v && v.length <= 10 || 'Label must be less than 10 characters',
      ]
    }
  },
  props: {
    head: {
      type: String,
      default: 'Create a label'
    }
  },
  computed: {
    isRelationshipType(){
      console.log(this.type)
      return this.type === "relationship"
    }
  },
  methods: {
    validate() {
      console.log(this.$refs.form.validate())
      if(this.$refs.form.validate()) {
        this.create()   
      }
    },
    create(){
      let data = { label: this.label, opposite_label: this.opposite_label }
      switch (this.type){
        case 'relationship': 
          this.createRelationshipType(data).then(() => { this.$emit('created'); }).catch(err => console(err.message));
          break;
        case 'race': 
          this.createRace(data).then(() => { this.$emit('created'); }).catch(err => console(err.message));
          break;
        case 'species': 
          this.createSpecies(data).then(() => { this.$emit('created'); }).catch(err => console(err.message));
          break;
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>