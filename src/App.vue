<template>
  <div class="grid grid-cols-12 container mx-auto">
    <header class="col-span-12 flex flex-row items-center">
      <a class="w-20" href="https://sites.google.com/ncsu.edu/facesprogram/home" aria-label="FACES program homepage">
        <img class="object-contain" src="@/assets/faces-logo.png" alt="FACES program logo">
      </a>
      <h1 class="ml-4 font-bold">FACES Resources Repository</h1>
      <a class="ml-auto" href="https://sites.google.com/ncsu.edu/facesprogram/contact-us">Contact the FACES team</a>
    </header>
    <aside class="col-span-12 md:col-span-3 md:h-screen sticky top-0 bg-white">
      <FilterUI
        v-model:ageGroupFilter="state.fieldFilters.ageGroup"
        :uniqueAgeGroups="state.uniqueAgeGroups"
      />
    </aside>
    <main class="col-span-12 md:col-start-4 md:col-span-9 ">
      <div id="resource-list" class="flex flex-row flex-wrap items-baseline sticky top-0 bg-white">
        <h2 class="font-bold">Resource listing</h2>
        <label class="ml-auto mr-2" for="county">Jump to a specific county:</label>
        <select
          class="w-min border-2 border-gray-500 rounded-sm"
          @change="goToCountyListing"
          name="county_filter"
          id="county"
        >
          <option selected disabled value="">Select a county</option>
          <option
            v-for="county in state.uniqueCounties"
            :key="county"
            :value="county"
          >
            {{ county }}
          </option>
        </select>
        <p class="w-full">{{ filterText }}</p>
      </div>
      <div class="flex flex-col">
        <template
          v-for="county in state.uniqueCounties.sort()"
          :key="county"
        >
          <h3 :id="county" class="text-gray-900 font-semibold">
            <!-- <a
              :href="'#' + county"
              class="text-gray-900 font-semibold no-underline"
            > -->
              {{county}}
            <!-- </a> -->
          </h3>
          <ResourceCard
            v-for="resource in filterByCounty(county)"
            :key="resource.id"
            :resource="resource"
          />
        </template>
      </div>
    </main>
    <footer class="col-start-4 col-span-9">
      <h2>Full data table (for testing)</h2>
      <TheDataTable
        :allRepoData="state.fullRepoData"
        :filteredRepoDataIDs="state.filteredRepoData.map(d => d.id)"
      />
    </footer>
  </div>
</template>

<script setup>
import { reactive, watch, onBeforeMount, computed } from 'vue'

// Import child components
import FilterUI from './components/FilterUI.vue'
import ResourceCard from './components/ResourceCard.vue'
import TheDataTable from './components/TheDataTable.vue'

// Import the data source (currently a locally stored test CSV file)
import rawRepoData from './assets/data/sample-repo-Duplin.csv'

// Create reactive data
const state = reactive({
  // The full dataset for the repository
  fullRepoData: {},
  // The filtered dataset for display in the application
  filteredRepoData: {},
  // The field values used to filter the dataset
  fieldFilters: {
    'ageGroup': '',
    'services': []
  },
  uniqueAgeGroups: [],
  uniqueCounties: []
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

  // Get the unique age groups for the age filter select
  state.uniqueAgeGroups = [
    ...new Set(cleanRepoData.map(d => d['Ages listed']))
  ]

  // Get the unique counties from the repo dataset
  state.uniqueCounties = [
    ...new Set(cleanRepoData.map(d => d['County'].split(' (serves)')[0]))
  ]
})

// Jump to the selected county anchor
const goToCountyListing = (e) => {
  const yOffset = document.querySelector('header')
    .getBoundingClientRect().height
  const scrollToElement = document.getElementById(e.target.value)
  window.scrollTo(0, scrollToElement.getBoundingClientRect().top + window.pageYOffset - yOffset - 8)
}

// Compose the text describing the current set filters
const filterText = computed(() => {
  // If no filters are set return boilerplate text
  if (Object.values(state.fieldFilters).every(d => d.length === 0)) {
    return 'No filters set'
  }
  const {ageGroup, services} = state.fieldFilters

  return 'Resources filtered on '
    + `${ageGroup.length === 0 ? '' : `${ageGroup} age range`}`
    // + `${ageGroup.length === 0 && services.length === 0}` ? '' : ' and '
    + `${services.length === 0 ? '' : `${services} services`}`
})

// Filter resources by county to format the resource listing section
const filterByCounty = (county) => {
  return state.filteredRepoData.filter(d => d.County.includes(county))
}

// Watch for changes in filter values (fieldFilters) and update ResourceCards as necessary
watch(state.fieldFilters, (filters) => {
  // The filter fields
  const {ageGroup, services} = filters
  // The base filtered data, we will sequentially update this object by passing it through each filter
  let filteredData = state.fullRepoData

  if (ageGroup.length > 0) {
    // Filter repo data on selected age range
    filteredData = filteredData.filter(resource => {
      return resource['Ages listed'] === ageGroup
    })
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
