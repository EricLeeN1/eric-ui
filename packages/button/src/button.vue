<template>
  <button class="er-button" @click="clickHandler">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { hello } from "@ericui/shared";

const props = withDefaults(
  defineProps<{
    text?: string;
  }>(),
  {
    text: "World",
  }
);

const clickHandler = () => {
  hello(props.text);
};
</script>

<style scoped></style>
