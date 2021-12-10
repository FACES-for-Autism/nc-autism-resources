<template>
  <div class="flex flex-col p-4">
    <div>
      <label class="mr-2" for="age">Filter resources by ages served:</label>
      <select
        class="w-min mr-2 cursor-pointer border-2 border-gray-500 rounded-sm"
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
      <button 
        class="italic"
        v-if="selectedAgeGroup !== ''"
        @click="selectedAgeGroup = ''">
        Remove age range filter
      </button>
    </div>
    <fieldset class="w-full mt-6">
      <legend class="mb-2">Filter resources by provided services:</legend>
      <div
        class="grid grid-cols-2 lg:grid-cols-3 w-max grid-flow-row gap-x-3 mx-auto"
      >
        <div v-for="service in uniqueServices" :key="service">
          <input
            class="mr-2"
            type="checkbox"
            name="services"
            :id="service"
            :value="service"
            v-model="selectedServices"
            @change="serviceSelected"
          >
          <label :for="service">{{ service }}</label>
        </div>
      </div>
    </fieldset>
    <button 
      class="mx-auto mt-6 border-2 border-gray-600 p-2 rounded-md" 
      @click="closeFilterMenu"
    >
      Close filter menu
    </button>
  </div>
</template>

<script setup>
/* global defineProps defineEmits */  
import { ref } from 'vue'

// Reactive data to model filter selections
const selectedAgeGroup = ref('')
const selectedServices = ref([])

defineProps({
  ageGroupFilter: {
    type: String
  },
  servicesGroupFilter: {
    type: Array
  },
  uniqueAgeGroups: {
    type: Array
  },
  uniqueServices: {
    type: Array
  }
})

const emit = defineEmits(['update:ageGroupFilter', 'update:servicesGroupFilter', 'closeFilterMenu'])

function ageGroupSelected() {
  emit('update:ageGroupFilter', selectedAgeGroup)
}

function serviceSelected() {
  emit('update:servicesGroupFilter', selectedServices)
}

function closeFilterMenu() {
  emit('closeFilterMenu')
}
</script>

<style scoped>

</style>