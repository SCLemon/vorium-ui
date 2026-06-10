<template>
  <div class="demo-box-wrapper">
    <VVideoPlayer :source="source"></VVideoPlayer>
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
          name: '緋雪×薄紅ノ刃『鳴潮MAD』', // could be any string
          src: 'assets/video.mp4?v=1080' // could be file or url
        },
        {
          quality: '720P',
          name: '緋雪×薄紅ノ刃『鳴潮MAD』A',
          src: 'assets/video.mp4?v=720'
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
