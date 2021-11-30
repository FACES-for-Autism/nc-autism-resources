<template>
  <h1>FACES Resources Repository</h1>
  <h2>Search results</h2>
  <ResourceCard
    v-for="resource in appRepoData"
    :key="resource.id"
    :resource="resource"
  />
  <h2>Full data table</h2>
  <TheDataTable :allRepoData="appRepoData" />
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'

import TheDataTable from './components/TheDataTable.vue'
import ResourceCard from './components/ResourceCard.vue'

// Import the data source (currently a locally stored test CSV file)
import rawRepoData from './assets/data/sample-repo-Duplin.csv'

// Create reactive data to contain data from CSV file
const appRepoData = ref({})

// Pass the CSV data into the reactive data store
onBeforeMount(() => {
  // Remove leading/trailing whitespace in column headers and add an id key to each entry in the dataset
  const cleanRepoData = rawRepoData.map((resource, i) => {
    const cleanResource = {}
    // Some column headers may have leading or trailing whitespace, trim these
    Object.entries(resource).forEach(d => {
      cleanResource[d[0].trim()] = d[1]
    })
    // Add id parameter to each resource object
    cleanResource.id = i
    return cleanResource
  });
  appRepoData.value = cleanRepoData
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
