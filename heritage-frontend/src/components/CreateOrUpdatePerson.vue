<template>
  <div>
    <section>
      <v-form v-model="valid" lazy-validation ref="form">
        <h1>{{ head }}</h1>
          <v-text-field v-model="person.forname" :rules="nameRules" label="forname" :counter="10" required></v-text-field>
          <v-text-field v-model="person.lastname" :rules="nameRules" label="lastname" :counter="10" required></v-text-field>
        <div>
          <v-checkbox
            v-model="person.isAlive"
            label="isAlive"
          ></v-checkbox>
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="person.birthdate"
                label="Birthday date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="person.birthdate"
              :active-picker.sync="activePicker"
              :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
              min="1950-01-01"
            ></v-date-picker>
          </v-menu>
 
          <v-radio-group v-model="person.gender">
            <v-radio
              :label="'Female'"
              :value="'female'"
            ></v-radio>
            <v-radio
              :label="'Male'"
              :value="'male'"
            ></v-radio>
            <v-radio
              :label="'Divergent'"
              :value="'divergent'"
            ></v-radio>
          </v-radio-group>
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
    </section>
  </div>
</template>

<script>

import repository from '../repository'

export default {
  name: 'create-or-update-person',
  mixins: [ repository ],
  data() {
    return {
      valid: true,
      nameRules: [
        v => !!v || 'Name is required',
        v => v && v.length <= 10 || 'Name must be less than 10 characters',
      ],
      menu: false,
      activePicker: null
    }
  },
  props: {
    head: {
      type: String,
      default: 'Create a person'
    },
    person: {
      type: Object,
      default() {
        return {
          id: 0,
          forname: '',
          surname: '',
          birthdate: '1999-12-31', 
          isAlive: false,
          gender: 'divergent'
        }
      }
    }
  },
  methods: {
    create() {
      let data = { id: this.person.id, forname: this.person.forname, surname: this.person.surname, birthdate: this.person.birthdate, isAlive: this.person.isAlive, gender: this.person.gender }
      this.createPerson(data).then(response => {
        this.forname = this.surname = this.gender = '';
        this.$emit('created', response.rows[0])
      }).catch(err => console.log(err.message));
    },
    validate () {
      if(this.$refs.form.validate()) {
        this.create()   
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>