<template>
  <header class="sticky top-0 z-20 w-screen border-b border-black bg-white">
    <div class="max-w-6xl mx-auto px-4 md:px-8 xl:p-0 flex flex-row items-center">
      <a class="w-32 md:w-16" href="https://sites.google.com/ncsu.edu/facesprogram/home" aria-label="FACES program homepage">
        <img class="object-contain" src="@/assets/faces-logo.png" alt="FACES program logo">
      </a>
      <h1 class="text-2xl md:text-4xl ml-4 font-bold">FACES Resources Repository</h1>
      <a class="ml-auto" href="https://sites.google.com/ncsu.edu/facesprogram/contact-us">Contact the FACES team</a>
    </div>
  </header>
  <div class="max-w-6xl mx-auto px-4 md:px-8 xl:p-0 flex flex-row">
    <nav
      class="hidden pt-6 lg:sticky lg:inline lg:h-screen lg:w-1/4 overflow-y-auto"
      :style="stickyTopOffset"
    >
      <SelectInput
        class="flex flex-col w-11/12"
        :groupName="'county'"
        :values="counties"
        v-model:selectedValue="state.selectedCounty.county"
      >
        <template #label>
          Go to specific county:
        </template>
        <template #default-value>
          Select a county
        </template>
      </SelectInput>
      <div>
        <h5 class="mt-8 font-semibold">Filter resources</h5>
        <SelectInput
          class="flex flex-col w-11/12"
          :groupName="'ages'"
          :values="STATIC_DATA.uniqueAgeGroups"
          v-model:selectedValue="state.fieldFilters.ageGroup"
        >
          <template #label>
            Age range:
          </template>
          <template #default-value>
            Select an age range
          </template>
        </SelectInput>
        <button
          class="italic"
          v-if="state.fieldFilters.ageGroup !== ''"
          @click="state.fieldFilters.ageGroup = ''">
          Remove age range filter
        </button>
        <fieldset class="mt-6">
          <legend class="mb-2">Select services:</legend>
          <div
            class=""
          >
            <div v-for="service in STATIC_DATA.uniqueServices" :key="service">
              <input
                class="mr-2"
                type="checkbox"
                name="services"
                :id="service"
                :value="service"
                v-model="state.fieldFilters.services"
                @change="serviceSelected"
              >
              <label :for="service">{{ service }}</label>
            </div>
          </div>
        </fieldset>
      </div>
    </nav>
    <main class="inline lg:left-1/4 lg:w-3/4">
      <p class="pt-6">Browse autism resources across North Carolina compiled by the FACES team.</p>
      <p class="mt-4">Resources are organized alphabetically by county. Use the filters to limit resource listings to specific criteria.</p>
      <div class="flex flex-row flex-wrap items-baseline sticky top-0 z-10 pt-2 bg-white">
        <div class="md:hidden w-full flex flex-row items-baseline mb-2">
          <label class="mr-2" for="county">Go to resources for a specific county:</label>
          <select
            class="w-min cursor-pointer border-2 border-gray-500 rounded-sm"
            @change="goToCountyListing"
            name="county_filter"
            id="county"
          >
            <option selected disabled value="">Select a county</option>
            <option
              v-for="county in counties"
              :key="county"
              :value="county"
            >
              {{ county }}
            </option>
          </select>
          <button
          class="md:hidden ml-auto font-semibold"
            @click="toggleFilterMenuVisibility"
          >Filter resources</button>  
        </div>
        <!-- <transition name="vert-slide">
          <FilterUI
            class="w-full absolute top-full flex flex-row items-start justify-around md:hidden overflow-hidden bg-white border-2 border-t-0 border-gray-600 rounded-lg rounded-t-none"
            v-if="state.showFilters"
            v-model:ageGroupFilter="state.fieldFilters.ageGroup"
            v-model:servicesGroupFilter="state.fieldFilters.services"
            :uniqueAgeGroups="STATIC_DATA.uniqueAgeGroups"
            :uniqueServices="STATIC_DATA.uniqueServices"
            @closeFilterMenu="state.showFilters = false"
          />
        </transition> -->
      </div>
      <div class="flex flex-col">
        <div
          v-for="county in counties.sort()"
          :key="county"
          :id="county"
        >
          <div class="sticky w-full px-2 text-gray-100 bg-gray-900 border-b border-black flex flex-wrap justify-between items-center" :style="stickyTopOffset">
            <h2 class="font-semibold">
              {{ county }} County
            </h2>
            <div class="flex flex-col items-end">
              <span>Showing {{ filterByCounty(county).length }} of {{ STATIC_DATA.countyResourceCount[county] }} resources</span>
              <button
                class="font-semibold hover:text-purple-200"
                @click="removeAllFilters"
                v-show="dataIsFiltered"
              >Remove all filters</button>
            </div>
          </div>
          
          <ResourceListing
            class="px-2"
            v-for="resource in filterByCounty(county)"
            :key="resource.id"
            :resource="resource"
          />
          <div v-show="filterByCounty(county).length === 0">
            <p class="my-4">
              There are no resources in {{ county }} county that meet your filter criteria. Remove filters to view the resources in this county.
            </p>
          </div>
        </div>
      </div>
    </main>
    <!-- <footer class="col-start-4 col-span-9">
      <h2>Full data table (for testing)</h2>
      <TheDataTable
        :allRepoData="state.fullRepoData"
        :filteredRepoDataIDs="state.filteredRepoData.map(d => d.id)"
      />
    </footer> -->
  </div>
</template>

<script setup>
import { reactive, watch, onBeforeMount, computed, onMounted } from 'vue'

// Import child components
// import FilterUI from './components/FilterUI.vue'
import ResourceListing from './components/ResourceListing.vue'
import SelectInput from './components/SelectInput.vue'


// Import composables
import { cleanRawFACESData } from './composables/clean-FACES-data'
import { runOnResize } from './composables/handle-resize'

// Import the FACES repository data (currently a locally stored test CSV file)
import rawRepoData from './assets/data/MasterListRepository_12-10-21.csv'
import { counties } from './assets/data/NC-counties.json'

// Static data
const STATIC_DATA = {
  uniqueAgeGroups: [],
  uniqueServices: [],
  countyResourceCount: {}
}

// Reactive data
const state = reactive({
  // The full dataset for the repository
  fullRepoData: {},
  // The filtered dataset for display in the application
  filteredRepoData: {},
  // The field values used to filter the dataset
  fieldFilters: {
    ageGroup: '',
    services: []
  },
  selectedCounty: { county: '' },
  showFilters: false,
  stickyTopOffset: 0
})

// Calculate the offset for sticky elements (county labels and desktop nav)
const calculateStickyOffset = () => {
  const headerElement = document.querySelector('header')
  state.stickyTopOffset = headerElement.getBoundingClientRect().height
}

// Use computed property to set new offset on "stickyTopOffset" value change
const stickyTopOffset = computed(() => {
    return {
      top: state.stickyTopOffset + 'px'
    }
})

// Clean, reformat, and pass the CSV data into the data stores before the component is mounted
onBeforeMount(() => {
  // Clean the data
  const cleanedRepoData = cleanRawFACESData(rawRepoData)

  state.fullRepoData = cleanedRepoData.cleanData
  state.filteredRepoData = cleanedRepoData.cleanData

  STATIC_DATA.uniqueAgeGroups = cleanedRepoData.uniqueAgeGroups
  STATIC_DATA.uniqueServices = cleanedRepoData.uniqueServices
  STATIC_DATA.countyResourceCount = cleanedRepoData.totalResourcesByCounty

  // Add window resize event listener to run sticky elements offset calculation when screen size changes
  runOnResize(calculateStickyOffset)
})

onMounted(() => {
  // Set the initial offset for sticky elements (county labels and desktop nav)
  calculateStickyOffset()
})

// Scroll to the selected county section when county selector is updated
watch(state.selectedCounty, (county) => {
  const scrollToElement = document.getElementById(county.county)
  window.scrollTo(0, scrollToElement.getBoundingClientRect().top + window.pageYOffset - state.stickyTopOffset)
})

const dataIsFiltered = computed(() => {
  return state.fullRepoData.length !== state.filteredRepoData.length
})

// Toggle showing the filter menu
const toggleFilterMenuVisibility = () => {
  state.showFilters = !state.showFilters
}

// Set the filter values to empty string (ageGroup) or empty array (services)
const removeAllFilters = () => {
  state.fieldFilters.ageGroup = ''
  state.fieldFilters.services = []
}

// Watch for changes in filter values (fieldFilters) and update ResourceCards as necessary
watch(state.fieldFilters, (filters) => {
  // The filter fields
  const {ageGroup, services} = filters
  // The base filtered data, we will sequentially update this object by passing it through each filter
  let filteredData = state.fullRepoData

  // If filter is set on age group, repo data on selected age range
  if (ageGroup.length > 0) {
    filteredData = filteredData.filter(resource => {
      let [ageCat, ] = ageGroup.split(' (')
      // console.log(resource['Age categories'], ageNum)
      if (resource['Age categories']) {
        return resource['Age categories'].toLowerCase()
          .includes(ageCat.toLowerCase())
      }
    })
  }

  // If filter is set on services, repo data on selected services
  if (services.length > 0) {
    filteredData = filteredData.filter(resource => {
      return services.every(service => resource.services.includes(service))
    })
  }

  // Update reactive filtered repo data with final filtered data
  state.filteredRepoData = filteredData
})

// Filter resources by county to update the resource listing section
const filterByCounty = (county) => {
  return state.filteredRepoData.filter(d => d.County.includes(county))
}
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
  transition-timing-function: ease-in;
  max-height: 200px;
}

.vert-slide-enter-from,
.vert-slide-leave-to {
  /* transform: translateY(-100%); */
  display: inline;
  max-height: 0;
}
</style>
