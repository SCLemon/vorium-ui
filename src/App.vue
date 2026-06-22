<template>
  <div class="demo-box-wrapper">
    <div class="demo-box">
      <VButton circle>
        <VIcon :icon="CheckIcon"></VIcon>
         <!-- 確認 -->
      </VButton>
    </div>
  </div>
</template>

<script>

import { ref } from 'vue';
import VButton from './components/VButton.vue';
import CheckIcon from './icons/CheckIcon.vue';
import VIcon from './components/VIcon.vue';

export default {
  name: 'App',
  components: {
     VButton, VIcon
  },
  setup(){

    return{
      CheckIcon
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
  height: 570px;
}

</style>
