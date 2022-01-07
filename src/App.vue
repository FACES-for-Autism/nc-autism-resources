<template>
  <header class="sticky top-0 z-20 w-screen border-b border-black bg-gray-800">
    <div class="max-w-6xl mx-auto px-2 pt-2 sm:pt-0 sm:px-4 md:px-8 xl:p-0 flex flex-row flex-wrap items-center">
      <div class="flex flex-row items-center w-full sm:w-max">
        <a class="" href="https://sites.google.com/ncsu.edu/facesprogram/home" aria-label="FACES program homepage">
          <img class="object-contain" width="75" src="@/assets/faces-logo.png" alt="FACES program logo">
        </a>
        <a class="ml-auto sm:hidden font-semibold text-white hover:text-white" href="https://sites.google.com/ncsu.edu/facesprogram/contact-us">Contact FACES</a>
      </div>
      
      <h1 class="sm:ml-4 text-white">Autism Resources Repository</h1>
      <a class="w-min ml-auto hidden sm:block font-semibold text-white hover:text-white" href="https://sites.google.com/ncsu.edu/facesprogram/contact-us">Contact FACES</a>
    </div>
  </header>
  <div class="max-w-6xl mx-auto sm:px-4 md:px-8 xl:p-0 flex flex-row">
    <button 
      aria-label="Open navigation menu"
      class="fixed z-50 right-4 bottom-4 p-3 lg:hidden rounded-full bg-gray-800 text-white cursor-pointer"
      @click="toggleMenuVisibility"
    >
      <svg v-show="!state.navIsVisible" aria-hidden="true" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
      <svg v-show="state.navIsVisible" aria-hidden="true" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    <nav
      class="py-6 pl-4 fixed w-8/12 bottom-0 left-0 z-50 border-r border-black sm:w-2/5 md:w-4/12 lg:sticky lg:inline lg:w-1/4 lg:h-screen lg:pl-0 lg:border-none bg-white overflow-y-scroll"
      :style="stickyTopOffset"
      v-show="state.isDesktopDevice || state.navIsVisible"
    >
      <SelectInput
        class="flex flex-col w-11/12 xl:w-10/12"
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
          class="flex flex-col w-11/12 xl:w-10/12"
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
        <fieldset class="my-6">
          <legend class="mb-2">Select services:</legend>
          <div
            class=""
          >
            <div v-for="service in STATIC_DATA.uniqueServices" :key="service">
              <input
                class="mr-2 cursor-pointer"
                type="checkbox"
                name="services"
                :id="service"
                :value="service"
                v-model="state.fieldFilters.services"
                @change="serviceSelected"
              >
              <label class="cursor-pointer" :for="service">{{ service }}</label>
            </div>
          </div>
        </fieldset>
      </div>
    </nav>
    <main class="inline w-full lg:left-1/4 lg:w-3/4">
      <h2 class="pt-4 px-2 font-semibold">About</h2>
      <p class="mt-4 px-2">Browse autism resources across North Carolina compiled by the FACES team.</p>
      <p class="my-4 px-2">Resources are organized alphabetically by county. Use the filters to limit resource listings to specific criteria.</p>
      <div class="flex flex-row flex-wrap items-baseline sticky top-0 z-10 pt-2 bg-white">
      </div>
      <div class="flex flex-col">
        <div
          v-for="county in counties.sort()"
          :key="county"
          :id="county"
        >
          <div class="sticky w-full px-2 text-gray-900 bg-gray-100 border-b border-gray-200 flex flex-wrap justify-between items-baseline sm:items-center" :style="stickyTopOffset">
            <h2 class="mr-2 sm:mr-0 font-semibold">
              {{ county }} County
            </h2>
            <div class="flex flex-row sm:flex-col items-end mb-2 sm:mb-0">
              <span>{{ filterByCounty(county).length }} of {{ STATIC_DATA.countyResourceCount[county] }} resources</span>
              <button
                class="ml-2 sm:ml-0 font-semibold hover:text-blue-400"
                @click="removeAllFilters"
                v-show="dataIsFiltered"
              >Remove filters</button>
            </div>
          </div>
          
          <ResourceListing
            class="px-2 pb-8 border-b border-gray-200"
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
    <div 
      class="fixed w-screen h-screen left-0 overflow-hidden z-40 bg-gray-500 bg-opacity-60"
      @click="toggleMenuVisibility"
      v-show="!state.isDesktopDevice && state.navIsVisible"
    ></div>
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
  navIsVisible: false,
  stickyTopOffset: 0,
  isDesktopDevice: false
})

// Calculate the offset for sticky elements (county labels and desktop nav)
const setWidthDependentElements = () => {
  // Calculate the offset for sticky elements (county labels and desktop nav)
  const headerElement = document.querySelector('header')
  state.stickyTopOffset = headerElement.getBoundingClientRect().height

  // Prevent nav menu from being hidden on desktop devices
  if (window.innerWidth >= 1024) {
    state.isDesktopDevice = true
  } else {
    state.isDesktopDevice = false
  }
}

// Use computed property to set new "top" style value when "stickyTopOffset" value changes
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

  // Add window resize event listener to run methods when screen size changes
  runOnResize(() => {
    setWidthDependentElements()
    if (state.navIsVisible && state.isDesktopDevice) {
      toggleMenuVisibility()
    }
  })
})

onMounted(() => {
  // Set the initial offset for sticky elements (county labels and desktop nav)
  setWidthDependentElements()
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
const toggleMenuVisibility = () => {
  state.navIsVisible = !state.navIsVisible
  if (state.navIsVisible && !state.isDesktopDevice) {
    document.querySelector('body').classList.add('overflow-y-hidden')
  } else {
    document.querySelector('body').classList.remove('overflow-y-hidden')
  }
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
</style>
