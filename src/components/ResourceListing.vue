<template>
  <div class="flex flex-col">
    <div class="w-full mt-4">
      <h3 class="inline font-semibold">{{ resource.Name }}</h3>
      <span v-if="stringIsDefined(resource.WebAddress)" class="inline text-xl">
        (<a :href="resource.WebAddress">Visit website</a>)
      </span>
    </div>
    <h4 class="font-semibold mt-4">Contact information</h4>
    <address class="not-italic">
      Email: <span
        v-if="stringIsDefined(resource.EmailAddress) && isValidEmail(resource.EmailAddress)"
        v-html="emailLinks"
      ></span>
      <span v-else>Not listed</span>
      <br>
      Phone: <span
        v-if="arrayIsDefined(resource.PhoneNumber)"
        v-html="phoneNumberLinks"
      ></span>
      <template v-else><span>Not listed</span></template>
      <br>
      Address: 
      <template v-if="arrayIsDefined(resource.PhysicalAddress)">
        <template
          v-for="(physicalAddress, index) in resource.PhysicalAddress"
          :key="physicalAddress"
        >
          <span class="inline">{{ physicalAddress + " " }}</span>
          <span class="inline">
            (<a :href="googleMapsURL(physicalAddress)">Open in map</a>)<template v-if="index < resource.PhysicalAddress.length - 1">, </template>
          </span>

        </template>
      </template>
      <span v-else>Not listed</span>
    </address>
    <h4 class="font-semibold mt-4">Ages Served</h4>
    <p v-if="arrayIsDefined(resource.AgeGroups)">{{ resource.AgeGroups.join(', ') }}</p>
    <p v-else>Not listed</p>
    <h4 class="font-semibold mt-4">Services</h4>
    <ul class="grid sm:grid-cols-2 md:pr-36 content-start list-inside list-disc">
      <li
        v-for="service in resource.Services"
        :key=service
      >{{ service }}</li>
    </ul>
    <p v-if="!arrayIsDefined(resource.Services)">No services listed</p>
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

// Computed property that formats email links and returns an HTML string. Allows a listing to handle multiple email address links.
const emailLinks = computed(() => {
  const emails = props.resource['EmailAddress'].split(/,\s*/gm)
  const emailLinks = emails.map(email => {
    return `<a href="mailto:${email}">${email}</a>`
  })
  return emailLinks.join(', ')
})

// Computed property that formats phone number links and returns an HTML string. Allows a listing to handle multiple phone number links.
const phoneNumberLinks = computed(() => {
  const re = /\d{3}-\d{3}-\d{4}/g
  const numbers = props.resource['PhoneNumber']
  const numberLinks = numbers.map(number => {
    const pos = number.search(re)
    if (pos !== -1) {
      const realNumber = number.slice(pos, pos + 12)
      const extra = number.slice(pos + 13)
      return `<a href="tel:+1-${realNumber}">${realNumber}</a> ${extra}`
    }
  })
  return numberLinks.join(', ')
})

// Computed property that formats the correct url to send to Google Maps
const googleMapsURL = (physicalAddress) => {
  return 'https://www.google.com/maps/search/?api=1&query=' +
    physicalAddress
      .replaceAll(' ', '+')
      .replaceAll(',', '%2C')
      .replaceAll('(', '%28')
      .replaceAll(')', '%29')
}

/**
 * Test if an expected string is defined (not null and not empty string)
 * 
 * @param {string} value The string to test
 * @returns {boolean} True if the string is defined, false if not
 */
const stringIsDefined = (value) => {
  if (value != null && value.length > 0) {
    return true
  }
  return false
}

/**
 * Test if an expected array is defined (not an empty array or containing only an empty strings)
 * 
 * @param {array} value The array to test
 * @returns {boolean} True if the array is defined, false if not
 */
const arrayIsDefined = (value) => {
  if (value != null && value.length > 0 && !value.every(d => d === '')) {
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
// const isValidPhoneNumber = (number) => {
//   const re = /\d{3}-\d{3}-\d{4}/
//   return re.test(number)
// }
</script>

<style scoped>

</style>