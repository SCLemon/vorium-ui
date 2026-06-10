<template>
  <div class="demo-box-wrapper">
    <VVideoPlayer :source="source">
    </VVideoPlayer>
  </div>
</template>

<script>

import { reactive, ref } from 'vue';
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
          quality: '720p', // could be any string
          name: 'video.mp4',
          src: 'assets/video.mp4'
        }
      ]
    )
    return {
      source
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
