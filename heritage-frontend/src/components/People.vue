<template>
	<v-card>
		<v-card-title>
			<h1>People</h1>
		</v-card-title>
		<v-card-text>
			<v-data-table 
				:headers="headers"
				:items="computedPeople"
				:items-per-page="5"
				class="elevation-1"
			>
				<template v-slot:item.actions="{ item }">
					{{ item.id }}
					<v-icon
						class="mr-2"
						@click="showEditFragment(item.id)"
					>
						mdi-pencil
					</v-icon>
					<v-icon
						@click="deletePerson(item.id).then(() => updateView())"
					>
						mdi-delete
					</v-icon>
					<v-icon
						class="mr-2"
						@click="hardDeletePerson(item.id).then(() => updateView())"
					>
						mdi-delete-alert
					</v-icon>
				</template>
			</v-data-table>
		</v-card-text>
		<create-or-update-person v-if="computedEditTable[editItemId] && computedEditTable[editItemId].showEdit" @created="updatePeople" :person="computedEditTable[editItemId].person"/>
	</v-card>
</template>

<script>

import repository from '../repository.js'
import CreateOrUpdatePerson from './CreateOrUpdatePerson'

export default {
	name: 'People',
	components: {
		CreateOrUpdatePerson
	},
	mixins: [ repository ],
	data () {
		return {
			headers: [
				{ text: 'Id', value: 'id' },
				{ text: 'Forname', value: 'forname' },
				{ text: 'Surname', value: 'surname' },
				{ text: 'IsAlive', value: 'isalive'},
				{ text: 'Gender', value: 'gender'},
				{ text: 'Actions', value: 'actions'}
			],
			people: [],
			peopleEditTable: [],
			editItemId: 0
		}
	},
	methods: {
		updateView() {
			this.getPeople().then(data => {
				this.people = data
				this.initEditTable(this.people) 
			}).catch((err => console.log(err)))
		},
		initEditTable(data){
			data.forEach(person => {
				this.peopleEditTable[person.id] = { showEdit: false || (this.peopleEditTable[person.id] && this.peopleEditTable[person.id].showEdit), person }
			})
		},
		showEditFragment(id){
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
	},
	computed: {
		computedPeople() {
			return this.people.map(person => {
				person.actions = 1
				return person
			})
		},
		computedEditTable() {
			return this.peopleEditTable
		}
	},
	mounted() {
		this.getPeople().then(data => {
			this.people = data
			data.forEach(person => {
				this.peopleEditTable[person.id] = { showEdit: false, person }
			})
		}).catch((err => console.log(err)))
	}
}
</script>