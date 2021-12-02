<template>
  <div class="flex flex-col p-4 border-2 border-gray-600 rounded-md">
    <div class="block">
      <h3 class="inline">{{ resource.Name }}</h3>
      <p class="inline">
        (<a
          v-if="valueIsDefined(resource['Web Address'])"
          :href="resource['Web Address']"
        >Visit website</a>)
      </p>
    </div>
    <p class="">
      <a
        v-if="valueIsDefined(resource['Email Address'])"
        :href="'mailto:' + resource['Email Address']"
      >{{ resource['Email Address'] }}</a>
      <br v-if="valueIsDefined(resource['Email Address'])">
      <a
        v-if="valueIsDefined(resource['Phone Number'])"
        :href="'tel:+1-' + resource['Phone Number']"
      >{{  resource['Phone Number'] }}</a>
    </p>
    <div class="block">
      <address
        class="inline"
        v-if="valueIsDefined(resource['Physical Address'])"
      >{{ resource['Physical Address'] }}
      </address>
      <p class="inline">
        (<a
          v-if="valueIsDefined(resource['Physical Address'])"
          href="#"
        >Open in map</a>)
      </p>
    </div>
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