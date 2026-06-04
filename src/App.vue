<template>
  <div class="stage">
    <div class="input-demo">
      <VInput size="md" v-model="keyword" round :hotKey="'P'" placeholder="Cutsom Slot">
        <template #action>
          <VButton type="ghost" size="xs" round>
            <VIcon :icon="SendIcon"></VIcon>
          </VButton>
        </template>
      </VInput>
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
    let keyword = ref('');
    return {
      keyword, SendIcon
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
