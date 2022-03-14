<template>
	<v-card>
		<v-card-title>
			<h1>Races</h1>
		</v-card-title>
		<v-card-text>
			<v-data-table 
				:headers="headers"
				:items="computedRaces"
				:items-per-page="5"
				class="elevation-1"
			>
				<template v-slot:item.actions="{ item }">
					<v-icon
						@click="deleteRace(item.id).then(() => updateView())">
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
	name: 'Races',
	mixins: [ repository ],
	data () {
		return {
			headers: [
				{ text: 'Id', value: 'id' },
				{ text: 'Label', value: 'label' },
				{ text: 'Actions', value: 'actions'}
			],
		races: []
		}
	},
	methods: {
		updateView() {
			this.getRaces().then(data => this.races = data).catch((err => console.log(err)))
		}
	},
	computed:{
		computedRaces() {
			return this.races.map(race => {
				race.actions = 1
				return race
			})
		}
	},
	mounted() {
		this.getRaces().then(data => this.races = data).catch((err => console.log(err)))
	}
}
</script>