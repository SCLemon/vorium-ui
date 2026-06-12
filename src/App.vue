<template>
  <div class="demo-box-wrapper">
    <button @click="toggle()"></button>
    <div class="demo-box">
      <VDropdown placement="top" :isVisible="isVisible">
        <div class="demo-item">hello world</div>
        <div class="demo-item">hello world</div>
        <div class="demo-item">hello world</div>
        <div class="demo-item">hello world</div>
      </VDropdown>
    </div>
    <div class="demo-box">
      <VDropdown placement="left" :isVisible="isVisible" arrow-position="15px">
        <div class="demo-item">hello world</div>
        <div class="demo-item">hello world</div>
        <div class="demo-item">hello world</div>
        <div class="demo-item">hello world</div>
      </VDropdown>
    </div>
    <div class="demo-box">
      <VDropdown placement="right" :isVisible="isVisible" arrow-position="15px">
        <div class="demo-item">hello world</div>
        <div class="demo-item">hello world</div>
        <div class="demo-item">hello world</div>
        <div class="demo-item">hello world</div>
      </VDropdown>
    </div>
    <div class="demo-box">
      <VDropdown placement="bottom" :isVisible="isVisible">
        <div class="demo-item">hello world</div>
        <div class="demo-item">hello world</div>
        <div class="demo-item">hello world</div>
        <div class="demo-item">hello world</div>
      </VDropdown>
    </div>
  </div>
</template>

<script>

import VDropdown from './components/VDropdown.vue';
import { ref } from 'vue';
export default {
  name: 'App',
  components: {
     VDropdown
  },
  setup(){

    const isVisible = ref(true);

    function toggle(){
      isVisible.value = !isVisible.value
    }

    return {
      isVisible, toggle
    }
  }
}
</script>

<style>
body{
  background: gray;
}

.demo-box-wrapper{
  width: 100%;
  margin: 0 auto;
  margin-top: 200px;
  display: flex;
  justify-content: center;
  gap:40px;
}
.demo-box{
  width: 100px;
}
.demo-item{
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
}
.demo-item:hover{
  cursor: pointer;
  background: rgba(255,255,255,0.15);
}

</style>
