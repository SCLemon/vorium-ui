<template>
  <div class="demo-box-wrapper">
    <div class="demo-box">
      <!-- <VIcon :icon="CalendarUserIcon" :size="32"></VIcon> -->
    </div>
  </div>
</template>

<script>

import { ref } from 'vue';
// import CalendarUserIcon from './icons/CalendarUserIcon.vue';

import VIcon from './components/VIcon.vue';
export default {
  name: 'App',
  components: {
    VIcon
  },
  setup(){

    return{
        // CalendarUserIcon
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
  color: white;
}

</style>
