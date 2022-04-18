<template>
	<v-card>
		<v-card-title>
			<h1>Species</h1>
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
				<tr v-for="specie in species" :key="specie.id">
					<td>{{ specie.id }}</td>
					<td>{{ specie.label }}</td>
					<td>
						<v-icon
						@click="deleteSpecies(item.id).then(() => updateView())">
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
	name: 'SpeciesTable',
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