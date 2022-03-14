<template>
	<div>
		<br>
		<svg v-if="selected === 0 && renderNodes.length > 0" id="svgelem" :height="250 * yMax" :width="250 * (xMax + 1)">
			<template v-for="node in renderNodes">
				<text :x="node.x * xSpacing + 20" :y="node.y * ySpacing + 30" fill="red" :key="node.id">{{ node.name }}</text>
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
						:y2="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset + parentChildConnectorDelta + topToBottomTree[node.y].flatMap(indexNode => indexNode.name).indexOf(node.name) * branchDelta" 
						style="stroke:rgb(255,0,0);stroke-width:1" 
						:key="node.id"
					/>
					<line v-if="renderChildrenRelationship" class="parents-child"
						:x1="(findParentNodeByName(node.parents[0]).x * xSpacing + xOffset) + ((findParentNodeByName(node.parents[1]).x * xSpacing + xOffset) - (findParentNodeByName(node.parents[0]).x * xSpacing + xOffset)) / 2" 
						:x2="node.x * xSpacing + xOffset" 
						:y1="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset + parentChildConnectorDelta + topToBottomTree[node.y].flatMap(indexNode => indexNode.name).indexOf(node.name) * branchDelta" 
						:y2="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset + parentChildConnectorDelta + topToBottomTree[node.y].flatMap(indexNode => indexNode.name).indexOf(node.name) * branchDelta" 
						style="stroke:rgb(255,0,0);stroke-width:2" 
						:key="node.id"
					/>
					<line v-if="renderChildrenRelationship" class="parents-child"
						:x1="node.x * xSpacing + xOffset" 
						:x2="node.x * xSpacing + xOffset" 
						:y1="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset + parentChildConnectorDelta + topToBottomTree[node.y].flatMap(indexNode => indexNode.name).indexOf(node.name) * branchDelta" 
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
					<line class="parent-single-vertical"
						v-for="parentNode in node.parents" 
						:x1="findParentNodeByName(parentNode).x * xSpacing + xOffset + xSpacing * 0.5"
						:x2="findParentNodeByName(parentNode).x * xSpacing + xOffset + xSpacing * 0.5"
						:y1="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset + parentChildConnectorDelta + topToBottomTree[node.y].flatMap(indexNode => indexNode.name).indexOf(node.name) * branchDelta"
						:y2="findParentNodeByName(parentNode).y * ySpacing + yOffset"
						style="stroke:rgb(255,0,0);stroke-width:2" 
						:key="parentNode.id"
					/>
					<line class="parent-single-horizontal"
						v-for="parentNode in node.parents" 
						:x1="findParentNodeByName(parentNode).x * xSpacing + xOffset" 
						:x2="findParentNodeByName(parentNode).x * xSpacing + xOffset + xSpacing * 0.5"
						:y1="findParentNodeByName(parentNode).y * ySpacing + yOffset"
						:y2="findParentNodeByName(parentNode).y * ySpacing + yOffset"
						style="stroke:rgb(255,0,0);stroke-width:2" 
						:key="parentNode.id"
					/>
					<line class="parent-single-child-horizontal"
						v-for="parentNode in node.parents" 
						:x1="node.x * xSpacing + xOffset" 
						:x2="findParentNodeByName(parentNode).x * xSpacing + xOffset + xSpacing * 0.5"
						:y1="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset + parentChildConnectorDelta + topToBottomTree[node.y].flatMap(indexNode => indexNode.name).indexOf(node.name) * branchDelta"
						:y2="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset + parentChildConnectorDelta + topToBottomTree[node.y].flatMap(indexNode => indexNode.name).indexOf(node.name) * branchDelta"
						style="stroke:rgb(255,0,0);stroke-width:2" 
						:key="parentNode.id"
					/>
					<line class="single-parent-indicator"
						v-for="parentNode in node.parents" 
						:x1="findParentNodeByName(parentNode).x * xSpacing + xOffset" 
						:x2="findParentNodeByName(parentNode).x * xSpacing + xOffset" 
						:y1="findParentNodeByName(parentNode).y * ySpacing + yOffset" 
						:y2="findParentNodeByName(parentNode).y * ySpacing + yOffset - partnersLineUp" 
						style="stroke:rgb(255,0,0);stroke-width:2" 
						:key="parentNode.id"
					/>
					<line class="single-parent-child-indicator"
						v-for="parentNode in node.parents"
						:x1="node.x * xSpacing + xOffset" 
						:x2="node.x * xSpacing + xOffset"
						:y1="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset + parentChildConnectorDelta + topToBottomTree[node.y].flatMap(indexNode => indexNode.name).indexOf(node.name) * branchDelta" 
						:y2="node.y * ySpacing" 
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
					<line class="child-indicator"
						:x1="nodesWithSiblings.filter(filterNode => filterNode.name === node.siblings[0])[0].x * xSpacing + xOffset" 
						:x2="nodesWithSiblings.filter(filterNode => filterNode.name === node.siblings[0])[0].x * xSpacing + xOffset" 
						:y1="node.y * ySpacing - (topToBottomTree[node.y].map(indexNode => indexNode.siblings).length > 0 ? topToBottomTree[node.y].flatMap(indexNode => indexNode.siblings).indexOf(node.name):  1) * siblingsDelta" 
						:y2="node.y * ySpacing - (topToBottomTree[node.y].map(indexNode => indexNode.siblings).length > 0 ? topToBottomTree[node.y].flatMap(indexNode => indexNode.siblings).indexOf(node.name): 1) * siblingsDelta + siblingsLineDown" 
						style="stroke:rgb(255,0,0);stroke-width:2" 
						:key="node.id" 
					/>
					<line class="child-indicator"
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
		<v-container>
			<v-select
				:items="[{id: 0, name:'Biological'},{id: 1, name:'Family'}]"
				label="visualization"
				v-model="selected"
				item-text="name"
				item-value="id"
			></v-select>
        </v-container>
	</div>
</template>

<script>
	import repository from '../repository'
	import branches from '../branches.js'

	export default{
		name: 'GraphVisualization',
		mixins: [ repository , branches],
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
				parentChildConnectorDelta: 140,
				renderChildrenRelationship: true,
				renderSiblingRelationship: false,
				xMax: 0,
				yMax: 0,
				selected: 1,
				branchDelta: 7
			}
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