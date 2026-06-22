<template>
  <div class="demo-box-wrapper">
    <div class="demo-box">
      <VInputNumber v-model="number"></VInputNumber>
    </div>
  </div>
</template>

<script>

import { ref } from 'vue';
import VInputNumber from './components/VInputNumber.vue';

export default {
  name: 'App',
  components: {
     VInputNumber
  },
  setup(){
    const number = ref(2)

    return{
      number
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
  width: 200px;
  height: 570px;
}

</style>
