<template>
  <button class="openx-button" @click="clickHandler">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { hello } from "@gt-ui/shared";

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
