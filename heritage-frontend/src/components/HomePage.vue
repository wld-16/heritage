<template>
  <v-row>
    <v-col cols="6">
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-title>
            Create Person
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <CreateOrUpdatePerson
              @create="personUpdate"
              @image-uploaded="imageUploadUpdate"
            />
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-title>
            Create Relationship
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <CreateRelationship @create="relationshipUpdate" />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
    <v-col cols="6">
      <graph-visualization ref="visualisation" />
    </v-col>
  </v-row>
  <v-row>
    <custom-snackbar 
      :snackbar="snackbarVisible" 
      :snackbar-text="snackbarText"
    />
  </v-row>
  <v-row>
    <v-col>
      <PeopleTable ref="people" />
      <RelationshipsTable ref="relationships" />
    </v-col>
  </v-row>
</template>
<script>
import PeopleTable from './people/PeopleTable.vue'
import CreateRelationship from "@/components/relationship/CreateRelationship.vue";
import CreateOrUpdatePerson from "@/components/people/CreateOrUpdatePerson.vue";
import GraphVisualization from "@/components/visualization/GraphVisualization.vue";
import RelationshipsTable from "@/components/relationship/RelationshipsTable.vue";
import CustomSnackbar from "@/components/CustomSnackbar.vue";

export default {
  name: "HomePage",
  components: {
    CustomSnackbar,
    RelationshipsTable,
    GraphVisualization,
    CreateRelationship,
    CreateOrUpdatePerson,
    PeopleTable
  },
  data: () => {
    return {
      snackbarText: "Created",
      snackbarVisible: false
    }
  },
  methods: {
    personUpdate(person) {
      this.showSnackbar("Created new Person")
      this.$refs.people.updatePeople(person)
    },
    imageUploadUpdate() {
      this.showSnackbar("Image Uploaded")
    },
    relationshipUpdate(relationship) {
      this.showSnackbar("Created new Relationship")
      this.$refs.relationships.updateRelationship(relationship)
      this.$refs.visualisation.updateBranches()
    },
    showSnackbar(newSnackbarText) {
      this.snackbarVisible = true
      this.snackbarText = newSnackbarText
      setTimeout(() => {
        this.snackbarVisible = false
      }, 2000);
    }
  }
}
</script>