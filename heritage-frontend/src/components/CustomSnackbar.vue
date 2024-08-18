<script setup lang="ts">

import {toRefs} from "vue";

const props = defineProps({
  snackbar: Boolean,
  snackbarText: String
})

let { snackbar, snackbarText } = toRefs(props);
</script>

<template>
  <v-snackbar
      v-model="snackbar"
  >
    {{ snackbarText }}

    <template v-slot:actions>
      <slot></slot>
    </template>
  </v-snackbar>
</template>

<style scoped>

</style>