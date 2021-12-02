<template>
  <label for="county">Filter data by county:</label>
  <select
    @change="countySelected"
    v-model="selectedCounty"
    name="county_filter"
    id="county"
  >
    <option disabled value="">Select a county</option>
    <option
      v-for="(county, i) in counties"
      :key="i"
      :value="county"
    >{{ county }}</option>
  </select>
</template>

<script setup>
/* global defineProps defineEmits */  
import { ref } from 'vue'
import countiesObj from '../assets/data/NC-counties.json'

const counties = countiesObj.counties
const selectedCounty = ref('')

defineProps({
  county: {
    type: String
  }
})

const emit = defineEmits(['update:county'])

function countySelected() {
  emit('update:county', selectedCounty)
}
</script>

<style scoped>

</style>