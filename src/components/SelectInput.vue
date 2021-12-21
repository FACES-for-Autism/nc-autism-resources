<template>
  <label class="mr-2" :for="groupName">
    <slot name="label"></slot>
  </label>
    <select
      class="w-min cursor-pointer border-2 border-gray-500 rounded-sm"
      @change="selectChange"
      :name="groupName"
      :id="groupName"
    >
      <option selected disabled value="">
        <slot name="default-value"></slot>
      </option>
      <option
        v-for="value in values"
        :key="value"
        :value="value"
      >
        {{ value }}
      </option>
    </select>
</template>


<script setup>
/* global defineProps defineEmits */

defineProps({
  groupName: {
    type: String
  },
  values: {
    type: Array
  }
})

const emit = defineEmits(['selectUpdate'])

function selectChange(event) {
  emit('selectUpdate', event.target.value)
}
</script>