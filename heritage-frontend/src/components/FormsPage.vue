<template>
	<v-card>
		<v-row>
			<v-col cols="1"></v-col>
			<v-col>
				<v-expansion-panels>
					<v-expansion-panel>
					<v-expansion-panel-title>
						Create Person
					</v-expansion-panel-title>
					<v-expansion-panel-text>
						<CreateOrUpdatePerson></CreateOrUpdatePerson>
					</v-expansion-panel-text>
				</v-expansion-panel>
				<v-expansion-panel>
					<v-expansion-panel-title>
						Create Relationship
					</v-expansion-panel-title>
					<v-expansion-panel-text>
						<CreateRelationship></CreateRelationship>
					</v-expansion-panel-text>
				</v-expansion-panel>
				<v-expansion-panel>
					<v-expansion-panel-title>
						Create Animal
					</v-expansion-panel-title>
					<v-expansion-panel-text>
						<CreateAnimal></CreateAnimal>
					</v-expansion-panel-text>
				</v-expansion-panel>
				<v-expansion-panel>
					<v-expansion-panel-title>
						Create Label
					</v-expansion-panel-title>
					<v-expansion-panel-text>
						<CreateLabel></CreateLabel>
					</v-expansion-panel-text>
				</v-expansion-panel>
				</v-expansion-panels>
			</v-col>
			<v-col cols="1"></v-col>
		</v-row>
	</v-card>
</template>

<script>
import CreateOrUpdatePerson from './CreateOrUpdatePerson.vue'
import CreateAnimal from './CreateAnimal.vue'
import CreateRelationship from './CreateRelationship.vue'
import CreateLabel from './CreateLabel.vue'

export default {
	name: "FormsPage",
	components: {
		CreateOrUpdatePerson,
		CreateAnimal,
		CreateRelationship,
		CreateLabel
	}
}
</script>