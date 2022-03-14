<template>
	<v-card>
		<v-card-title>
			<h1>Animals</h1>
		</v-card-title>
		<v-card-text>
			<v-data-table 
				:headers="headers"
				:items="computedAnimals"
				:items-per-page="5"
				class="elevation-1"
			>
				<template v-slot:item.actions="{ item }">
					<v-icon
						@click="deleteAnimal(item.id).then(() => updateView())">
					>
						mdi-delete
					</v-icon>
				</template>
			</v-data-table>
		</v-card-text>
	</v-card>
</template>

<script>

import repository from '../repository.js'

export default {
	name: 'Relationships',
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