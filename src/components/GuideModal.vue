<template>
<div class="absolute left-0 top-0">
  <div 
    class="fixed z-40 left-0 top-0 w-screen h-screen bg-gray-300 bg-opacity-70"
    @click="closeModal"
  ></div>
  <div class="modal z-50 fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-10/12 lg:w-8/12 max-w-2xl p-4 border border-gray-800 bg-white">
    <button
      class="absolute right-4 top-4"
      aria-label="Close guide"
      @click="closeModal"
    >
      <svg aria-hidden="true" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
    </button>
    <h2>About...</h2>
    <p>This is what people need to know to use this application</p>

    <a class="fixed bottom-4 left-0 right-0 text-center font-semibold text-black" href="https://sites.google.com/ncsu.edu/facesprogram/contact-us">Contact FACES</a>
  </div>
</div>
</template>

<script setup>
// eslint-disable-next-line no-undef
const emit = defineEmits(['closeModal'])

function closeModal() {
  emit('closeModal')
}
</script>

<style scoped>
.modal {
  height: 75vh;
}
</style>