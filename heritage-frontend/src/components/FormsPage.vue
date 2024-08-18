<template>
		<v-row>
			<v-col cols="2"></v-col>
			<v-col>
				<v-expansion-panels>
					<v-expansion-panel>
					<v-expansion-panel-title>
						Create Person
					</v-expansion-panel-title>
					<v-expansion-panel-text>
						<CreateOrUpdatePerson @create="showSnackbar('Created Person')"></CreateOrUpdatePerson>
					</v-expansion-panel-text>
				</v-expansion-panel>
				<v-expansion-panel>
					<v-expansion-panel-title>
						Create Relationship
					</v-expansion-panel-title>
					<v-expansion-panel-text>
						<CreateRelationship @create="showSnackbar('Created Relationship')"></CreateRelationship>
					</v-expansion-panel-text>
				</v-expansion-panel>
				<v-expansion-panel>
					<v-expansion-panel-title>
						Create Animal
					</v-expansion-panel-title>
					<v-expansion-panel-text>
						<CreateAnimal @create="showSnackbar('Created Animal')"></CreateAnimal>
					</v-expansion-panel-text>
				</v-expansion-panel>
				<v-expansion-panel>
					<v-expansion-panel-title>
						Create Label
					</v-expansion-panel-title>
					<v-expansion-panel-text>
						<CreateLabel @create="showSnackbar('Created Label')"></CreateLabel>
					</v-expansion-panel-text>
				</v-expansion-panel>
				</v-expansion-panels>
        <custom-snackbar :snackbar="snackbarVisible" :text="snackbarText">
          <v-btn
              color="pink"
              variant="text"
              @click="snackbarVisible = false"
          >
            Close
          </v-btn>
        </custom-snackbar>
			</v-col>
			<v-col cols="2"></v-col>
		</v-row>
</template>

<script>
import CreateOrUpdatePerson from './people/CreateOrUpdatePerson.vue'
import CreateAnimal from './animal/CreateAnimal.vue'
import CreateRelationship from './relationship/CreateRelationship.vue'
import CreateLabel from './label/CreateLabel.vue'
import CustomSnackbar from "@/components/CustomSnackbar.vue";

export default {
	name: "FormsPage",
	components: {
    CustomSnackbar,
		CreateOrUpdatePerson,
		CreateAnimal,
		CreateRelationship,
		CreateLabel
	},
  data: () => {
    return {
      snackbarVisible: false,
      snackbarText: "This is asd"
    }
  },
  methods: {
    showSnackbar(newSnackbarText) {
      this.snackbarVisible = true
      this.snackbarText = newSnackbarText
      setTimeout(() => {
        this.snackbarVisible = false
      }, "2000");
    }
  }
}
</script>