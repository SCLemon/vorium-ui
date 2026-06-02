<template>
  <div class="stage">
    <div class="set-demo-box-item"><VButton type="primary" size="md"  :loading="loading" :loadingText="percent +'%'" @click="click()">Primary</VButton></div>
    <div class="set-demo-box-item"><VButton type="success" size="md"  :loading="loading" :loadingText="percent +'%'" @click="click()">Success</VButton></div>
    <div class="set-demo-box-item"><VButton type="warning" size="md" :loading="loading" :loadingText="percent +'%'" @click="click()" >Warning</VButton></div>
    <div class="set-demo-box-item"><VButton type="danger" size="md"  :loading="loading" :loadingText="percent +'%'" @click="click()">Danger</VButton></div>
    <div class="set-demo-box-item"><VButton type="ghost" size="md" :loading="loading" :loadingText="percent +'%'" @click="click()" >Ghost</VButton></div>
    </div>
</template>

<script>

import { ref, onUnmounted } from 'vue';
import VButton from './components/VButton.vue';

export default {
  name: 'App',
  components: {
    VButton
  },
  setup(){

    let percent = ref(0);
    let loading = ref(false);
    let timer = null;

    // Allows progress status to be displayed within the button during loading.
    function click(){
      loading.value = true;
      timer = setInterval(() => {

        percent.value += parseInt(Math.random()*5 + 1);
        if(percent.value >= 100){
          clearInterval(timer);
          loading.value = false;
          percent.value = 0;
        }
      }, 100);
    }

    onUnmounted(()=>{
      if(timer) clearInterval(timer)
    })

    return {
      percent, loading, click
    }
  }
}
</script>

<style>
body{
  background: black;
}
.stage{
  padding-left: 20px;
  padding-top: 20px;
  display: flex;
}
.set-demo-box-item{
  margin-left: 10px;
}
</style>
