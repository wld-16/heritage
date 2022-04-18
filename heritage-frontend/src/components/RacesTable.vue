<template>
	<v-card>
		<v-card-title>
			<h1>Races</h1>
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
				<tr v-for="race in races" :key="race.id">
					<td>{{ race.id }}</td>
					<td>{{ race.label }}</td>
					<td>
						<v-icon
						@click="deleteRace(race.id).then(() => updateView())">
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
	name: 'RacesTable',
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