<template>
  <div class="sticky top-0 w-full px-2 text-gray-900 bg-gray-100 border-b border-gray-200 flex flex-wrap justify-between items-baseline sm:items-center" :style="{top: props.countyHeaderOffset + 'px'}">
    <h2 class="mr-2 sm:mr-0 font-semibold">
      {{ fullCountyResources.county }} County
    </h2>
    <div class="flex flex-row sm:flex-col items-end mb-2 sm:mb-0">
      <span>Showing {{ filterByID.length }} of {{ fullCountyResources.resources.length }} resources</span>
      <button
        class="ml-2 sm:ml-0 font-semibold hover:text-red-400"
        @click="removeAllFilters"
        v-show="dataIsFiltered"
      >Clear filters</button>
    </div>
  </div>
  <ResourceListing
    class="px-2 pb-8 border-b border-gray-200"
    v-for="resource in filterByID"
    :key="resource.id"
    :resource="resource"
  />
  <div v-show="filterByID.length === 0">
    <p class="px-2 my-4">
      There are no resources in {{ fullCountyResources.county }} county that meet your filter criteria. Clear filters to view the resources in this county.
    </p>
  </div>
</template>

<script setup>
/* eslint-disable no-undef */
import { computed } from 'vue'

import ResourceListing from './ResourceListing.vue'

const props = defineProps({
  countyHeaderOffset: {
    type: Number,
    required: true
  },
  fullCountyResources: {
    type: Object,
    required: true
  },
  filteredIDs: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['removeAllFilters'])

// Set the filter values (ageGroup, services) to empty arrays
function removeAllFilters() {
  emit('removeAllFilters')
}

const filterByID = computed(() => {
  const filteredResources = props.fullCountyResources.resources
    .filter(resource => 
      props.filteredIDs.includes(resource.id)
    )
  return filteredResources
})

const dataIsFiltered = computed(() => {
  return filterByID.value.length !== props.fullCountyResources.resources.length
})
</script>