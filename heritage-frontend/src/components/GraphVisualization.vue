<template>
	<div>
		<table id="tree">
			<tbody>
				<tr v-for="branch in branches" :key="branch.id">
					<branch :branchData="branch"/>
				</tr>
				<br>
				<select v-model="selected">
					<option :value="0">Biological</option>
					<option :value="1">Family</option>
				</select>
				<br>
				<svg v-if="selected === 0 && renderNodes.length > 0" id="svgelem" :height="250 * yMax" :width="250 * (xMax + 1)">
					<template v-for="node in renderNodes">
						<text :x="node.x * xSpacing + 20" :y="node.y * ySpacing + 20" fill="red" :key="node.id">{{ node.name }}</text>
						<template v-if="node.parents.filter(parent => parent != undefined).length > 0">
							<line
								v-for="parentNode in node.parents" 
								:x1="node.x * xSpacing + 100" 
								:x2="renderNodes.filter(node => node.name === parentNode)[0].x * xSpacing + 100" 
								:y1="node.y * ySpacing"
								:y2="renderNodes.filter(node => node.name === parentNode)[0].y * ySpacing + 30" 
								style="stroke:rgb(255,0,0);stroke-width:2" 
								:key="parentNode.id"
							/>
						</template>
					</template>
				</svg>
				<svg v-if="selected === 1 && renderNodes.length > 0" id="svgelem" :height="250 * yMax" :width="250 * (xMax + 1)">
					<template v-for="node in nodesWithSiblings">
						<text :x="node.x * xSpacing + 20" :y="node.y * ySpacing + 20" fill="red" :key="node.id">{{ node.name }}</text>
						<template v-if="node.parents.filter(parent => parent !== undefined).length == 2">
							<line class="between-partners"
								:x1="findParentNodeByName(node.parents[1]).x * xSpacing + xOffset" 
								:x2="findParentNodeByName(node.parents[0]).x * xSpacing + xOffset" 
								:y1="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset" 
								:y2="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset" 
								style="stroke:rgb(255,0,0);stroke-width:2" 
								:key="node.id"
							/>
							<line v-if="renderChildrenRelationship" class="parents-child"
								:x1="(findParentNodeByName(node.parents[0]).x * xSpacing + xOffset) + ((findParentNodeByName(node.parents[1]).x * xSpacing + xOffset) - (findParentNodeByName(node.parents[0]).x * xSpacing + xOffset)) / 2" 
								:x2="(findParentNodeByName(node.parents[0]).x * xSpacing + xOffset) + ((findParentNodeByName(node.parents[1]).x * xSpacing + xOffset) - (findParentNodeByName(node.parents[0]).x * xSpacing + xOffset)) / 2" 
								:y1="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset" 
								:y2="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset + parentChildConnectorDelta + topToBottomTree[node.y].flatMap(indexNode => indexNode.name).indexOf(node.name) * 7" 
								style="stroke:rgb(255,0,0);stroke-width:1" 
								:key="node.id"
							/>
							<line v-if="renderChildrenRelationship" class="parents-child"
								:x1="(findParentNodeByName(node.parents[0]).x * xSpacing + xOffset) + ((findParentNodeByName(node.parents[1]).x * xSpacing + xOffset) - (findParentNodeByName(node.parents[0]).x * xSpacing + xOffset)) / 2" 
								:x2="node.x * xSpacing + xOffset" 
								:y1="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset + parentChildConnectorDelta + topToBottomTree[node.y].flatMap(indexNode => indexNode.name).indexOf(node.name) * 7" 
								:y2="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset + parentChildConnectorDelta + topToBottomTree[node.y].flatMap(indexNode => indexNode.name).indexOf(node.name) * 7" 
								style="stroke:rgb(255,0,0);stroke-width:2" 
								:key="node.id"
							/>
							<line v-if="renderChildrenRelationship" class="parents-child"
								:x1="node.x * xSpacing + xOffset" 
								:x2="node.x * xSpacing + xOffset" 
								:y1="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset + parentChildConnectorDelta + topToBottomTree[node.y].flatMap(indexNode => indexNode.name).indexOf(node.name) * 7" 
								:y2="node.y * ySpacing - (topToBottomTree[node.y].map(indexNode => indexNode.siblings).length > 0 ? topToBottomTree[node.y].flatMap(indexNode => indexNode.siblings).indexOf(node.name) : 1) + siblingsLineDown" 
								style="stroke:rgb(255,0,0);stroke-width:2" 
								:key="node.id"
							/>	
							<line class="parent-indicator"
								:x1="findParentNodeByName(node.parents[0]).x * xSpacing + xOffset" 
								:x2="findParentNodeByName(node.parents[0]).x * xSpacing + xOffset" 
								:y1="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset" 
								:y2="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset - partnersLineUp" 
								style="stroke:rgb(255,0,0);stroke-width:2" 
								:key="node.id"
							/>
							<line class="parent-indicator"
								:x1="findParentNodeByName(node.parents[1]).x * xSpacing + xOffset" 
								:x2="findParentNodeByName(node.parents[1]).x * xSpacing + xOffset" 
								:y1="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset" 
								:y2="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset - partnersLineUp" 
								style="stroke:rgb(255,0,0);stroke-width:2" 
								:key="node.id"
							/>
						</template>
						<template v-else-if="node.parents.filter(parent => parent != undefined).length == 1">
							<line class="parent-single"
								v-for="parentNode in node.parents" 
								:x1="node.x * xSpacing + xOffset" 
								:x2="findParentNodeByName(parentNode) * xSpacing + xOffset" 
								:y1="node.y * ySpacing"
								:y2="findParentNodeByName(parentNode).y * ySpacing + yOffset"
								style="stroke:rgb(255,0,0);stroke-width:2" 
								:key="parentNode.id"
							/>
						</template>
						<template v-if="node.siblings.filter(sibling => sibling != undefined).length > 0 && renderSiblingRelationship">
							<line class="siblings"
								:x1="nodesWithSiblings.filter(filterNode => filterNode.name === node.siblings[node.siblings.length - 1])[0].x * xSpacing + xOffset" 
								:x2="nodesWithSiblings.filter(filterNode => filterNode.name === node.siblings[0])[0].x * xSpacing + xOffset" 
								:y1="node.y * ySpacing - (topToBottomTree[node.y].map(indexNode => indexNode.siblings).length > 0 ? topToBottomTree[node.y].flatMap(indexNode => indexNode.siblings).indexOf(node.name) : 1) * siblingsDelta" 
								:y2="node.y * ySpacing - (topToBottomTree[node.y].map(indexNode => indexNode.siblings).length > 0 ? topToBottomTree[node.y].flatMap(indexNode => indexNode.siblings).indexOf(node.name) : 1) * siblingsDelta" 
								style="stroke:rgb(255,0,0);stroke-width:2" 
								:key="node.id" 
							/>
							<line class="sibling-indicator"
								:x1="nodesWithSiblings.filter(filterNode => filterNode.name === node.siblings[0])[0].x * xSpacing + xOffset" 
								:x2="nodesWithSiblings.filter(filterNode => filterNode.name === node.siblings[0])[0].x * xSpacing + xOffset" 
								:y1="node.y * ySpacing - (topToBottomTree[node.y].map(indexNode => indexNode.siblings).length > 0 ? topToBottomTree[node.y].flatMap(indexNode => indexNode.siblings).indexOf(node.name):  1) * siblingsDelta" 
								:y2="node.y * ySpacing - (topToBottomTree[node.y].map(indexNode => indexNode.siblings).length > 0 ? topToBottomTree[node.y].flatMap(indexNode => indexNode.siblings).indexOf(node.name): 1) * siblingsDelta + siblingsLineDown" 
								style="stroke:rgb(255,0,0);stroke-width:2" 
								:key="node.id" 
							/>
							<line class="sibling-indicator"
								:x1="nodesWithSiblings.filter(filterNode => filterNode.name === node.siblings[node.siblings.length - 1])[0].x * xSpacing + xOffset" 
								:x2="nodesWithSiblings.filter(filterNode => filterNode.name === node.siblings[node.siblings.length - 1])[0].x * xSpacing + xOffset" 
								:y1="node.y * ySpacing - (topToBottomTree[node.y].map(indexNode => indexNode.siblings).length > 0 ? topToBottomTree[node.y].flatMap(indexNode => indexNode.siblings).indexOf(node.name) : 1) * siblingsDelta"
								:y2="node.y * ySpacing - (topToBottomTree[node.y].map(indexNode => indexNode.siblings).length > 0 ? topToBottomTree[node.y].flatMap(indexNode => indexNode.siblings).indexOf(node.name) : 1) * siblingsDelta + siblingsLineDown" 
								style="stroke:rgb(255,0,0);stroke-width:2" 
								:key="node.id" 
							/>
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
				id: 0,
				renderNodes: [],
				xSpacing: 300,
				ySpacing: 200,
				xOffset: 100,
				yOffset: 30,
				renderBiologicalTree: true,
				renderFamilyTree: true,
				nodesWithSiblings: [],
				groupedFamilyNodes: [],
				nodeWithChildren: [],
				topToBottomTree: [],
				siblingsDelta: 15,
				siblingsLineDown: 5,
				partnersDelta: 15,
				partnersLineUp: 5,
				processedBranches: [],
				parentChildConnectorDelta: 140,
				renderChildrenRelationship: true,
				renderSiblingRelationship: false,
				xMax: 0,
				yMax: 0,
				selected: 1
			}
		},
		components: {
			Branch
		},
		created() {
			this.getBranches().then(data => {
				let branchesWithPath = this.branchesWithPath(data.branches.sort((b1, b2) => b2.l - b1.l))
				let branchesWithYPosition = this.branchesWithYPosition(branchesWithPath)
				this.branches = branchesWithYPosition
				return branchesWithYPosition
			}).then(() => {
				const levels = this.generateLevels(this.processedBranches)
				this.xMax = Math.max(...Object.values(levels).map(level => level.length))
				return this.calculateXPositions(levels)
			})
		},
		methods: {
			findParentNodeByName(parentName){
				return this.renderNodes.filter(filterNode => filterNode.name === parentName)[0]
			},
			branchesWithPath(branches){
				return branches.map(branch => {
					branch.path = JSON.parse(branch.path)
					return branch
				})
			},
			generateLevels(processedBranches){
				let levels = new Map()
				let index = 0

				let max = Math.max(...processedBranches.map(procBranch => procBranch.y))
				this.yMax = max

				while(index <= max) {
					levels[index] = processedBranches.filter(procBranch => procBranch.y === index)
					index += 1
				}
				return levels
			},
			getRecursiveNames(tail, nodes, index){
				if(tail === undefined){
					return nodes
				} else {
					index += 1
					nodes.push({name: tail.forname + tail.surname, index: index})
					return this.getRecursiveNames(tail.child, nodes, index)
				}
			},
			branchesWithYPosition(branches){
				let index = 0
				return branches.map(branch => {
					let offset = this.calculateYOffset(branch.path, this.processedBranches, 0)
					let levels = this.calculateYPositionsWithParents(branch.path, [], offset)
					this.processedBranches = this.processedBranches.map(procBranch => {
						if(levels.map(pEntry => pEntry.name).includes(procBranch.name)){
							procBranch.parents = procBranch.parents.concat(...levels.filter(lBranch => lBranch.name === procBranch.name && !lBranch.parents.includes(...procBranch.parents)).map(lBranch => lBranch.parents))
							return procBranch
						} 
						return procBranch
					})
					this.processedBranches.push(...levels.filter(entry => !this.processedBranches.map(pEntry => pEntry.name).includes(entry.name)))
					index+=1
					branch.id = index
					return branch
				})
			},
			calculateYPositionsWithParents(entry, returnList, index, parent){
				const name = entry.forname + " " + entry.surname + " " + entry.bday
				returnList.push({name: name, bday: entry.bday, y: index, parents: [parent]})
				index += 1
				if(entry.child !== undefined){
					return this.calculateYPositionsWithParents(entry.child, returnList, index, name)
				}
				return returnList
			},
			calculateXPositions(levels){
				Object.keys(levels).forEach(entry => {
					levels[entry] = levels[entry].map((node, index) => {
						node.x = index
						return node
					})
				})
				let levelsWithX = levels
				this.renderNodes = Object.values(levelsWithX).flatMap(entry => entry).map(node => {
					node.parents = [...new Set(node.parents.filter(parent => parent != null))]
					return node
				})
				
				this.calculateSiblings()
				this.calculateChildren()
				this.groupNodeFamilies()
			},
			calculateChildren(){
				this.nodeWithChildren = this.renderNodes.map(node => {
					node.children = this.renderNodes.filter(filterNode => filterNode.parents.includes(node.name)).map(childrenNode => childrenNode.name)
					return node
				})
			},
			calculateSiblings(){
				this.nodesWithSiblings = this.renderNodes.map(node => {
					node.siblings = this.renderNodes.filter(filterNode => node.parents.length !=0 && filterNode.name !== node.name && node.parents.toString() === filterNode.parents.toString()).map(siblingNode => siblingNode.name)
					return node
				})
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
			groupNodeFamilies(){
				let outputNodes = []
				new Set(this.nodesWithSiblings.map(node => node.y)).forEach(level => {
					let levelNodes = this.nodesWithSiblings.filter(node => node.y === level)
					let familyNodes = levelNodes.map(node => levelNodes.filter(filterNode => filterNode.parents.length !== 0 && filterNode.parents.toString() === node.parents.toString())).filter(family => family.length !== 0).concat(levelNodes.filter(node => node.parents.length === 0).map(node => [node]))
					let levelFamilies = []
					familyNodes.forEach(family => {
						if(!levelFamilies.map(entry => entry.map(n => n.name).toString()).includes(family.map(n => n.name).toString())){
							levelFamilies.push(family)
						}
					})
					outputNodes.push(levelFamilies)
				})
				this.groupedFamilyNodes = outputNodes.map(entry => {
					let index = 0
					return entry.map(family => {
						return family.map(node => {
							node.x = index
							index += 1
							return node
						})
					})
				})

				this.topToBottomTree = outputNodes.map(levelEl => levelEl.flatMap(node => node))

				// Bottom Up approach
				let levels = new Set(this.nodesWithSiblings.map(node => node.y))
				let levelArray = [...levels]


				let bottomToTopReverse = []

				levelArray.reverse().forEach(level => {
					bottomToTopReverse.push([...this.nodesWithSiblings.filter(node => node.y === level).map(node => {
						return this.nodesWithSiblings.filter(filterNode => filterNode.y === node.y - 1 && node.parents.map(parentName => parentName === filterNode.name).includes(true))
					})].filter(arrayElement => arrayElement.length > 0))
				})
				// merge bottom up/ with top down

				let topToBotton = levelArray.map(level => this.nodesWithSiblings.filter(filterNode => filterNode.y === level))


				let unsortedFamilyLevels = topToBotton.map((level, index) => {
					if(index > 0){
						let nodesWithChildren = level.map(node => bottomToTopReverse[index - 1].filter(filterFamily => filterFamily.map(filterNode => filterNode.name === node.name).includes(true)))
						return nodesWithChildren.concat(level.filter(node => node.children.length === 0).map(node => [node])).filter(family => family.length != 0)
					}
					return level
				}).map(levelWithDuplicates => {
					// Remove if already contains
					let outputLevel = []
					levelWithDuplicates.flatMap(entry => entry).forEach(family => {
						// Add if not contains
						if(outputLevel.length === 0 || outputLevel.filter(outputFamily => JSON.stringify(outputFamily) === JSON.stringify(family)).length === 0){
							outputLevel.push(family)
						}
					})
					return outputLevel.map(family => family.length === undefined ? [family] : family)
				})


				unsortedFamilyLevels.map((level, index) => {
					if(index > 0){
						return this.reorderByChildren(unsortedFamilyLevels[index - 1], level)
					}
					return level.flatMap(entry => entry)
				})
			},
			xPositionsWithFamilyAdjustment(tree) {
				console.log(tree)
			},
			reorderByChildren(childrenLayer, parentLayer) {
				let parentsByChildrenTree = [...new Set(childrenLayer.flatMap(entry => entry).flatMap(child => child.parents).concat(parentLayer.flatMap(entry => entry).flatMap(parent => parent.siblings)))].map((parentName, index) => {
					let parent = parentLayer.flatMap(entry => entry).filter(parent => parent.name === parentName)[0]
					parent.x = index
					return parent
				})
				return parentsByChildrenTree.map(parent => {
					if(parent.siblings.length > 0 && parent.siblings.map(siblingName => Math.abs(parentsByChildrenTree.filter(filterNode => filterNode.name === siblingName)[0].x - parent.x) === 1).includes(false)){
						// TODO: Swap when a swap with husband makes sense
						//parent.x = Math.sign(parentsByChildrenTree.filter(filterNode => filterNode.name === parent.siblings[0])[0])
					}
					return parent
				})
			}
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