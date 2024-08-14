<template>
	<v-card>
		<v-card-title>
			<h1>RelationshipTypesTable</h1>
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
				<tr v-for="type in relationshipTypes" :key="type.id">
					<td>{{ type.id }}</td>
					<td>{{ type.label }}</td>
					<td>{{ type.opposite_id }}</td>
					<td>
						<v-icon
						@click="deleteRelationshipType({id: type.id}).then(() => updateView())">
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
	name: 'RelationshipTypesTable',
	mixins: [ repository ],
	data () {
		return {
			headers: [
				{ text: 'Id', value: 'id' },
				{ text: 'Label', value: 'label' },
				{ text: 'Opposite Id', value: 'opposite_id' },
				{ text: 'Actions', value: 'actions'}
			],
			relationshipTypes: []
		}
	},
	methods: {
		updateView() {
			this.getRelationshipTypes().then(data => this.relationshipTypes = data).catch((err => console.log(err)))
		}
	},
	computed:{
		computedTypes() {
			return this.relationshipTypes.map(type => {
				type.actions = 1
				return type
			})
		}
	},
	mounted() {
		this.getRelationshipTypes().then(data => this.relationshipTypes = data).catch((err => console.log(err)))
	}
}
</script>