<template>
	<v-card>
		<v-card-title>
			<h1>Relationship Types</h1>
		</v-card-title>
		<v-card-text>
			<v-data-table 
				:headers="headers"
				:items="computedTypes"
				:items-per-page="5"
				class="elevation-1"
			>
				<template v-slot:item.actions="{ item }">
					<v-icon
						@click="deleteRelationshipType(item).then(() => updateView())">
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
	name: 'RelationshipTypes',
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