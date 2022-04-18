<template>
	<v-row>
		<v-col>
			<PeopleTable/>
		</v-col>
		<v-col></v-col>
	</v-row>
</template>
<script>
import PeopleTable from './PeopleTable.vue'

export default {
	name: "HomePage",
	components: {
		PeopleTable
	}
}
</script>