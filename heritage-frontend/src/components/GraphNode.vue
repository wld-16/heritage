<template>
	<td>
		<span v-if="nodeData != undefined" >
			{{ nodeData.forname }} {{ nodeData.surname }} ({{ nodeData.bday }}) 
			<span v-if="nodeData.child != undefined">
				<graph-link></graph-link>
				<graph-node :nodeData="nodeData.child"></graph-node>
			</span>
		</span>
	</td>
</template>

<script>
import GraphLink from './GraphLink'

	export default {
		name: "graph-node",
		components: {
			GraphLink
		},
		props: {
			nodeData: {}
		}
	}
</script>