<template>
  <div class="stage">
    <div class="input-demo">
      <VInput size="md" v-model="keyword" :suggestionList="suggestionList" :suggestionListIsLoading="isLoading"></VInput>
    </div>
    <div class="input-demo">
      <VInput size="md" v-model="keyword" type="password"></VInput>
    </div>
  </div>
</template>

<script>

import { ref, reactive, watch } from 'vue';
import VInput from './components/VInput/VInput.vue';

export default {
  name: 'App',
  components: {
    VInput
  },
  setup(){

    let list = ["無骨鹽酥雞","醬烤雞排","蜜汁大雞腿","炭烤雞翅","香酥雞皮","椒鹽魷魚","酥炸花枝丸","韓式炸雞","蒜香豆干","黃金地瓜條","炸米血糕","酥脆雞米花","炭烤雞屁股","起司雞排","梅粉地瓜球"];
    let suggestionList = reactive([]);
    let keyword = ref('');

    let timer = null;
    let isLoading = ref(false);
    let requestId = 0;

    watch(()=> keyword.value, (value)=>{

      clearTimeout(timer);

      timer = setTimeout(async ()=>{

        const currentId = ++requestId;

        isLoading.value = true;

        const filterList = list.filter((i) => i.includes(value));

        await new Promise((resolve, reject)=>{ 
          setTimeout(() => {resolve()}, 1000)
        })

        if(currentId != requestId) return;

        suggestionList.splice(0,suggestionList.length, ...filterList);

        isLoading.value = false;

      }, 300)

    }, { immediate: true })

    return {
      keyword, isLoading, suggestionList
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
