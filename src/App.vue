<template>
  <div class="demo-box-wrapper">
    <div class="demo-box">
      <VCheckBoxGroup ref="group" v-model="fruits">
          <VCheckBoxOption label="Apple" value="apple" :disabled="true" :hasBorder="true"/>
          <VCheckBoxOption label="Banana" value="banana" :hasBorder="true"/>
          <VCheckBoxOption label="Orange" value="orange" :hasBorder="true"/>
      </VCheckBoxGroup>
        <button @click="a">1</button>
        <button @click="b">2</button>
    </div>
  </div>
</template>

<script>

import { onMounted, ref, watch } from 'vue';
import VCheckBoxGroup from './components/VCheckBox/VCheckBoxGroup.vue';
import VCheckBoxOption from './components/VCheckBox/VCheckBoxOption.vue';

export default {
  name: 'App',
  components: {
     VCheckBoxGroup, VCheckBoxOption
  },
  setup(){
    const group = ref(null);
    const fruits = ref(['apple']);

    function a(){
      group.value.clearAll()
    }
    
    function b(){
      group.value.selectAll()
    }

    return{
      group, fruits, a, b
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
