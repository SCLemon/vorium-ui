<template>
  <div class="demo-box-wrapper">
    <div class="demo-box">
      <VSlider v-model="progress" :tipText="handleTipText"></VSlider>
    </div>
  </div>
</template>

<script>

import { ref } from 'vue';
import VVideoPlayer from './components/VVideoPlayer/VVideoPlayer.vue';
import VSlider from './components/VSlider/VSlider.vue';
export default {
  name: 'App',
  components: {
     VVideoPlayer, VSlider
  },
  setup(){
    const progress = ref(50)

    function handleTipText(value) {
        if (value === 0) return '靜音';
        if (value < 33) return '低音量';
        if (value < 66) return '中音量';
        return '高音量';
    }

    return{
      progress, handleTipText
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
  display: flex;
  justify-content: center;
}
.demo-box{
  margin-top: 200px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  gap: 40px;
  width: 300px;
}

</style>
