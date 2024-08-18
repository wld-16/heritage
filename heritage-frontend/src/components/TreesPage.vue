<template>
    <v-col cols="2"></v-col>
    <v-col>
      <GraphVisualization></GraphVisualization>
    </v-col>
    <v-col cols="2"></v-col>
</template>
<script>
import GraphVisualization from './visualization/GraphVisualization.vue'

export default {
  name: "TreesPage",
  components: {
    GraphVisualization
  }
}
</script>