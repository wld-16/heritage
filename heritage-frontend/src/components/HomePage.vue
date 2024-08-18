<template>
	<v-row>
    <v-col cols="2"></v-col>
		<v-col>
			<PeopleTable/>
		</v-col>
    <v-col cols="2"></v-col>
	</v-row>
</template>
<script>
import PeopleTable from './people/PeopleTable.vue'

export default {
	name: "HomePage",
	components: {
		PeopleTable
	}
}
</script>