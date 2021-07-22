<template>
	<div>
		<v-simple-table>
			<tbody>
				<tr v-for="branch in branches" :key="branch.id">
					<branch :branchData="branch"></branch>
				</tr>
				
			</tbody>
		</v-simple-table>
	</div>
</template>

<script>
	import Branch from './Branch'
	import repository from '../repository'

	export default{
		name: 'GraphVisualization',
		mixins: [ repository ],
		data() {
			return {
				branches: [],
				renderedNodes: [],
				mainBranch: {},
				secondBranch: {},
				id: 0,
				tree:{nodes:[], links:[]}
			}
		},
		components: {
			Branch
		},
		created() {
			this.getBranches().then(data => {
				//console.log(data)
				let index = 0
				this.branches = data.branches.map(entry => {
					entry.path = JSON.parse(entry.path)
					index+=1
					entry.id = index
					return entry
				})

				let xIndex = 0

				this.tree = {nodes:[], links:[]}
				console.log(this.tree)

				this.branches.forEach(branch => {
					let processedBranch = this.buildRecursiveTreeFromBranch(branch.path, branch.path.child, this.tree.nodes, this.tree.links, xIndex)
					this.treeNodes = processedBranch.treeNodes
					this.treeLinks = processedBranch.treeLinks
					xIndex = processedBranch.xIndex
					console.log(processedBranch)
				})

				let max = Math.max(...this.branches.map(branch => branch.l))
				let otherMaxBranches = []
				let mainBranchCandidates = this.branches.filter(branch => branch.l === max)

				this.mainBranch = mainBranchCandidates[0]
				this.renderedNodes = this.getRecursiveNames(this.mainBranch.path, [], 0)
				//console.log(this.renderedNodes)
				let restOfBranches = this.branches.filter(branch => branch.l !== max)

				if(mainBranchCandidates.Length > 1){
					otherMaxBranches = mainBranchCandidates.shift()
					restOfBranches.concat(otherMaxBranches)
				}

				//console.log(restOfBranches.map(branch => this.getRecursiveNames(branch.path, [], 0)).filter(branch => branch.map(node => this.renderedNodes.map(ren => ren.name).includes(node.name)).reduce((a,b) => a || b)))
				
			})
		},
		methods: {
			getRecursiveNames(tail, nodes, index){
				if(tail === undefined){
					return nodes
				} else {
					index += 1
					nodes.push({name: tail.forname + tail.surname, index: index})
					return this.getRecursiveNames(tail.child, nodes, index)
				}
			},
			// TODO: Debug Position in Layout when duplicate, also debug homer on same level like bart
			buildRecursiveTreeFromBranch(parentNode, childNode, treeNodes, treeLinks, xIndex){
				if(childNode === undefined){
					return({treeNodes:treeNodes, treeLinks:treeLinks, xIndex:xIndex})
				} else {
					if(treeLinks.filter(link => link.parent === (parentNode.forname + parentNode.surname) && link.child === (childNode.forname + childNode.surname)).length > 0){
						return this.buildRecursiveTreeFromBranch(childNode, childNode.child, treeNodes, treeLinks, xIndex)
					} else {
						if(treeLinks.filter(link => link.parent === (parentNode.forname + parentNode.surname)).length === 1) {
							let existingParent = treeNodes.filter(node => node.name === (parentNode.forname + parentNode.surname))[0]
							treeLinks.push({parent: existingParent.name, child: childNode.forname + childNode.surname})
							if(treeNodes.filter(node => node.name === childNode.forname + childNode.surname).length === 0){
								treeNodes.push({name: childNode.forname + childNode.surname, position: {x: existingParent.position.x, y:existingParent.position.y + 1}})
							}

						} else if(treeLinks.filter(link => link.child === (childNode.forname + childNode.surname)).length === 1){
							let existingChild = treeNodes.filter(node => node.name === (childNode.forname + childNode.surname))[0]
							treeLinks.push({parent: parentNode.forname + parentNode.surname, child: existingChild.name})
							if(treeNodes.filter(node => node.name === parentNode.forname + parentNode.surname).length === 0){
								treeNodes.push({name: parentNode.forname + parentNode.surname, position: {x: existingChild.position.x, y:existingChild.position.y - 1}})
							}
							
						} else {
							treeLinks.push({parent: parentNode.forname + parentNode.surname, child: childNode.forname + childNode.surname})
							if(treeNodes.filter(node => node.name === parentNode.forname + parentNode.surname).length === 0){
								treeNodes.push({name: parentNode.forname + parentNode.surname, position: {x: xIndex, y: 0}})
							}
							if(treeNodes.filter(node => node.name === childNode.forname + childNode.surname).length === 0){
								treeNodes.push({name: childNode.forname + childNode.surname, position: {x: xIndex, y: 1}})
								xIndex += 1
							}
						}
						return this.buildRecursiveTreeFromBranch(childNode, childNode.child, treeNodes, treeLinks, xIndex)
					}
				}
			}
		}
	}
</script>