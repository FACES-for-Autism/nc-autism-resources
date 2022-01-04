<template>
  <div>
    <label class="mr-2 mb-2" :for="groupName">
      <slot name="label"></slot>
    </label>
    <select
      class="w-full p-1 cursor-pointer border border-black rounded-sm"
      @change="selectChange"
      v-model="currentValue"
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
  </div>
</template>


<script setup>
/* global defineProps defineEmits */
import { ref } from 'vue'

const currentValue = ref('')

defineProps({
  groupName: {
    type: String
  },
  values: {
    type: Array
  },
  selectedValue: {
    type: String
  }
})

const emit = defineEmits(['update:selectedValue'])

function selectChange() {
  emit('update:selectedValue', currentValue)
}
</script>