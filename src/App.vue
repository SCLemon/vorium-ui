<template>
  <div class="stage">
    <VScanLight scan="light-sweep">Industrial UI System for Engineers</VScanLight>
    <VScanLight scan="text-shimmer">Industrial UI System for Engineers</VScanLight>
  </div>
</template>

<script>

import {  ref  } from 'vue';
import VScanLight from './components/VScanLight.vue';

export default {
  name: 'App',
  components: {
    VScanLight
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

.stage{
  width: 500px;
  height: 500px;
  margin: 0 auto;
  margin-top: 200px;
  border: 1px solid red;
}

</style>
