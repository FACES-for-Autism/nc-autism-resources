<template>
  <div class="grid grid-cols-12 container mx-auto">
    <header class="col-span-12 flex flex-row items-center">
      <a class="w-20" href="https://sites.google.com/ncsu.edu/facesprogram/home" aria-label="FACES program homepage">
        <img class="object-contain" src="@/assets/faces-logo.png" alt="FACES program logo">
      </a>
      <h1 class="ml-4 font-bold">FACES Resources Repository</h1>
      <a class="ml-auto" href="https://sites.google.com/ncsu.edu/facesprogram/contact-us">Contact the FACES team</a>
    </header>
    <main class="col-span-12 md:col-start-3 md:col-span-8">
      <div id="resource-list-header" class="flex flex-row flex-wrap items-baseline sticky top-0 mb-2 py-2 bg-white">
        <h2 class="w-full font-bold">Resource listing</h2>
        <label class="mr-2" for="county">Jump to a specific county:</label>
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
        <div class="ml-auto">
          <button
          class="font-semibold"
            @click="toggleFilterMenuVisibility"
          >Filter resources</button>
        </div>
        <transition name="vert-slide">
            <FilterUI
              class="w-full flex flex-row items-start justify-around mt-4 overflow-hidden"
              v-if="state.showFilters"
              v-model:ageGroupFilter="state.fieldFilters.ageGroup"
              :uniqueAgeGroups="state.uniqueAgeGroups"
              :uniqueServices="state.uniqueServices"
            />
        </transition>
        <div class="w-full mt-2 border-t-2 border-gray-500">
          <p class="inline mr-2">{{ filterText }}</p>
          <button
            class="italic"
            @click="removeAllFilters"
            v-show="filterText !== DEFAULT_FILTER_TEXT"
          >Remove all filters</button>
        </div>
      </div>
      <div class="flex flex-col">
        <div
          class="mx-2 mb-2 p-2 border-2 border-gray-100 shadow-md rounded-md"
          v-for="county in state.uniqueCounties.sort()"
          :key="county"
          :id="county"
        >
          <div class="">
            <h3 class="text-gray-900 font-semibold bg-white">
              <!-- <a
                :href="'#' + county"
                class="text-gray-900 font-semibold no-underline"
              > -->
                {{ county }}
              <!-- </a> -->
            </h3>
          </div>
          <ResourceListing
            v-for="resource in filterByCounty(county)"
            :key="resource.id"
            :resource="resource"
          />
          <div v-if="filterByCounty(county).length === 0">
            <p>
              There are no resources in {{ county }} county that meet your filter criteria. Remove filters to view the resources in this county.
            </p>
          </div>
        </div>
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
import ResourceListing from './components/ResourceListing.vue'
import TheDataTable from './components/TheDataTable.vue'

// Import the data source (currently a locally stored test CSV file)
import rawRepoData from './assets/data/sample-repo-Duplin.csv'

const DEFAULT_FILTER_TEXT = 'Showing all resources'

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
  uniqueCounties: [],
  uniqueServices: [],
  showFilters: false
})

// Clean, reformat, and pass the CSV data into the reactive data store before the component is mounted
onBeforeMount(() => {
  // Remove leading/trailing whitespace in string data and add an id key to each entry in the dataset
  const cleanRepoData = rawRepoData.map((resource, i) => {
    // Add id parameter to each resource object and an empty array to hold a list of services from the data
    let cleanResource = {
      id: i,
      services: []
    }

    Object.entries(resource).forEach(d => {
      // Some string values may have leading or trailing whitespace, trim these
      cleanResource[d[0].trim()] = typeof(d[1]) === 'string'
        ? d[1].trim() : d[1]

      // If the parameter value of the resource is a string and the value is "yes", add the parameter name (i.e., the service name) to the list of services
      if (
        typeof(d[1]) === 'string' 
        && d[1].toLowerCase() === 'yes'
      ) {
        // NOTE: split is to remove " (Yes or No)" text from first service parameter name
        cleanResource.services.push(d[0].split(' (Yes or No)')[0])
      }
    })

    return cleanResource
  });

  state.fullRepoData = cleanRepoData
  state.filteredRepoData = cleanRepoData

  // Get the unique age groups from the repo dataset for the age filter select
  state.uniqueAgeGroups = [
    ...new Set(cleanRepoData.map(d => d['Ages listed']))
  ]

  // Get the unique counties from the repo dataset for the county select
  state.uniqueCounties = [
    ...new Set(cleanRepoData.map(d => d['County'].split(' (serves)')[0]))
  ]

  // Get the unique services from the repo dataset for the services filter select
  state.uniqueServices = [
    ...new Set(
      cleanRepoData.map(d => d['services']).reduce(
        (prev, current) => prev.concat(current), []
      )
    )
  ]
})

// Jump to the selected county section
const goToCountyListing = (e) => {
  const resourceListDivOffset = document.getElementById('resource-list-header')
    .getBoundingClientRect().height
  const scrollToElement = document.getElementById(e.target.value)
  window.scrollTo(0, scrollToElement.getBoundingClientRect().top + window.pageYOffset - resourceListDivOffset)
}

// Toggle showing the filter menu
const toggleFilterMenuVisibility = () => {
  state.showFilters = !state.showFilters
}

// Compose the text describing the current set filters
const filterText = computed(() => {
  // If no filters are set return boilerplate text
  if (Object.values(state.fieldFilters).every(d => d.length === 0)) {
    return DEFAULT_FILTER_TEXT
  }
  const {ageGroup, services} = state.fieldFilters

  return 'Resources filtered on '
    + `${ageGroup.length === 0 ? '' : `${ageGroup} age range`}`
    // + `${ageGroup.length === 0 && services.length === 0}` ? '' : ' and '
    + `${services.length === 0 ? '' : `${services} services`}`
})

// Set the filter values to empty string (ageGroup) or empty array (services)
const removeAllFilters = () => {
  state.fieldFilters.ageGroup = ''
  state.fieldFilters.services = []
}

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
    // Filter repo data on selected services
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

.vert-slide-enter-active,
.vert-slide-leave-active {
  transition-property: all;
  transition-duration: 0.3s;
  transition-timing-function: ease-in-out;
  max-height: 200px;
}

.vert-slide-enter-from,
.vert-slide-leave-to {
  /* transform: translateY(-100%); */
  display: inline;
  max-height: 0;
}
</style>
