<template>
  <div class="demo-box-wrapper">
    <VCarousel>
      <v-carousel-item><div class="demo-box"></div></v-carousel-item>
      <v-carousel-item><div class="demo-box">2</div></v-carousel-item>
      <v-carousel-item><div class="demo-box">3</div></v-carousel-item>
      <v-carousel-item><div class="demo-box">4</div></v-carousel-item>
      <v-carousel-item><div class="demo-box">5</div></v-carousel-item>
    </VCarousel>
  </div>
</template>

<script>

import {  ref  } from 'vue';
import VCarousel from './components/VCarousel/VCarousel.vue';
import VCarouselItem from './components/VCarousel/components/VCarouselItem.vue';

export default {
  name: 'App',
  components: {
    VCarousel, VCarouselItem
  },
  setup(){
    let code = ref('')
    return {
      code
    }
  }
}
</script>

<style>
body{
  background: black;
}
.icon{
  cursor: pointer;
}

.demo-box-wrapper{
  width: 700px;
  margin: 0 auto;
  margin-top: 200px;
}
.demo-box{
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255,255,255,0.07);
  height: 100%;
}


</style>
