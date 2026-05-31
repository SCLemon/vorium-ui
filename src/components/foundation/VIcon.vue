<template>
  <component :is="icon" class="v-icon" :style="{ width: `${size}px`, height: `${size}px`}"/>
</template>

<script>
export default {
  name: 'VIcon',

  props: {
    icon: {
      type: Object,
      required: true,
    },

    size: {
      type: Number,
      default: 16,
    },
  },
}
</script>

<style>
.v-icon {
  display: inline-flex;
  flex-shrink: 0;
  color: inherit;
}

.v-icon svg {
  width: 100%;
  height: 100%;
  display: block;
}
</style>