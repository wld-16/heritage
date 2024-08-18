<script setup lang="ts">

import {toRefs} from "vue";

const props = defineProps({
  snackbar: Boolean,
  snackbarText: { type: String, default: "" }
})

let { snackbar, snackbarText } = toRefs(props);
</script>

<template>
  <v-snackbar
    v-model="snackbar"
  >
    {{ snackbarText }}

    <template #actions>
      <slot />
    </template>
  </v-snackbar>
</template>

<style scoped>

</style>