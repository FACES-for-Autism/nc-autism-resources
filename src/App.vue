<template>
  <h1>FACES Resources Repository</h1>
  <h2>Resource listing</h2>
  <SearchForm
    v-model:county="state.fieldFilters.county"
  />
  <p>{{ filterText }}</p>
  <div class="grid sm:grid-cols-1 sm:gap-2 md:grid-cols-2 md:gap-4 place-items-stretch">
    <ResourceCard
      v-for="resource in state.filteredRepoData"
      :key="resource.id"
      :resource="resource"
    />
  </div>
  <h2>Full data table (for testing)</h2>
  <TheDataTable :allRepoData="state.fullRepoData" />
</template>

<script setup>
import { reactive, watch, onBeforeMount, computed } from 'vue'

import SearchForm from './components/SearchForm.vue'
import ResourceCard from './components/ResourceCard.vue'
import TheDataTable from './components/TheDataTable.vue'

// Import the data source (currently a locally stored test CSV file)
import rawRepoData from './assets/data/sample-repo-Duplin.csv'

// Create reactive data
const state = reactive({
  // The full dataset for the repository
  fullRepoData: null,
  // The filtered dataset for display in the application
  filteredRepoData: null,
  // The field values used to filter the dataset
  fieldFilters: {
    'county': '',
    'age': '',
    'services': []
  }
})

// Pass the CSV data into the reactive data store before the component is mounted
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
  state.fullRepoData = cleanRepoData
  state.filteredRepoData = cleanRepoData
})

// Compose the text describing the current set filters
const filterText = computed(() => {
  // If no filters are set return boilerplate text
  if (Object.values(state.fieldFilters).every(d => d.length === 0)) {
    return 'Showing resources for all counties'
  }
  const {county, age, services} = state.fieldFilters

  return 'Showing resources for '
    + `${county.length === 0 ? '' : `${county} County`}`
    + `${age.length === 0 ? '' : ', ' + `${age} age range`}`
    + `${services.length === 0 ? '' : ', ' + `${services} services`}`
})

// Watch for changes in filter values (fieldFilters) and update ResourceCards as necessary
watch(state.fieldFilters, (filters) => {
  // The filter fields
  const {county, age, services} = filters
  // The base filtered data, we will sequentially update this object by passing it through each filter
  let filteredData = state.fullRepoData
  if (county.length > 0) {
    // Filter repo data on selected county
    filteredData = filteredData.filter(resource => {
      console.log(resource)
        return resource.County.includes(county)
    })
  } else {
    // Remove county filter
  }

  if (age.length > 0) {
    // Filter repo data on selected age range
  } else {
    // Remove age filter
  }

  if (services.length > 0) {
    // Filter repo data on selected age range
  } else {
    // Remove services filter
  }

  // Update reactive filtered repo data with final filtered data
  state.filteredRepoData = filteredData
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
