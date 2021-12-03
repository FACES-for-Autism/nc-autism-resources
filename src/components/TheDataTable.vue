<template>
  <table class="block w-full table-fixed overflow-x-scroll border-collapse">
    <thead class="sticky">
      <tr>
        <th
          v-for="header in Object.keys(allRepoData[0])" :key="header"
          class="border-2 border-gray-600"
        >{{ header }}</th>
      </tr>
    </thead>
    <tr
      v-for="resource in allRepoData" :key="resource.id"
      :class="highlighted(resource.id)"
    >
      <td
        v-for="(resourceData, i) in resource" :key="i"
        class="border-2 border-gray-600"
      >{{ resourceData }}</td>
    </tr>
  </table>
</template>

<script setup>
/* global defineProps */
// A table to display all the data loaded into the application (just for testing?)
// import { computed } from 'vue'

const props = defineProps({
  // All of the data loaded into the application
  allRepoData: {
      type: Array,
      required: true
    },
  filteredRepoDataIDs: {
    type: Array
  }
})

const highlighted = (a) => {
  console.log(a)
  return props.filteredRepoDataIDs.includes(a) ? 'bg-purple-200' : ''
}
</script>

<style scoped>

</style>