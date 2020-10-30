<template>
  <div>
    <section>
      <h1>Create a Person</h1>
      <div>
        <input v-model="forname" type="text" placeholder="max">
        <input v-model="surname" type="text" placeholder="muster">
      </div>
      <div>
        <input v-model="birthdate" type="date" placeholder="1999-11-11">
        <label for="isAlive">isAlive:</label>
        <input v-model="isAlive" id="isAlive" type="checkbox" value="true">
      </div>
      <div>
        <label for="gender">gender:</label>
        <span id="gender">
          <input v-model="gender" type="radio" value="male" id="gender-male">
          <label for="gender-male">Male</label>
          <input v-model="gender" type="radio" value="female" id="gender-female">
          <label for="gender-female">Female</label>
          <input v-model="gender" type="radio" value="divergent" id="gender-divergent">
          <label for="gender-divergent">Divergent</label>
        </span>
      </div>
      <button @click="create" class="button" type="submit">Post</button>
    </section>
  </div>
</template>

<script>

import { createPerson } from '../repository'

export default {
  name: 'create-person',
  data(){
    return {
      forname: '',
      surname: '',
      birthdate: '1999-12-31',
      isAlive: false,
      gender: 'divergent'
    }
  },
  methods: {
    create(){
      let data = { forname: this.forname, surname: this.surname, birthdate: this.birthdate, isAlive: this.isAlive, gender: this.gender }
      createPerson(data).then(data => {
        this.$emit('createPerson', data.person);
        this.forname = this.surname = this.gender = '';
      }). catch(err => console.log(err.message));
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>