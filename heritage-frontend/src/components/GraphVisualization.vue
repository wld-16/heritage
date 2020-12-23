<template>
	<div>
		<graph-node></graph-node>
		<graph-node></graph-node>
		<graph-link></graph-link>
	</div>
</template>

<script>
	import GraphNode from './GraphNode'
	import GraphLink from './GraphLink'

	export default{
		name: 'GraphVisualization',
		components: {
			GraphNode,
			GraphLink
		}
	}
</script>