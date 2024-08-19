<template>
  <v-card>
    <v-card-title>
      <h1>People</h1>
    </v-card-title>
    <v-card-text>
      <v-table>
        <thead>
          <tr>
            <th
              v-for="header in headers"
              :key="header.value"
            >
              {{ header.text }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="person in people"
            :key="person.id"
          >
            <td>{{ person.id }}</td>
            <td>{{ person.forname }}</td>
            <td>{{ person.surname }}</td>
            <td>{{ person.isalive }}</td>
            <td>{{ person.gender }}</td>
            <td>
              <img :id="`person-image-${person.id}`" :src="`${BASE_URL}/api/person/get-image/${person.id}`" alt="">
            </td>
            <td>
              <v-icon
                class="mr-2"
                @click="showEditFragment(person.id)"
              >
                mdi-pencil
              </v-icon>
              <v-icon
                @click="deletePerson(person.id).then(() => updateView())"
              >
                mdi-delete
              </v-icon>
              <v-icon
                class="mr-2"
                @click="hardDeletePerson(person.id).then(() => updateView())"
              >
                mdi-delete-alert
              </v-icon>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
    <create-or-update-person
      v-if="computedEditTable[editItemId] && computedEditTable[editItemId].showEdit"
      :person="computedEditTable[editItemId].person"
      @create="updatePeople"
    />
  </v-card>
</template>

<script>

import repository from '../../repository.js'
import CreateOrUpdatePerson from './CreateOrUpdatePerson.vue'

export default {
  name: 'PeopleTable',
  components: {
    CreateOrUpdatePerson
  },
  mixins: [repository],
  data() {
    return {
      headers: [
        {text: 'Id', value: 'id'},
        {text: 'Forname', value: 'forname'},
        {text: 'Surname', value: 'surname'},
        {text: 'IsAlive', value: 'isalive'},
        {text: 'Gender', value: 'gender'},
        {text: 'Image', value: 'imageurl'},
        {text: 'Actions', value: 'actions'}
      ],
      people: [],
      peopleEditTable: [],
      editItemId: 0
    }
  },
  computed: {
    computedEditTable() {
      return this.peopleEditTable
    }
  },
  mounted() {
    this.getPeople().then(data => {
      this.people = data
      data.forEach(person => {
        this.peopleEditTable[person.id] = {showEdit: false, person}
      })
    }).catch((err => console.log(err)))
  },
  methods: {
    updateView() {
      this.getPeople().then(data => {
        this.people = data
        this.initEditTable(this.people)
      }).catch((err => console.log(err)))
    },
    initEditTable(data) {
      data.forEach(person => {
        this.peopleEditTable[person.id] = {
          showEdit: (this.peopleEditTable[person.id] && this.peopleEditTable[person.id].showEdit),
          person
        }
      })
    },
    showEditFragment(id) {
      this.editItemId = id
      this.peopleEditTable[id].showEdit = true
      this.updateView()
    },
    updatePeople(updatedPerson) {
      this.people = this.people.filter(person => person.id !== updatedPerson.id)
      this.people = this.people.concat(updatedPerson)
      this.peopleEditTable[updatedPerson.id].showEdit = false
      this.updateView()
    }
  }
}
</script>