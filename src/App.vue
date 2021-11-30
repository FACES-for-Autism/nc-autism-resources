<template>
  <h1>FACES Resources Repository</h1>
  <h2>Search results</h2>
  <div class="grid sm:grid-cols-1 md:grid-cols-2 place-items-center">
    <ResourceCard
      v-for="resource in appRepoData"
      :key="resource.id"
      :resource="resource"
    />
  </div>
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
  // Remove leading/trailing whitespace in string data and add an id key to each entry in the dataset
  const cleanRepoData = rawRepoData.map((resource, i) => {
    const cleanResource = {}
    // Some string values may have leading or trailing whitespace, trim these
    Object.entries(resource).forEach(d => {
      cleanResource[d[0].trim()] = typeof(d[1]) === 'string'
        ? d[1].trim() : d[1]
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
  max-width: 1280px;
  margin: auto;
}
</style>
