<template>
  <div class="stage">
    
    <VButton type="ghost" :disabled="true" :circle="true" size="sm" :isLoading="true">G</VButton>
    <br><br>
    <VButton type="danger" size="md" :isLoading="true">
    </VButton>
    <br><br>
    <VButton type="warning" :circle="true" size="sm">
      <VIcon :icon="ExclamationIcon" :size="18"></VIcon>
    </VButton>
    <br><br>
    <VButton type="success" :disabled="true" :circle="true" size="xl">S</VButton>
    <br><br>

  </div>
</template>

<script>

import VButton from './components/VButton.vue';
import VIcon from './components/VIcon.vue';
import { ExclamationIcon } from '@/icons/index.js';

export default {
  name: 'App',
  components: {
    VButton, VIcon
  },
  setup(){
    return {
      ExclamationIcon
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
  padding-top: 20px
}
</style>
