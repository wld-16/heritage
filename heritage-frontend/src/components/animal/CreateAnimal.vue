<template>
  <div>
    <v-form v-model="valid" lazy-validation ref="form">
      <h1>{{ head }}</h1>
      <div>
        <v-text-field v-model="name" :rules="nameRules" label="name" :counter="10" required></v-text-field>
      </div>
      <v-checkbox
            v-model="isAlive"
            label="isAlive"
      ></v-checkbox>
      <v-radio-group v-model="sex">
          <v-radio
            :label="'Female'"
            :value="'female'"
          ></v-radio>
          <v-radio
            :label="'Male'"
            :value="'male'"
          ></v-radio>
      </v-radio-group>
      <v-select 
          v-model="race" 
          :items="allRaces"
          item-title="label"
          item-value="id"
          label="Race">
      </v-select>
      <v-select 
          v-model="species" 
          :items="allSpecies" 
          item-title="label"
          item-value="id"
          label="Species">
      </v-select>
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

import repository from '../../repository'

export default {
  name: 'create-animal',
  mixins: [ repository ],
  data(){
    return {
      name: '',
      isAlive: false,
      species: 0,
      sex: 'female',
      race: 0,
      valid: false,
      allRaces : [],
      allSpecies: [],
      nameRules: [
        v => !!v || 'Name is required',
        v => v && v.length <= 10 || 'Name must be less than 10 characters',
      ]
    }
  },
  props: {
    head: {
      type: String,
      default: 'Create an Animal'
    }
  },
  methods: {
    validate () {
      if(this.$refs.form.validate()) {
        this.create()
        this.$emit("create")
      }
    },
    create(){
      let data = { name: this.name, isAlive: this.isAlive, sex: this.sex, race: this.race, species: this.species }
      this.createAnimal(data).then(() => {
        this.$emit('createAnimal');
      }). catch(err => console(err.message));
    }
  },
  mounted(){
    this.getRaces().then(data => this.allRaces = data)
    this.getSpecies().then(data => this.allSpecies = data)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>