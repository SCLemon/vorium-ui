<template>
  <div class="demo-box-wrapper">
    <div class="demo-box">
      <VVideoPlayer :source="source">
      </VVideoPlayer>
    </div>
  </div>
</template>

<script>

import { reactive } from 'vue';
import VVideoPlayer from './components/VVideoPlayer/VVideoPlayer.vue';

export default {
  name: 'App',
  components: {
     VVideoPlayer
  },
  setup(){
        let source = reactive(
      [
        {
          quality: '1080P', // could be any string, such as '高清' and so on...
          name: '緋雪主題曲', // could be any string
          src: 'assets/video.mp4' // could be file or url
        },
      ]
    )

    return{
      source
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
}

</style>
