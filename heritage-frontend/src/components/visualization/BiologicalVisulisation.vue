<script setup lang="ts">
import {computed, reactive, onMounted} from "vue";

const yMax = 1
const xMax = 1

interface Size {
  x: number
  y: number
}
const windowSize: Size = reactive({x: 1, y: 2})
const dynamicWindowWidthQuotient = computed<number>(() => {
  return 2000 / windowSize.x
})

const xOffsetBase: number = 100
const xSpacingBase: number = 200

const xOffset = computed<number>( () => {
  return windowSize.x * xOffsetBase * xMax / 5 / 2500
})

const xSpacing = computed<number>( () => {
  return windowSize.x * xSpacingBase * xMax / 5 / 1750
})

const textOffsetX: number = 20
const textBDayOffset: number = 20
const ySpacing: number = 200

onMounted(() => {
  getBranches().then(data => {
    let branchesWithPath = this.branchesWithPath(data.branches.sort((b1, b2) => b2.l - b1.l))
    let branchesWithYPosition = this.branchesWithYPosition(branchesWithPath)
    this.branches = branchesWithYPosition
    return branchesWithYPosition
  }).then(() => {
    const levels = this.generateLevels(this.processedBranches)
    this.xMax = Math.max(...Object.values(levels).map(level => level.length))
    return this.calculateXPositions(levels)
  }),
})

function calculateXPositions(levels) {
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
}
</script>

<template>
  <svg
      id="svgelem"
      :height="250 * yMax"
      :width="300 * xMax / dynamicWindowWidthQuotient"
  >
    <template
        v-for="node in renderNodes"
        :key="node.id"
    >
      <text
          :font-size="20 / dynamicWindowWidthQuotient"
          :x="(node.x * xSpacing + textOffsetX) / dynamicWindowWidthQuotient"
          :y="node.y * ySpacing + textPositionY"
          fill="red"
      >{{ node.name }}
      </text>
      <text
          :font-size="20 / dynamicWindowWidthQuotient"
          :x="(node.x * xSpacing + textOffsetX) / dynamicWindowWidthQuotient"
          :y="node.y * ySpacing + textPositionY + textBDayOffset"
          fill="red"
      >{{ node.bday }}*
      </text>
      <template v-if="node.parents.filter(parent => parent !== undefined).length > 0">
        <line
            v-for="parentNode in node.parents"
            :key="parentNode.id"
            :x1="(node.x * xSpacing + 100) / dynamicWindowWidthQuotient"
            :x2="(renderNodes.filter(node => node.name === parentNode)[0].x * xSpacing + 100) / dynamicWindowWidthQuotient"
            :y1="node.y * ySpacing + 10"
            :y2="renderNodes.filter(node => node.name === parentNode)[0].y * ySpacing + 30 + 25"
            style="stroke:rgb(255,0,0);stroke-width:2"
        />
      </template>
    </template>
  </svg>
</template>

<style scoped>

</style>