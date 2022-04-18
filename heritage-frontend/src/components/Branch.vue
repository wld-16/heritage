<template>
	<span>
		<graph-node :nodeData="branchData.path"></graph-node>
	</span>
</template>

<script>
	import GraphNode from './GraphNode'

	export default{
		name: 'TreeBranch',
		components: {
			GraphNode
		},
		props:{
			branchData:{},
			
		},
		created() {
		}

	}
</script>