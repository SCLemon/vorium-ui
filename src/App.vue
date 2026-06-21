<template>
  <div class="demo-box-wrapper">
    <div class="demo-box">
      <VPdfViewer :pdfFile="file" />
    </div>
  </div>
</template>

<script>

import { onMounted, ref } from 'vue';
import VPdfViewer from './components/VPdfViewer/VPdfViewer.vue';

export default {
  name: 'App',
  components: {
     VPdfViewer
  },
  setup(){
    const file = ref(null);

    onMounted(async ()=>{
      const response = await fetch('/assets/test2.pdf')
      const blob = await response.blob()
      file.value = new File([blob], 'test2.pdf',{ type: 'application/pdf' })
    })

    return{
      file
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
  width: 400px;
  height: 570px;
}

</style>
