<template>
	<span>
		<graph-node :nodeData="branchData.path"></graph-node>
	</span>
</template>

<script>
	import GraphNode from './GraphNode'

	export default{
		name: 'Branch',
		components: {
			GraphNode
		},
		props:{
			branchData:{},
			
		},
		created() {
			console.log(this.branchData)
		}

	}
</script>