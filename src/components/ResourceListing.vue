<template>
  <div class="flex flex-col mb-4">
    <div class="w-full mt-4">
      <h3 class="inline font-semibold">{{ resource.Name }}</h3>
      <span v-if="valueIsDefined(resource['Web Address'])" class="inline text-xl">
        (<a :href="resource['Web Address']">Visit website</a>)
      </span>
    </div>
    <h4 class="font-semibold mt-4">Contact information</h4>
    <address class="not-italic">
      Email: <a
        v-if="valueIsDefined(resource['Email Address']) && resource['Email Address'].toLowerCase() !== 'n/a'"
        :href="'mailto:' + resource['Email Address']"
      >{{ resource['Email Address'] }}</a>
      <span v-else>Not listed</span>
      <br>
      Phone: <a
        v-if="valueIsDefined(resource['Phone Number']) && resource['Phone Number'].toLowerCase() !== 'n/a'"
        :href="'tel:+1-' + resource['Phone Number']"
      >{{ resource['Phone Number'] }}</a>
      <span v-else>Not listed</span>
      <br>
      Address: 
      <template v-if="valueIsDefined(resource['Physical Address'])"> 
        <span class="inline">{{ resource['Physical Address'] }}</span>
        <span class="inline"> (<a href="#">Open in map</a>)</span>
      </template>
      <span v-else>Not listed</span>
    </address>
    <h4 class="font-semibold mt-4">Ages Served</h4>
    <p v-if="valueIsDefined(resource['Age categories'])">{{ resource['Age categories'] }}</p>
    <p v-else>Not listed</p>
    <h4 class="font-semibold mt-4">Services</h4>
    <ul class="grid sm:grid-cols-2 md:pr-36 content-start list-inside list-disc">
      <li
        v-for="resource in resource.services"
        :key=resource
      >{{ resource }}</li>
    </ul>
    <p v-if="!valueIsDefined(resource.services)">No services listed</p>
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