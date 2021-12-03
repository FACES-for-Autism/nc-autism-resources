<template>
  <div class="flex flex-col">
    <label class="mb-2" for="county">Filter resources by county:</label>
    <select
      class="w-min mb-5 border-2 border-gray-500 rounded-sm"
      @change="countySelected"
      v-model="selectedCounty"
      name="county_filter"
      id="county"
    >
      <option disabled value="">Select a county</option>
      <option v-for="(county, i) in counties" :key="i" :value="county">
        {{ county }}
      </option>
    </select>
    <button v-if="selectedCounty !== ''" @click="selectedCounty = ''">
      Remove county filter
    </button>
    <label class="mb-2" for="age">Filter resources by ages served:</label>
    <select
      class="w-min mb-5 border-2 border-gray-500 rounded-sm"
      @change="ageGroupSelected"
      v-model="selectedAgeGroup"
      name="age_filter"
      id="age"
    >
      <option disabled value="">Select an age range</option>
      <option
        v-for="(ageGroup, i) in uniqueAgeGroups"
        :key="i"
        :value="ageGroup"
      >{{ ageGroup }}</option>
    </select>
    <button v-if="selectedAgeGroup !== ''" @click="selectedAgeGroup = ''">
      Remove age range filter
    </button>
    <fieldset>
      <legend class="mb-2">Filter resources by provided services:</legend>
      <template

      >
        <input type="checkbox" name="services" id="">
      </template>
    </fieldset>
  </div>
</template>

<script setup>
/* global defineProps defineEmits */  
import { ref } from 'vue'
import countiesObj from '../assets/data/NC-counties.json'

// An alphabetical list of the counties in NC
const counties = countiesObj.counties

// Reactive data to model filter selections
const selectedCounty = ref('')
const selectedAgeGroup = ref('')

defineProps({
  countyFilter: {
    type: String
  },
  ageGroupFilter: {
    type: String
  },
  uniqueAgeGroups: {
    type: Array
  }
})

const emit = defineEmits(['update:countyFilter', 'update:ageGroupFilter'])

function countySelected() {
  emit('update:countyFilter', selectedCounty)
}

function ageGroupSelected() {
  emit('update:ageGroupFilter', selectedAgeGroup)
}
</script>

<style scoped>

</style>