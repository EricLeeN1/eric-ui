<template>
  <input
    class="eric-input"
    type="text"
    :value="modelValue"
    @input="inputHandler"
  >
</template>

<script setup lang="ts">
import { hello } from '@ericui/shared';

withDefaults(
  defineProps<{
    modelValue?: string;
  }>(),
  {
    modelValue: '',
  },
);

const emit = defineEmits<{
  (event: 'update:modelValue', val: string): void;
}>();

const inputHandler = (e: any) => {
  const { value } = e.target;
  emit('update:modelValue', value);
  hello(value);
};
</script>

<style scoped lang="scss"></style>
