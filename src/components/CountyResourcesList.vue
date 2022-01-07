<template>
  <div class="sticky top-0 w-full px-2 text-gray-900 bg-gray-100 border-b border-gray-200 flex flex-wrap justify-between items-baseline sm:items-center" :style="{top: props.countyHeaderOffset + 'px'}">
    <h2 class="mr-2 sm:mr-0 font-semibold">
      {{ countyName }} County
    </h2>
    <div class="flex flex-row sm:flex-col items-end mb-2 sm:mb-0">
      <span>Showing {{ filterByCounty(countyName).length }} of {{ resourceCount[countyName] }} resources</span>
      <button
        class="ml-2 sm:ml-0 font-semibold hover:text-red-400"
        @click="removeAllFilters"
        v-show="dataIsFiltered"
      >Remove filters</button>
    </div>
  </div>
  <ResourceListing
    class="px-2 pb-8 border-b border-gray-200"
    v-for="resource in filterByCounty(countyName)"
    :key="resource.id"
    :resource="resource"
  />
  <div v-show="filterByCounty(countyName).length === 0">
    <p class="my-4">
      There are no resources in {{ countyName }} county that meet your filter criteria. Remove filters to view the resources in this county.
    </p>
  </div>
</template>

<script setup>
/* eslint-disable no-undef */
import { computed } from 'vue'

import ResourceListing from './ResourceListing.vue'

const props = defineProps({
  countyName: {
    type: String,
    required: true
  },
  resourceCount: {
    type: Object,
    required: true
  },
  filteredRepoData: {
    type: Object,
    required: true
  },
  fullRepoDataLength: {
    type: Number,
    required: true
  },
  countyHeaderOffset: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['removeAllFilters'])

// Set the filter values to empty string (ageGroup) or empty array (services)
function removeAllFilters() {
  emit('removeAllFilters')
}

// Filter resources by county to update the resource listing section
const filterByCounty = (county) => {
  return props.filteredRepoData.filter(d => d.County.includes(county))
}

const dataIsFiltered = computed(() => {
  return props.fullRepoDataLength !== props.filteredRepoData.length
})
</script>