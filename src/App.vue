<template>
  <div class="demo-box-wrapper">
    <div class="demo-box">
      <VIcon :icon="BookIcon" :size="24"></VIcon>
      <VIcon :icon="ToolIcon" :size="24"></VIcon>
      <VIcon :icon="RecordIcon" :size="24"></VIcon>
    </div>
  </div>
</template>

<script>

import { ref } from 'vue';
import BookIcon from './icons/BookIcon.vue';
import ToolIcon from './icons/ToolIcon.vue';
import CalendarIcon from './icons/CalendarIcon.vue';
import SettingIcon from './icons/SettingIcon.vue';
import VIcon from './components/VIcon.vue';
export default {
  name: 'App',
  components: {
    VIcon
  },
  setup(){

    return{
        BookIcon, ToolIcon, CalendarIcon, SettingIcon
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
