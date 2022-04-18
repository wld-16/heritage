<template>
	<PeopleTable></PeopleTable>
	<RelationshipsTable></RelationshipsTable>
	<RelationshipTypesTable></RelationshipTypesTable>
	<AnimalsTable></AnimalsTable>
	<SpeciesTable></SpeciesTable>
	<RacesTable></RacesTable>
</template>
<script>
import PeopleTable from './PeopleTable.vue'
import AnimalsTable from './AnimalsTable.vue' 
import SpeciesTable from './SpeciesTable.vue'
import RacesTable from './RacesTable.vue'
import RelationshipsTable from './RelationshipsTable.vue'
import RelationshipTypesTable from './RelationshipTypesTable.vue'

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