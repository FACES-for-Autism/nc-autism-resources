<template>
  <button
    aria-label="Open page guide"
    @click="openModal"
  >
    <svg aria-hidden="true" width="40" height="40" viewBox="0 0 24 24" fill="none" class="stroke-current hover:text-red-200 dark:hover:text-yellow-400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  </button>
</template>

<script setup>
// eslint-disable-next-line no-undef
const emit = defineEmits(['openModal'])

function openModal() {
  emit('openModal')
}
</script>