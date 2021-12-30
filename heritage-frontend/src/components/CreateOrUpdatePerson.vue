<template>
  <div>
    <section>
      <h1>Create a Person</h1>
      <div>
        <input v-model="person.forname" type="text" placeholder="max">
        <input v-model="person.surname" type="text" placeholder="muster">
      </div>
      <div>
        <input v-model="person.birthdate" type="date" placeholder="1999-11-11">
        <label for="isAlive">isAlive:</label>
        <input v-model="person.isAlive" id="isAlive" type="checkbox" value="true">
      </div>
      <div>
        <label for="gender">gender:</label>
        <span id="gender">
          <input v-model="person.gender" type="radio" value="male" id="gender-male">
          <label for="gender-male">Male</label>
          <input v-model="person.gender" type="radio" value="female" id="gender-female">
          <label for="gender-female">Female</label>
          <input v-model="person.gender" type="radio" value="divergent" id="gender-divergent">
          <label for="gender-divergent">Divergent</label>
        </span>
      </div>
      <button @click="create" class="button" type="submit">Post</button>
    </section>
  </div>
</template>

<script>

import repository from '../repository'

export default {
  name: 'create-or-update-person',
  mixins: [ repository ],
  props: {
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
    create(){
      let data = { id: this.person.id, forname: this.person.forname, surname: this.person.surname, birthdate: this.person.birthdate, isAlive: this.person.isAlive, gender: this.person.gender }
      this.createPerson(data).then(response => {
        this.forname = this.surname = this.gender = '';
        this.$emit('created', response.rows[0])
      }).catch(err => console.log(err.message));
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>