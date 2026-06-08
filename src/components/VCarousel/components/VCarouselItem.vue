<template>
  <div class="v-carousel-wrapper-item-wrapper">
    <slot></slot>
  </div>
</template>

<script>
export default {
    name: 'VCarouselItem',
}
</script>

<style>
    .v-carousel-wrapper-item-wrapper{
        box-sizing: border-box;
        scroll-snap-align: start;
        width: 100%;
        height: 100%;
    }
</style>