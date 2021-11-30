<template>
<table>
  <tr>
    <th
      v-for="header in Object.keys(allRepoData[0])" :key="header"
    >{{ header }}</th>
  </tr>
  <tr
    v-for="resource in allRepoData" :key="resource.id"
  >
    <td
      v-for="(resourceData, j) in resource" :key="j"
    >{{ resourceData }}</td>
  </tr>
</table>
</template>

<script setup>
// A table to display all the data loaded into the application (just for testing?)

import { defineProps } from 'vue'

defineProps({
  // All of the data loaded into the application
  allRepoData: {
      type: Array,
      required: true
    }
})
</script>

<style scoped>

</style>