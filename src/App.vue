<template>
  <div class="stage">
    <VCodeEditor v-model="code" :autoResize="true" :minRows="1">
    </VCodeEditor>
  </div>
</template>

<script>

import {  ref  } from 'vue';
import VCodeEditor from './components/VCodeEditor.vue';
import 'monaco-editor/min/vs/editor/editor.main.css'

export default {
  name: 'App',
  components: {
    VCodeEditor
  },
  setup(){
    let code = ref('')
    return {
      code
    }
  }
}
</script>

<style>
body{
  background: black;
}
.icon{
  cursor: pointer;
}

.stage{
  width: 500px;
  height: 500px;
  margin: 0 auto;
  margin-top: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
