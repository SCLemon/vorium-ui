<template>
  <div class="demo-box-wrapper">
    <div class="demo-box">
      <VSlider v-model="progress" :tipText="progress.toFixed(1)">
        <template #prepend><div class="demo-prepend"><VIcon :icon="VolumeHighIcon" :size="16"></VIcon></div></template>
        <template #append><div class="demo-append">{{ progress.toFixed(1) }} %</div></template>
      </VSlider>
    </div>
  </div>
</template>

<script>

import { ref } from 'vue';
import VSlider from './components/VSlider/VSlider.vue'
import VIcon from './components/VIcon.vue';
import VolumeHighIcon from './icons/VolumeHighIcon.vue'
export default {
  name: 'App',
  components: {
     VSlider, VIcon
  },
  setup(){
    const progress = ref(50);

    return{
      progress, VolumeHighIcon
    }
  }
}
</script>

<style>
body{
  background: black;
}

.demo-box-wrapper{
  width: 100%;
  margin: 0 auto;
  margin-top: 200px;
  display: flex;
  justify-content: center;
}
.demo-box{
  width: 300px;
}
.demo-prepend{
  display: flex;
  align-items: center;
  justify-content: center;
}
.demo-append{
  font-size: 12px;
  width: 7ch;
  display: flex;
  align-items: center;
  justify-content: left;
}

</style>
