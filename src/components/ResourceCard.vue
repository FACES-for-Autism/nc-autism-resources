<template>
  <h3>{{ resource.Name }}</h3>
  <p><a :href="resource['Web Address']">{{ resource['Web Address'] }}</a></p>
  <p>{{ resource['Physical Address'] }}</p>
  <p><a :href="'mailto:' + resource['Email Address']">{{ resource['Email Address'] }}</a></p>
  <p><a :href="'tel:+1-' + resource['Phone Number']">{{  resource['Phone Number'] }}</a></p>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  resource: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>

</style>