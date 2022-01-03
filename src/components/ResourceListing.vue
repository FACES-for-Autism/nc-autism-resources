<template>
  <div class="flex flex-col mb-4">
    <div class="w-full mt-4">
      <h4 class="inline font-semibold">{{ resource.Name }}</h4>
      <p class="inline">
        (<a
          v-if="valueIsDefined(resource['Web Address'])"
          :href="resource['Web Address']"
        >Visit website</a>)
      </p>
    </div>
    <h5 class="font-semibold ml-4">Contact information</h5>
    <address class="ml-8">
      Email: <a
        v-if="valueIsDefined(resource['Email Address'])"
        :href="'mailto:' + resource['Email Address']"
      >{{ resource['Email Address'] }}</a>
      <br>
      Phone: <a
        v-if="valueIsDefined(resource['Phone Number'])"
        :href="'tel:+1-' + resource['Phone Number']"
      >{{  resource['Phone Number'] }}</a>
      <br>
      Address: <span
        class="inline"
        v-if="valueIsDefined(resource['Physical Address'])"
      >{{ resource['Physical Address'] }}
      </span>
      <span class="inline">
        (<a
          v-if="valueIsDefined(resource['Physical Address'])"
          href="#"
        >Open in map</a>)
      </span>
    </address>
    <h5 class="font-semibold ml-4">Services</h5>
    <ul class="grid grid-cols-2 w-max ml-8 list-inside list-disc">
      <li
        class="mr-4"
        v-for="resource in resource.services"
        :key=resource
      >{{ resource }}</li>
    </ul>
    <p class="ml-8" v-if="!valueIsDefined(resource.services)">No services listed</p>
  </div>
</template>

<script setup>
/* global defineProps */
defineProps({
  resource: {
    type: Object,
    required: true
  }
})

// Test if there is a defined value in the resource field, used to conditionally render (v-if) resource information only if there is a value. This prevents empty HTML tags.
const valueIsDefined = (value) => {
  if (value != null && value.length > 0) {
    return true
  }
  return false
}
</script>

<style scoped>

</style>