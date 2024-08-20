<template>
  <button
    class="eric-button"
    @click="clickHandler"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { hello } from '@ericui/shared';

const props = withDefaults(defineProps<{
  text?: string;
}>(), {
  text: 'World',
});
function clickHandler() {
  hello(props.text);
}
</script>

<style scoped lang="scss"></style>
