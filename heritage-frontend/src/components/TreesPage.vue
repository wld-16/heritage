<template>
  <v-row>
    <v-col cols="2" />
    <v-col>
      <GraphVisualization />
    </v-col>
    <v-col cols="2" />
  </v-row>
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