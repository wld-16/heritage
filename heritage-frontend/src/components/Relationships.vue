<template>
	<v-card>
		<v-card-title>
			<h1>Relationship Types</h1>
		</v-card-title>
		<v-card-text>
			<v-data-table 
				:headers="headers"
				:items="tableRelationships"
				:items-per-page="5"
				class="elevation-1"
			>
				<template v-slot:item.actions="{ item }">
					<v-icon
						@click="deleteRelationship(item).then(() => updateView())"
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
				{ text: 'From', value: 'person_from_id' },
				{ text: 'To', value: 'person_to_id' },
				{ text: 'Relationship', value: 'relationship_id'},
				{ text: 'Actions', value: 'actions'}
			],
			relationships: []
		}
	},
	methods: {
		updateView() {
			this.getRelationship().then(data => this.relationships = data).catch((err => console.log(err)))
		}
	},
	computed:{
		tableRelationships() {
			return this.relationships.map(relationship => {
				relationship.actions = 1
				return relationship
			})
		}
	},
	mounted() {
		this.getRelationship().then(data => this.relationships = data).catch((err => console.log(err)))
	}
}
</script>