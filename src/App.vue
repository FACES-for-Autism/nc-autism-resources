<template>
  <header class="sticky top-0 z-20 w-screen border-b border-black bg-gray-800">
    <div class="max-w-6xl mx-auto px-2 pt-2 sm:pt-0 sm:px-4 md:px-8 xl:p-0 flex flex-row flex-wrap items-center">
      <div class="flex flex-row items-center w-full sm:w-max">
        <a class="" href="https://sites.google.com/ncsu.edu/facesprogram/home" aria-label="FACES program homepage">
          <img class="object-contain" width="75" src="@/assets/faces-logo.png" alt="FACES program logo">
        </a>
        <OpenGuideButton
          class="ml-auto sm:hidden text-white"
          @openModal="state.showModal = true"
        />
      </div>
      <h1 class="font-semibold sm:font-normal sm:ml-4 text-white">North Carolina Autism Resources</h1>
      <OpenGuideButton
        class="hidden sm:block ml-auto text-white"
        @openModal="state.showModal = true"
      />
    </div>
  </header>
  <div class="max-w-6xl mx-auto sm:px-4 md:px-8 xl:p-0 flex flex-row">
    <button 
      aria-label="Open navigation menu"
      class="fixed z-30 right-4 bottom-4 p-3 lg:hidden rounded-full bg-gray-800 text-white cursor-pointer"
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
      class="py-6 pl-4 fixed w-8/12 top-0 bottom-0 left-0 z-50 border-r border-gray-800 sm:w-2/5 md:w-4/12 lg:sticky lg:z-0 lg:w-1/4 lg:h-screen lg:pl-0 lg:border-none bg-white overflow-y-scroll"
      :style="'top:' + state.stickyTopOffset + 'px'"
      v-show="state.isDesktopDevice || state.navIsVisible"
    >
      <h4 class="font-semibold">Select county</h4>
      <SelectInput
        class="flex flex-col w-11/12 xl:w-10/12 mt-4 pb-8 border-b border-gray-200"
        :groupName="'county'"
        :values="counties"
        v-model:selectedValue="state.selectedCounty.county"
      >
        <template #label>
          Go to resources for a county:
        </template>
        <template #default-value>
          Select a county
        </template>
      </SelectInput>
      <div>
        <h4 class="mt-6 font-semibold">Filter resources</h4>
        <SelectInput
          class="flex flex-col w-11/12 xl:w-10/12 mt-4"
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
          class="mt-2 italic hover:text-red-400"
          v-if="state.fieldFilters.ageGroup !== ''"
          @click="state.fieldFilters.ageGroup = ''">
          Clear age range filter
        </button>
        <fieldset class="mt-8">
          <legend class="mb-2">Select services:</legend>
          <div>
            <div v-for="service in STATIC_DATA.uniqueServices" :key="service">
              <input
                class="mt-2 mr-2 cursor-pointer"
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
        <button
          class="mt-2 italic hover:text-red-400"
          v-if="state.fieldFilters.services.length > 0"
          @click="state.fieldFilters.services = []">
          Clear services filter
        </button>
      </div>
    </nav>
    <main class="inline w-full lg:left-1/4 lg:w-3/4">
      <h2 class="pt-4 px-2 font-semibold">About</h2>
      <p class="mt-4 px-2">Browse autism resources available in North Carolina compiled by the FACES (Fostering Advocacy, Communication, Empowerment, and Support) program. Visit the <a href="https://sites.google.com/ncsu.edu/facesprogram/home">FACES program website</a> to learn more about FACES.</p>
      <p class="my-4 px-2">Resources are organized alphabetically by county. Use the navigation menu to access resources for a particular county.</p>
      <p class="my-4 px-2">You can also the navigation menu to filter resources based on age ranges served and services offered by a resource.</p>
      <div v-if="state.loading" class="flex flex-col items-center justify-center w-full">
        <PageLoading/>
      </div>
      <div v-else class="flex flex-col">
        <div
          v-for="county in counties.sort()"
          :key="county"
          :id="county"
        >
          <CountyResourcesList
            :fullCountyResources="filterResourcesByCounty(county)"
            :filteredIDs="state.filteredIDs"
            :countyHeaderOffset="state.stickyTopOffset"
            @removeAllFilters="removeAllFilters"
          />
        </div>
      </div>
    </main>
    <div 
      class="fixed w-screen h-screen left-0 overflow-hidden z-20 bg-gray-500 bg-opacity-60"
      @click="toggleMenuVisibility"
      v-show="!state.isDesktopDevice && state.navIsVisible"
    ></div>
  </div>
  <GuideModal
    :class="{'hidden': !state.showModal}"
    @closeModal="state.showModal = false"
  />
</template>

<script setup>
import { reactive, watch, onBeforeMount, onMounted } from 'vue'
import axios from 'axios'

// Import child components
// import FilterUI from './components/FilterUI.vue'
import CountyResourcesList from './components/CountyResourcesList.vue'
import SelectInput from './components/SelectInput.vue'
import PageLoading from './components/PageLoading.vue'
import GuideModal from './components/GuideModal.vue'
import OpenGuideButton from './components/OpenGuideButton.vue'


// Import composables
import { parseResourcesData } from './composables/parse-and-clean-csv'
import { runOnResize } from './composables/handle-resize'

// Import the FACES repository data (currently a locally stored test CSV file)
import { counties } from './assets/data/NC-counties.json'

// Static data
const STATIC_DATA = {
  fullCountyData: [],
  uniqueResources: [],
  uniqueAgeGroups: [
    'Infants and Toddlers (0-2 years)',
    'Preschoolers (3-5 years)',
    'Children (6-12 years)',
    'Adolescents (13-17 years)',
    'Adults (18+ years)'
  ],
  uniqueServices: [
    'ABA Services',
    'Early Intervention',
    'Speech Therapy',
    'Physical Therapy',
    'Occupational Therapy',
    'Community Transitions',
    'Community Living',
    'Parenting Education',
    'Advocacy Support',
    'IEP Support Services',
    'In-School Services',
    'Support Groups',
    'Residential Services',
    'Medical Provider',
    'Hospital Treatments',
    'Mentorship',
    'Referrals'
  ]
}

// Reactive data
const state = reactive({
  // The field values used to filter the dataset
  fieldFilters: {
    ageGroup: '',
    services: []
  },
  filteredIDs: [],
  selectedCounty: { county: '' },
  navIsVisible: false,
  stickyTopOffset: 0,
  isDesktopDevice: false,
  loading: true,
  showModal: true
})

const filterResourcesByCounty = (county) => {
  return STATIC_DATA.fullCountyData.filter(d => d.county === county)[0]
}

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

// Clean, reformat, and pass the CSV data into the data stores before the component is mounted
onBeforeMount(() => {
  // Add window resize event listener to run methods when screen size changes
  runOnResize(() => {
    setWidthDependentElements()
    if (state.navIsVisible && state.isDesktopDevice) {
      toggleMenuVisibility()
    }
  })
})

onMounted(() => {
  // Location of published Google Sheet containing the repository data as a csv file
  const DATA_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQjyogOZCRZpfXJQ--wYWuhFpe-GIZRJsg7DZjWsiCycgDKtV7t21Pb8GlIZeMnWxl3hFQYZtuXE4i/pub?gid=29192816&single=true&output=csv'

  // Fetch the data and pass it to the parser and generate static and dynamic state data
  axios.get(DATA_URL).then((response) => {
    parseResourcesData(response.data).then((cleanData) => {
      // A list of unique resources and their data
      STATIC_DATA.uniqueResources = cleanData

      // Create object with all resource information grouped by each county
      STATIC_DATA.fullCountyData = counties.map(county => {
        return {
          county: county,
          resources: cleanData.filter(data => 
            data.CountiesServed.includes(county)
          ).sort((a, b) => {
            if (a.Name < b.Name) {
              return -1
            } else if (a.Name > b.Name) {
              return 1
            }
            return 0
          })
        }
      })

      // Generate list of resource unique IDs for use in filtering
      state.filteredIDs = cleanData.map(
        resource => resource.id
      )
      state.loading = false
    })
  })

  // Set the initial offset for sticky elements (county labels and desktop nav)
  setWidthDependentElements()
})

// Scroll to the selected county section when county selector is updated
watch(state.selectedCounty, (county) => {
  const scrollToElement = document.getElementById(county.county)
  window.scrollTo(0, scrollToElement.getBoundingClientRect().top + window.pageYOffset - state.stickyTopOffset)
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

// Watch for changes in filter values (fieldFilters) and update resource listings as necessary
watch(state.fieldFilters, (filters) => {
  // The initial, unfiltered data
  let filteredData = STATIC_DATA.uniqueResources

  // If filter is set on age group, filter data on selected age range
  if (filters.ageGroup.length > 0) {
    filteredData = filteredData.filter(resource => {
      return resource.AgeGroups.includes(filters.ageGroup)
    })
  }

  // If filter is set on services, filter data on selected services
  if (filters.services.length > 0) {
    filteredData = filteredData.filter(resource => {
      return filters.services.every(
        service => resource.Services.includes(service)
      )
    })
  }

  // Update the filtered IDs to trigger resource listing update
  state.filteredIDs = filteredData.map(resource => resource.id)
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
