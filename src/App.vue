<template>
  <div class="demo-box-wrapper">
    <div class="demo-box">
      <VSelect v-model="selected" :list="list"></VSelect>
    </div>
    <div class="demo-box">
      <VSelect></VSelect>
    </div>
  </div>
</template>

<script>

import { ref, reactive } from 'vue';
import VSelect from './components/VSelect.vue';
export default {
  name: 'App',
  components: {
     VSelect
  },
  setup(){
    let selected = ref(null);

    const list = reactive([
        { label: '蘿蔔糕', value: '菜頭糕', disabled: true },
        { label: '煎餅', value: '煎餅', disabled: true },
        { label: '蛋餅', value: '蛋餅', disabled: true },
        { label: '蔥抓餅', value: '蔥抓餅', disabled: false },
        { label: '超級無敵豪華雙層起司培根牛肉漢堡套餐加大薯條與可樂', value: 'burger', disabled: true },
        { label: '鐵板麵', value: '鐵板麵', disabled: true },
        { label: '三明治', value: '三明治' , disabled: true},
        { label: '蘿蔔糕加蛋', value: '蘿蔔糕加蛋', disabled: false },
        { label: '飯糰', value: '飯糰', disabled: true },
        { label: '燒餅油條搭配特大杯冰豆漿早餐組合', value: 'breakfast', disabled: true }
    ]);

    return {
      list, selected
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
  margin-top: 200px;
  display: flex;
  justify-content: center;
  gap:40px;
}
.demo-box{
  width: 200px;
}

</style>
