<template>
	<v-card>
		<v-card-title>
			<h1>Relationships</h1>
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
				<tr v-for="relationship in relationships" :key="relationship.id">
					<td>{{ relationship.id }}</td>
					<td>{{ relationship.person_from_id }}</td>
					<td>{{ relationship.person_to_id }}</td>
					<td>{{ relationship.relationship_id }}</td>
					<td>
						<v-icon
						@click="deleteRelationship({id: relationship.id, person_from_id, person_to_id }).then(() => updateView())">
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
	name: 'RelationshipsTable',
	mixins: [ repository ],
	data () {
		return {
			headers: [
				{ text: 'Id', value: 'id' },
				{ text: 'From', value: 'person_from_id' },
				{ text: 'To', value: 'person_to_id' },
				{ text: 'Relationship Type', value: 'relationship_id'},
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