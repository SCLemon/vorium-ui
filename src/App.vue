<template>
  <div class="stage">
    <div class="input-demo">
      <VButton>test</VButton>
      <VButton type="ghost">View Components</VButton>
      <VButton :disabled="true">test</VButton>
      <VButton :loading="true">test</VButton>
    </div>
  </div>
</template>

<script>

import { ref  } from 'vue';
import VInput from './components/VInput.vue';
import VButton from './components/VButton.vue';
import VIcon from './components/VIcon.vue';
import SendIcon from './icons/SendIcon.vue';
export default {
  name: 'App',
  components: {
    VInput, VButton, VIcon
  },
  setup(){
    let list = ref(['test','test2','test3','test4','test'])
    let keyword = ref('');
    return {
      keyword, SendIcon, list
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
.input-demo{
  width: 250px;
  margin-right: 10px;
}

</style>
