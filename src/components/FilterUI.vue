<template>
  <div class="flex flex-col">
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
    <fieldset class="grid grid-cols-2">
      <legend class="mb-2">Filter resources by provided services:</legend>
      <template
        v-for="i in 10"
        :key="i"
      >
        <div>
          <input type="checkbox" name="services" :id="'service' + i" class="mr-2">
          <label :for="'service' + i">Service {{ i }}</label>
        </div>
      </template>
    </fieldset>
  </div>
</template>

<script setup>
/* global defineProps defineEmits */  
import { ref } from 'vue'

// Reactive data to model filter selections
const selectedAgeGroup = ref('')

defineProps({
  ageGroupFilter: {
    type: String
  },
  uniqueAgeGroups: {
    type: Array
  }
})

const emit = defineEmits(['update:ageGroupFilter'])

function ageGroupSelected() {
  emit('update:ageGroupFilter', selectedAgeGroup)
}
</script>

<style scoped>

</style>