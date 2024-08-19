<template>
  <v-card-title><h1>Tree</h1></v-card-title>
  <svg
    v-if="selected === 0 && renderNodes.length > 0"
    id="svgelem"
    :height="500 * yMax"
    :width="300 * xMax / dynamicWindowWidthQuotient"
  >
    <template
      v-for="node in renderNodes"
      :key="node.id"
    >
      <image
        :x="(node.x * xSpacing + textOffsetX) / dynamicWindowWidthQuotient"
        :y="node.y * ySpacing + imageHeight * node.y"
        width="120"
        height="120"
        :xlink:href="`${BASE_URL}/api/person/get-image/${node.id}`"
        :clip-path="`url(circleView-${node.id})`"
      />
      <text
        :font-size="20 / dynamicWindowWidthQuotient"
        :x="(node.x * xSpacing + textOffsetX) / dynamicWindowWidthQuotient"
        :y="node.y * ySpacing + textPositionY + imageHeight * node.y + imageHeight"
        fill="red"
      >{{ node.name }}
      </text>
      <text
        :font-size="20 / dynamicWindowWidthQuotient"
        :x="(node.x * xSpacing + textOffsetX) / dynamicWindowWidthQuotient"
        :y="node.y * ySpacing + textPositionY + textBDayOffset + imageHeight * node.y + imageHeight"
        fill="red"
      >{{ node.bday }}*
      </text>
        <template v-if="node.parents.filter(parent => parent !== undefined).length > 0">
          <line
            v-for="parentNode in node.parents"
            :key="parentNode.id"
            :x1="(node.x * xSpacing + 100) / dynamicWindowWidthQuotient"
            :x2="(renderNodes.filter(node => node.name === parentNode)[0].x * xSpacing + 100) / dynamicWindowWidthQuotient"
            :y1="node.y * ySpacing + 10 + imageHeight * node.y"
            :y2="renderNodes.filter(node => node.name === parentNode)[0].y * ySpacing + 30 + 25 + imageHeight * node.y"
            style="stroke:rgb(255,0,0);stroke-width:2"
          />
        </template>
    </template>
  </svg>
  <svg
    v-if="selected === 1 && renderNodes.length > 0"
    id="svgelem"
    :height="500 * yMax"
    :width="300 * xMax / dynamicWindowWidthQuotient"
  >
    <template
      v-for="node in nodesWithSiblings"
      :key="node.id"
    >
      <text
        :font-size="20 / dynamicWindowWidthQuotient"
        :x="(node.x * xSpacing + 20) / dynamicWindowWidthQuotient"
        :y="node.y * ySpacing + 30 + imageHeight * node.y + imageHeight"
        fill="red"
      >{{ node.name }}
      </text>
      <text
        :font-size="20 / dynamicWindowWidthQuotient"
        :x="(node.x * xSpacing + textOffsetX) / dynamicWindowWidthQuotient"
        :y="node.y * ySpacing + textPositionY + 20 + imageHeight * node.y + imageHeight"
        fill="red"
      >{{ node.bday }}*
      </text>
      <image
          :x="(node.x * xSpacing + textOffsetX) / dynamicWindowWidthQuotient"
          :y="node.y * ySpacing + imageHeight * node.y"
          width="120"
          height="120"
          :xlink:href="`${BASE_URL}/api/person/get-image/${node.id}`"
          :clip-path="`url(circleView-${node.id})`"
      />
      <template v-if="node.parents.filter(parent => parent !== undefined).length === 2">
        <line
          :key="node.id"
          class="between-partners"
          :x1="(findParentNodeByName(node.parents[1]).x * xSpacing + xOffset) / dynamicWindowWidthQuotient"
          :x2="(findParentNodeByName(node.parents[0]).x * xSpacing + xOffset) / dynamicWindowWidthQuotient"
          :y1="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset + textBDayOffset + imageHeight * node.y + 10"
          :y2="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset + textBDayOffset + imageHeight * node.y + 10"
          :style="`stroke:rgb(255,0,0);stroke-width:${strokeWidth}`"
        />
        <line
          v-if="renderChildrenRelationship"
          :key="node.id"
          class="parents-child"
          :x1="((findParentNodeByName(node.parents[0]).x * xSpacing + xOffset) + ((findParentNodeByName(node.parents[1]).x * xSpacing) - (findParentNodeByName(node.parents[0]).x * xSpacing)) / 2) / dynamicWindowWidthQuotient"
          :x2="((findParentNodeByName(node.parents[0]).x * xSpacing + xOffset) + ((findParentNodeByName(node.parents[1]).x * xSpacing) - (findParentNodeByName(node.parents[0]).x * xSpacing)) / 2) / dynamicWindowWidthQuotient"
          :y1="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset + textBDayOffset + imageHeight * node.y  + 10"
          :y2="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset + parentChildConnectorDelta + topToBottomTree[node.y].flatMap(indexNode => indexNode.name).indexOf(node.name) * branchDelta + imageHeight * node.y"
          :style="`stroke:rgb(255,0,0);stroke-width:${strokeWidth}`"
        />
        <line
          v-if="renderChildrenRelationship"
          :key="node.id"
          class="parents-child"
          :x1="((findParentNodeByName(node.parents[0]).x * xSpacing + xOffset) + ((findParentNodeByName(node.parents[1]).x * xSpacing + xOffset) - (findParentNodeByName(node.parents[0]).x * xSpacing + xOffset)) / 2) / dynamicWindowWidthQuotient"
          :x2="(node.x * xSpacing + xOffset) / dynamicWindowWidthQuotient"
          :y1="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset + parentChildConnectorDelta + topToBottomTree[node.y].flatMap(indexNode => indexNode.name).indexOf(node.name) * branchDelta + imageHeight * node.y"
          :y2="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset + parentChildConnectorDelta + topToBottomTree[node.y].flatMap(indexNode => indexNode.name).indexOf(node.name) * branchDelta + imageHeight * node.y"
          :style="`stroke:rgb(255,0,0);stroke-width:${strokeWidth}`"
        />
        <line
          v-if="renderChildrenRelationship"
          :key="node.id"
          class="parents-child"
          :x1="(node.x * xSpacing + xOffset) / dynamicWindowWidthQuotient"
          :x2="(node.x * xSpacing + xOffset) / dynamicWindowWidthQuotient"
          :y1="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset + parentChildConnectorDelta + topToBottomTree[node.y].flatMap(indexNode => indexNode.name).indexOf(node.name) * branchDelta + imageHeight * node.y"
          :y2="node.y * ySpacing - (topToBottomTree[node.y].map(indexNode => indexNode.siblings).length > 0 ? topToBottomTree[node.y].flatMap(indexNode => indexNode.siblings).indexOf(node.name) : 1) + siblingsLineDown + imageHeight * node.y"
          :style="`stroke:rgb(255,0,0);stroke-width:${strokeWidth}`"
        />
        <line
          :key="node.id"
          class="parent-indicator"
          :x1="(findParentNodeByName(node.parents[0]).x * xSpacing + xOffset) / dynamicWindowWidthQuotient"
          :x2="(findParentNodeByName(node.parents[0]).x * xSpacing + xOffset) / dynamicWindowWidthQuotient"
          :y1="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset + textBDayOffset + imageHeight * node.y + 10"
          :y2="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset - partnersLineUp + textBDayOffset + imageHeight * node.y + 10"
          :style="`stroke:rgb(255,0,0);stroke-width:${strokeWidth}`"
        />
        <line
          :key="node.id"
          class="parent-indicator"
          :x1="(findParentNodeByName(node.parents[1]).x * xSpacing + xOffset) / dynamicWindowWidthQuotient"
          :x2="(findParentNodeByName(node.parents[1]).x * xSpacing + xOffset) / dynamicWindowWidthQuotient"
          :y1="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset + textBDayOffset + imageHeight * node.y + 10"
          :y2="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset - partnersLineUp + textBDayOffset + imageHeight * node.y + 10"
          :style="`stroke:rgb(255,0,0);stroke-width:${strokeWidth}`"
        />
      </template>
      <template v-else-if="node.parents.filter(parent => parent !== undefined).length === 1">
        <line
          v-for="parentNode in node.parents"
          :key="parentNode.id"
          class="parent-single-vertical"
          :x1="(findParentNodeByName(parentNode).x * xSpacing + xOffset + xSpacing * 0.5) / dynamicWindowWidthQuotient"
          :x2="(findParentNodeByName(parentNode).x * xSpacing + xOffset + xSpacing * 0.5) / dynamicWindowWidthQuotient"
          :y1="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset + parentChildConnectorDelta + topToBottomTree[node.y].flatMap(indexNode => indexNode.name).indexOf(node.name) * branchDelta + imageHeight * node.y"
          :y2="findParentNodeByName(parentNode).y * ySpacing + yOffset + textBDayOffset + imageHeight * node.y + 10"
          :style="`stroke:rgb(255,0,0);stroke-width:${strokeWidth}`"
        />
        <line
          v-for="parentNode in node.parents"
          :key="parentNode.id"
          class="parent-single-horizontal"
          :x1="(findParentNodeByName(parentNode).x * xSpacing + xOffset) / dynamicWindowWidthQuotient"
          :x2="(findParentNodeByName(parentNode).x * xSpacing + xOffset + xSpacing * 0.5) / dynamicWindowWidthQuotient"
          :y1="findParentNodeByName(parentNode).y * ySpacing + yOffset + textBDayOffset + imageHeight * node.y + 10"
          :y2="findParentNodeByName(parentNode).y * ySpacing + yOffset + textBDayOffset + imageHeight * node.y + 10"
          :style="`stroke:rgb(255,0,0);stroke-width:${strokeWidth}`"
        />
        <line
          v-for="parentNode in node.parents"
          :key="parentNode.id"
          class="parent-single-child-horizontal"
          :x1="(node.x * xSpacing + xOffset) / dynamicWindowWidthQuotient"
          :x2="(findParentNodeByName(parentNode).x * xSpacing + xOffset + xSpacing * 0.5) / dynamicWindowWidthQuotient"
          :y1="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset + parentChildConnectorDelta + topToBottomTree[node.y].flatMap(indexNode => indexNode.name).indexOf(node.name) * branchDelta + imageHeight * node.y"
          :y2="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset + parentChildConnectorDelta + topToBottomTree[node.y].flatMap(indexNode => indexNode.name).indexOf(node.name) * branchDelta + imageHeight * node.y"
          :style="`stroke:rgb(255,0,0);stroke-width:${strokeWidth}`"
        />
        <line
          v-for="parentNode in node.parents"
          :key="parentNode.id"
          class="single-parent-indicator"
          :x1="(findParentNodeByName(parentNode).x * xSpacing + xOffset) / dynamicWindowWidthQuotient"
          :x2="(findParentNodeByName(parentNode).x * xSpacing + xOffset) / dynamicWindowWidthQuotient"
          :y1="findParentNodeByName(parentNode).y * ySpacing + yOffset + textBDayOffset + imageHeight * node.y + 10"
          :y2="findParentNodeByName(parentNode).y * ySpacing + yOffset - partnersLineUp + textBDayOffset + imageHeight * node.y + 10"
          :style="`stroke:rgb(255,0,0);stroke-width:${strokeWidth}`"
        />
        <line
          v-for="parentNode in node.parents"
          :key="parentNode.id"
          class="single-parent-child-indicator"
          :x1="(node.x * xSpacing + xOffset) / dynamicWindowWidthQuotient"
          :x2="(node.x * xSpacing + xOffset) / dynamicWindowWidthQuotient"
          :y1="findParentNodeByName(node.parents[0]).y * ySpacing + yOffset + parentChildConnectorDelta + topToBottomTree[node.y].flatMap(indexNode => indexNode.name).indexOf(node.name) * branchDelta + imageHeight * node.y"
          :y2="node.y * ySpacing + imageHeight * node.y"
          :style="`stroke:rgb(255,0,0);stroke-width:${strokeWidth}`"
        />
      </template>
      <template v-if="node.siblings.filter(sibling => sibling !== undefined).length > 0 && renderSiblingRelationship">
        <line
          :key="node.id"
          class="siblings"
          :x1="(nodesWithSiblings.filter(filterNode => filterNode.name === node.siblings[node.siblings.length - 1])[0].x * xSpacing + xOffset) / dynamicWindowWidthQuotient"
          :x2="(nodesWithSiblings.filter(filterNode => filterNode.name === node.siblings[0])[0].x * xSpacing + xOffset) / dynamicWindowWidthQuotient"
          :y1="node.y * ySpacing - (topToBottomTree[node.y].map(indexNode => indexNode.siblings).length > 0 ? topToBottomTree[node.y].flatMap(indexNode => indexNode.siblings).indexOf(node.name) : 1) * siblingsDelta + imageHeight * node.y"
          :y2="node.y * ySpacing - (topToBottomTree[node.y].map(indexNode => indexNode.siblings).length > 0 ? topToBottomTree[node.y].flatMap(indexNode => indexNode.siblings).indexOf(node.name) : 1) * siblingsDelta + imageHeight * node.y"
          :style="`stroke:rgb(255,0,0);stroke-width:${strokeWidth}`"
        />
        <line
          :key="node.id"
          class="child-indicator"
          :x1="(nodesWithSiblings.filter(filterNode => filterNode.name === node.siblings[0])[0].x * xSpacing + xOffset) / dynamicWindowWidthQuotient"
          :x2="(nodesWithSiblings.filter(filterNode => filterNode.name === node.siblings[0])[0].x * xSpacing + xOffset) / dynamicWindowWidthQuotient"
          :y1="node.y * ySpacing - (topToBottomTree[node.y].map(indexNode => indexNode.siblings).length > 0 ? topToBottomTree[node.y].flatMap(indexNode => indexNode.siblings).indexOf(node.name): 1) * siblingsDelta + imageHeight * node.y"
          :y2="node.y * ySpacing - (topToBottomTree[node.y].map(indexNode => indexNode.siblings).length > 0 ? topToBottomTree[node.y].flatMap(indexNode => indexNode.siblings).indexOf(node.name): 1) * siblingsDelta + siblingsLineDown + imageHeight * node.y"
          :style="`stroke:rgb(255,0,0);stroke-width:${strokeWidth}`"
        />
        <line
          :key="node.id"
          class="child-indicator"
          :x1="(nodesWithSiblings.filter(filterNode => filterNode.name === node.siblings[node.siblings.length - 1])[0].x * xSpacing + xOffset) / dynamicWindowWidthQuotient"
          :x2="(nodesWithSiblings.filter(filterNode => filterNode.name === node.siblings[node.siblings.length - 1])[0].x * xSpacing + xOffset) / dynamicWindowWidthQuotient"
          :y1="node.y * ySpacing - (topToBottomTree[node.y].map(indexNode => indexNode.siblings).length > 0 ? topToBottomTree[node.y].flatMap(indexNode => indexNode.siblings).indexOf(node.name) : 1) * siblingsDelta + imageHeight * node.y"
          :y2="node.y * ySpacing - (topToBottomTree[node.y].map(indexNode => indexNode.siblings).length > 0 ? topToBottomTree[node.y].flatMap(indexNode => indexNode.siblings).indexOf(node.name) : 1) * siblingsDelta + siblingsLineDown + imageHeight * node.y"
          :style="`stroke:rgb(255,0,0);stroke-width:${strokeWidth}`"
        />
      </template>
    </template>
  </svg>
  <br>

  <v-select
    v-model="selected"
    :items="[{id: 0, name:'Biological'},{id: 1, name:'Family'}]"
    label="visualization"
    item-title="name"
    item-value="id"
  />
</template>

<script>
import repository from '../../repository'
import branches from '../../branches.js'

export default {
  name: 'GraphVisualization',
  mixins: [repository, branches],
  data() {
    return {
      branches: [],
      renderedNodes: [],
      id: 1,
      renderNodes: [],
      strokeWidth: 4,
      xSpacingBase: 300,
      ySpacing: 200,
      imageHeight: 110,
      xOffsetBase: 200,
      yOffset: 30,
      textOffsetX: 20,
      textBDayOffset: 20,
      fontSize: 20,
      textPositionY: 30,
      renderBiologicalTree: true,
      renderFamilyTree: true,
      nodesWithSiblings: [],
      groupedFamilyNodes: [],
      nodeWithChildren: [],
      topToBottomTree: [],
      siblingsDelta: 40,
      siblingsLineDown: 5,
      partnersDelta: 15,
      partnersLineUp: 5,
      parentChildConnectorDelta: 120,
      renderChildrenRelationship: true,
      renderSiblingRelationship: false,
      xMax: 1,
      yMax: 1,
      selected: 1,
      branchDelta: 4,
      windowSize: {
        x: 1,
        y: 1,
      },
      windowQuotient: {
        x: 2,
        y: 2
      }
    }
  },
  computed: {
    dynamicWindowWidthQuotient() {
      return 2000 / this.windowSize.x
    },
    xOffset() {
      return this.windowSize.x * this.xOffsetBase * this.xMax / 5 / 2500
    },
    xSpacing() {
      return this.windowSize.x * this.xSpacingBase * this.xMax / 5 / 1750
    }
  },
  created() {
    this.updateBranches();
    this.onResize();
    window.addEventListener("resize", this.onResize);
  },
  unmounted() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    updateBranches() {
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
    findParentNodeByName(parentName) {
      return this.renderNodes.filter(filterNode => filterNode.name === parentName)[0]
    },
    generateLevels(processedBranches) {
      let levels = new Map()
      let index = 0

      let max = Math.max(...processedBranches.map(procBranch => procBranch.y))
      this.yMax = max

      while (index <= max) {
        levels[index] = processedBranches.filter(procBranch => procBranch.y === index)
        index += 1
      }
      return levels
    },
    onResize() {
      this.windowSize = {x: window.innerWidth, y: window.innerHeight};
    },
    getRecursiveNames(tail, nodes, index) {
      if (tail === undefined) {
        return nodes
      } else {
        index += 1
        nodes.push({name: tail.forname + tail.surname, index: index})
        return this.getRecursiveNames(tail.child, nodes, index)
      }
    },
    calculateXPositions(levels) {
      console.log(levels)
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
    calculateChildren() {
      this.nodeWithChildren = this.renderNodes.map(node => {
        node.children = this.renderNodes.filter(filterNode => filterNode.parents.includes(node.name)).map(childrenNode => childrenNode.name)
        return node
      })
    },
    calculateSiblings() {
      this.nodesWithSiblings = this.renderNodes.map(node => {
        node.siblings = this.renderNodes.filter(filterNode => node.parents.length != 0 && filterNode.name !== node.name && node.parents.toString() === filterNode.parents.toString()).map(siblingNode => siblingNode.name)
        return node
      })
    },
    groupNodeFamilies() {
      let outputNodes = []
      new Set(this.nodesWithSiblings.map(node => node.y)).forEach(level => {
        let levelNodes = this.nodesWithSiblings.filter(node => node.y === level)
        let familyNodes = levelNodes.map(node => levelNodes.filter(filterNode => filterNode.parents.length !== 0 && filterNode.parents.toString() === node.parents.toString())).filter(family => family.length !== 0).concat(levelNodes.filter(node => node.parents.length === 0).map(node => [node]))
        let levelFamilies = []
        familyNodes.forEach(family => {
          if (!levelFamilies.map(entry => entry.map(n => n.name).toString()).includes(family.map(n => n.name).toString())) {
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
        if (index > 0) {
          let nodesWithChildren = level.map(node => bottomToTopReverse[index - 1].filter(filterFamily => filterFamily.map(filterNode => filterNode.name === node.name).includes(true)))
          return nodesWithChildren.concat(level.filter(node => node.children.length === 0).map(node => [node])).filter(family => family.length != 0)
        }
        return level
      }).map(levelWithDuplicates => {
        // Remove if already contains
        let outputLevel = []
        levelWithDuplicates.flatMap(entry => entry).forEach(family => {
          // Add if not contains
          if (outputLevel.length === 0 || outputLevel.filter(outputFamily => JSON.stringify(outputFamily) === JSON.stringify(family)).length === 0) {
            outputLevel.push(family)
          }
        })
        return outputLevel.map(family => family.length === undefined ? [family] : family)
      })


      unsortedFamilyLevels.map((level, index) => {
        if (index > 0) {
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
        let parent = parentLayer.flatMap(entry => entry).find(parent => parent.name === parentName)
        if (parent !== undefined) {
          parent.x = index
          return parent
        }
        return parent
      })
      return parentsByChildrenTree.map(parent => {
        if (parent && parent.siblings.length > 0 && parent.siblings.map(siblingName => Math.abs(parentsByChildrenTree.filter(filterNode => {
          if (filterNode !== undefined) {
            return filterNode.name === siblingName
          }
          return false

        })[0].x - parent.x) === 1).includes(false)) {
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