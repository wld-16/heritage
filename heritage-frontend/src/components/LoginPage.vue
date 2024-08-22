<script setup lang="ts">
import {onBeforeMount, inject } from "vue";

const tokenServerUrl = inject('token-server-url')

onBeforeMount(() => {
  window.location.href = tokenServerUrl.toString();
})
</script>

<template>
</template>

<style scoped>

</style>