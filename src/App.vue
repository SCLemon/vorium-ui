<template>
  <div class="demo-box-wrapper">
    <div class="demo-box">
      <VRadio v-model="select"  label="水果" value="fruit"/>
      <VRadio v-model="select"  label="水果" value="frui1t"/>
      <VRadio v-model="select"  label="水果" value="fruit2"/>
      <VRadio v-model="select"  :disabled="true" label="蛋糕" value="cake"/>
      <VRadio v-model="select"  label="水果" value="fruit3"/>
    </div>
  </div>
</template>

<script>

import { ref } from 'vue';
import VRadio from './components/VRadio.vue';


export default {
  name: 'App',
  components: {
     VRadio
  },
  setup(){

    const select = ref('cake');

    return{
      select
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
