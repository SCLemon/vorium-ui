<template>
  <div class="stage">
    <div class="input-demo">
      <VInput size="xs" v-model="keyword" round :hotKey="'P'" :suggestionList="list" placeholder="Cutsom Slot">
        <template #action>
          <VButton type="ghost" size="xs" round :loading="true">
            <VIcon :icon="SendIcon"></VIcon>
          </VButton>
        </template>
      </VInput>
    </div>
        <div class="input-demo">
      <VInput size="sm" v-model="keyword" :suggestionListDirection="'left'" round :hotKey="'P'" :suggestionList="list" placeholder="Cutsom Slot">
        <template #action>
          <VButton type="ghost" size="xs" round>
            <VIcon :icon="SendIcon"></VIcon>
          </VButton>
        </template>
      </VInput>
    </div>
        <div class="input-demo">
      <VInput size="lg" v-model="keyword" :suggestionListDirection="'right'" round :hotKey="'P'" :suggestionList="list" placeholder="Cutsom Slot">
        <template #action>
          <VButton type="ghost" size="xs" round>
            <VIcon :icon="SendIcon"></VIcon>
          </VButton>
        </template>
      </VInput>
    </div>
        <div class="input-demo">
      <VInput :disabled="true" size="xl" v-model="keyword" :suggestionListDirection="'top'" round :hotKey="'P'" :suggestionList="list" placeholder="Cutsom Slot">
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
