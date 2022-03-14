<template>
	<v-card>
		<v-card-title>
			<h1>Species</h1>
		</v-card-title>
		<v-card-text>
			<v-data-table 
				:headers="headers"
				:items="computedSpecies"
				:items-per-page="5"
				class="elevation-1"
			>
				<template v-slot:item.actions="{ item }">
					<v-icon
						@click="deleteSpecies(item.id).then(() => updateView())">
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
	name: 'Species',
	mixins: [ repository ],
	data () {
		return {
			headers: [
				{ text: 'Id', value: 'id' },
				{ text: 'Label', value: 'label' },
				{ text: 'Actions', value: 'actions'}
			],
			species: []
		}
	},
	methods: {
		updateView() {
			this.getSpecies().then(data => this.species = data).catch((err => console.log(err)))
		}
	},
	computed:{
		computedSpecies() {
			return this.species.map(specie => {
				specie.actions = 1
				return specie
			})
		}
	},
	mounted() {
		this.getSpecies().then(data => this.species = data).catch((err => console.log(err)))
	}
}
</script>