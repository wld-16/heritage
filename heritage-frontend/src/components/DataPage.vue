<template>
  <v-row>
    <v-col cols="2"></v-col>
    <v-col>
      <PeopleTable></PeopleTable>
      <RelationshipsTable></RelationshipsTable>
      <RelationshipTypesTable></RelationshipTypesTable>
      <AnimalsTable></AnimalsTable>
      <SpeciesTable></SpeciesTable>
      <RacesTable></RacesTable>
    </v-col>
    <v-col cols="2"></v-col>
  </v-row>
</template>
<script>
import PeopleTable from './people/PeopleTable.vue'
import AnimalsTable from './animal/AnimalsTable.vue'
import SpeciesTable from './label/SpeciesTable.vue'
import RacesTable from './label/RacesTable.vue'
import RelationshipsTable from './relationship/RelationshipsTable.vue'
import RelationshipTypesTable from './relationship/RelationshipTypesTable.vue'

export default {
	name:"DataPage",
	components: {
		PeopleTable,
		AnimalsTable,
		SpeciesTable,
		RacesTable,
		RelationshipsTable,
		RelationshipTypesTable
	}
}
</script>