<template>
	<v-card>
		<v-card-title>
			<h1>Animals</h1>
		</v-card-title>
		<v-card-text>
			<v-table>
			<thead>
				<tr>
					<th v-for="header in headers" :key="header.value">
						{{ header.text }}
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="animal in animals" :key="animal.id">
					<td>{{ animal.id }}</td>
					<td>{{ animal.name }}</td>
					<td>{{ animal.isalive }}</td>
					<td>{{ animal.sex }}</td>
					<td>{{ animal.species_id }}</td>
					<td>{{ animal.race_id }}</td>
					<td>
						<v-icon
						@click="deleteAnimal(item.id).then(() => updateView())">
					>
						mdi-delete
					</v-icon>
					</td>
				</tr>
			</tbody>
			</v-table>
		</v-card-text>
	</v-card>
</template>

<script>

import repository from '../repository.js'

export default {
	name: 'AnimalsTable',
	mixins: [ repository ],
	data () {
		return {
			headers: [
				{ text: 'Id', value: 'id' },
				{ text: 'Name', value: 'name' },
				{ text: 'Is Alive', value: 'isalive' },
				{ text: 'Sex', value: 'sex'},
				{ text: 'Species Id', value: 'species_id'},
				{ text: 'Race Id', value: 'race_id'},
				{ text: 'Actions', value: 'actions'}
			],
			animals: []
		}
	},
	methods: {
		updateView() {
			this.getAnimals().then(data => this.animals = data).catch((err => console.log(err)))
		}
	},
	computed:{
		computedAnimals() {
			return this.animals.map(animal => {
				animal.actions = 1
				return animal
			})
		}
	},
	mounted() {
		this.getAnimals().then(data => this.animals = data).catch((err => console.log(err)))
	}
}
</script>