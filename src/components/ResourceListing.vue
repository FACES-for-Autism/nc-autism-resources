<template>
  <div class="flex flex-col">
    <div class="w-full mt-4">
      <h3 class="inline font-semibold">{{ resource.Name }}</h3>
      <span v-if="valueIsDefined(resource['Web Address'])" class="inline text-xl">
        (<a :href="resource['Web Address']">Visit website</a>)
      </span>
    </div>
    <h4 class="font-semibold mt-4">Contact information</h4>
    <address class="not-italic">
      Email: <span
        v-if="valueIsDefined(resource['Email Address']) && isValidEmail(resource['Email Address'])"
        :href="'mailto:' + resource['Email Address']"
        v-html="emailLinks"
      ></span>
      <span v-else>Not listed</span>
      <br>
      Phone: <span
        v-if="valueIsDefined(resource['Phone Number']) && isValidPhoneNumber(resource['Phone Number'])"
        v-html="phoneNumberLinks"
      ></span>
      <span v-else>Not listed</span>
      <br>
      Address: 
      <template v-if="valueIsDefined(resource['Physical Address'])"> 
        <span class="inline">{{ resource['Physical Address'] }}</span>
        <span class="inline"> (<a :href="googleMapsURL">Open in map</a>)</span>
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
import { computed } from 'vue'

/* global defineProps */
const props = defineProps({
  resource: {
    type: Object,
    required: true
  }
})

const emailLinks = computed(() => {
  const emails = props.resource['Email Address'].split(/,\s*/gm)
  const emailLinks = emails.map(email => {
    return `<a href="mailto:${email}">${email}</a>`
  })
  return emailLinks.join(', ')
})

// Computed property that formats phone number links and returns an HTML string. Allows the listing to handle multiple phone number listings
const phoneNumberLinks = computed(() => {
  const re = /\d{3}-\d{3}-\d{4}/g
  const numbers = props.resource['Phone Number'].match(re)
  const numberLinks = numbers.map(number => {
    return `<a href="tel:+1-${number}">${number}</a>`
  })
  return numberLinks.join(', ')
})

// Computed property that formats the correct url to send to Google Maps
const googleMapsURL = computed(() => {
  return 'https://www.google.com/maps/search/?api=1&query=' +
    props.resource['Physical Address']
      .replaceAll(' ', '+')
      .replaceAll(',', '%2C')
      .replaceAll('(', '%28')
      .replaceAll(')', '%29')
})

/**
 * Test if an expected string is defined (not null and not empty string)
 * 
 * @param {string} value The string to test
 * @returns {boolean} True if the string is defined, false if not
 */
const valueIsDefined = (value) => {
  if (value != null && value.length > 0) {
    return true
  }
  return false
}

/**
 * Test if a provided string matches the basic format of an email address.
 * 
 * @param {string} email The string to test
 * @returns {boolean} True if the string looks like an email, false if not
 */
const isValidEmail = (email) => {
  const re = /\S+@\S+\.\S+/
  return re.test(email)
}


/**
 * Test if a provided string matches the basic format of a phone number.
 * 
 * @param {string} number The number to test
 * @returns {boolean} True if the string looks like a phone number, false if not
 */
const isValidPhoneNumber = (number) => {
  const re = /\d{3}-\d{3}-\d{4}/
  return re.test(number)
}
</script>

<style scoped>

</style>