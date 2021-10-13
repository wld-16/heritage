<template>
	<div>
		<table id="tree">
			<tbody>
				<tr v-for="branch in branches" :key="branch.id">
					<branch :branchData="branch"></branch>
				</tr>
				<br>
					<svg id="svgelem" height="500" width="1500">
						<template v-for="node in renderNodes">
							<text :x="node.x * 300 + 20" :y="node.y * 100 + 20" fill="red" :key="node.id">{{ node.name }} ({{ node.bday }})</text>
							<template v-if="node.parents.filter(parent => parent != undefined).length > 0">
								<line v-for="parentNode in node.parents" :x1="node.x * 300 + 100" :x2="renderNodes.filter(node => node.name === parentNode)[0].x * 300 + 100" :y1="node.y * 100" :y2="renderNodes.filter(node => node.name === parentNode)[0].y * 100 + 30" style="stroke:rgb(255,0,0);stroke-width:2" :key="parentNode.id"></line>
							</template>
						</template>
					</svg>
				<br>
			</tbody>
		</table>
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
				tree:{nodes:[], links:[]},
				levels: new Map(),
				xMax: 0,
				levelsWithX: new Map(),
				renderNodes: []
			}
		},
		components: {
			Branch
		},
		created() {
			this.getBranches().then(data => {
				
				this.tree = {nodes:[], links:[]}
				this.branches = data.branches.sort((b1, b2) => b2.l - b1.l)

				let index = 0
				let processedBranches = []

				this.branches = this.branches.map(branch => {
					branch.path = JSON.parse(branch.path)
					const offset = this.calculateYOffset(branch.path, processedBranches, 0)
					branch.levels = this.calculateYPositions(branch.path, [], offset)
					processedBranches = processedBranches.map(procBranch => {
						if(branch.levels.map(pEntry => pEntry.name).includes(procBranch.name)){
							procBranch.parents = procBranch.parents.concat(...branch.levels.filter(lBranch => lBranch.name === procBranch.name && !lBranch.parents.includes(...procBranch.parents)).map(lBranch => lBranch.parents))
							return procBranch
						}
						return procBranch
					})
					processedBranches.push(...branch.levels.filter(entry => !processedBranches.map(pEntry => pEntry.name).includes(entry.name)))
					index+=1
					branch.id = index
					return branch
				})

				index = 0

				let max = Math.max(...processedBranches.map(procBranch => procBranch.y))

				while(index <= max) {
					this.levels[index] = processedBranches.filter(procBranch => procBranch.y === index)
					index += 1
				}
				this.xMax = Math.max(...Object.values(this.levels).map(level => level.length))
			}).then(() => {
				return this.calculateXPositions()
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
			calculateYPositions(entry, returnList, index, parentName){
				const name = entry.forname + " " + entry.surname
				returnList.push({name: name, bday: entry.bday, y: index, parents: [parentName]})
				index += 1
				if(entry.child !== undefined){
					return this.calculateYPositions(entry.child, returnList, index, name)
				}
				return returnList
			},
			calculateXPositions(){
				Object.entries(this.levels).forEach(entry => {
					this.levels[entry[0]] = this.levels[entry[0]].map((node, index) => {
						node.x = index
						return node
					})
				})
				this.levelsWithX = this.levels
				this.renderNodes = Object.values(this.levelsWithX).flatMap(entry => entry)
				console.log(this.levelsWithX)
				console.log(this.renderNodes)
			},
			calculateYOffset(branch, processedBranches, index){
				const indexOf = processedBranches.map(pEntry => pEntry.name).indexOf(branch.forname + " " + branch.surname)

				if(indexOf === -1){
					if(branch.child === undefined){
						return 0
					} else {
						index += 1
						return this.calculateYOffset(branch.child, processedBranches, index)
					}
				} else {
					return processedBranches[indexOf].y - index
				}
			},
			checkNameExistsInBranchRecursive(branch, checkName){
				if(branch.child === undefined) {
					return false
				} else if((branch.forname + branch.surname) === checkName){
					return true
				} else {
					return this.checkNameExistsInBranchRecursive(branch.child)
				}
			},
			// TODO: Debug Position in Layout when duplicate, also debug homer on same level like bart
		}
	}
</script>

<style>
#tree {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-left: auto;
  margin-right: auto;
  color: #2c3e50;
  margin-top: 60px;
}
</style>