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
	import repository from '../repository'

	export default{
		name: 'GraphVisualization',
		mixins: [ repository ] ,
		components: {
			GraphNode,
			GraphLink
		},
		created() {
			this.getBranches().then(data => {
				console.log(data.branches.map(entry => {
					entry.path = JSON.parse(entry.path)
					return entry
				}))
			})

		}
	}
</script>