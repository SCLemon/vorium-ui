<template>
    <div class="v-code-editor-wrapper-with-header">
        <div v-if="header" :class="`v-code-editor-header v-code-editor-header-${theme}`" :style="headerStyle">
            <div class="v-code-editor-header-language">
                <VIcon :icon="CodeIcon"></VIcon><div class="v-code-editor-header-language-title">{{ headerTitle.trim() =='' ? language : headerTitle }}</div>
            </div>
            <div class="v-code-editor-header-action">
                <div v-if="!hasActionSlot">
                    <div class="v-code-editor-icon-wrapper" @click="copy()" v-if="copyStatus == 0"><VIcon :icon="CopyIcon" class="v-code-editor-icon"></VIcon>COPY</div>
                    <div class="v-code-editor-icon-wrapper" v-else-if="copyStatus == 1"><VIcon :icon="CheckIcon" class="v-code-editor-icon"></VIcon>COPIED</div>
                    <div class="v-code-editor-icon-wrapper" v-else-if="copyStatus == 2"><VIcon :icon="CloseIcon" class="v-code-editor-icon"></VIcon>Failed</div>
                </div>
                <slot v-else name="action"></slot>
            </div>
        </div>
        <div class="v-code-editor-wrapper" ref="editorWrapper" :style="{ height: autoResize ? autoResizeHeight +'px' : `calc(100% - ${headerStyle.height})`}">
            <div ref="editor" class="v-code-editor" :class="{'v-code-editor-with-header': header }"></div>
        </div>
    </div>
</template>

<script>
import { onMounted, onUnmounted, watch, ref, computed } from 'vue'

import VIcon from './VIcon.vue'
import CopyIcon from '../icons/CopyIcon.vue'
import CheckIcon from '../icons/CheckIcon.vue'
import CloseIcon from '../icons/CloseIcon.vue'
import CodeIcon from '../icons/CodeIcon.vue'

const sizeConfig = {
    'xs':{
        fontSize: 12,
        lineHeight: 16,
        padding: {
            top: 7.5,
            bottom: 7.5
        },
    },
    'sm':{
        fontSize: 14,
        lineHeight: 20,
        padding: {
            top: 7.5,
            bottom: 7.5
        },
    },
    'md':{
        fontSize: 16,
        lineHeight: 24,
        padding: {
            top: 7.5,
            bottom: 7.5
        },
    },
    'lg':{
        fontSize: 20,
        lineHeight: 30,
        padding: {
            top: 7.5,
            bottom: 7.5
        },
    },
    'xl':{
        fontSize: 24,
        lineHeight: 34,
        padding: {
            top: 7.5,
            bottom: 7.5
        },
    }
}

export default {
    name: 'VCodeEditor',
    emits: [
        'update:modelValue'
    ],
    components:{
        VIcon
    },
    props:{
        modelValue:{
            type: String,
            default: ''
        },
        monaco:{ // Necessity Required
            type: Object,
            default: null,
        },
        language:{
            type: String,
            default: 'javascript'
        },
        size:{
            type: String,
            default:'sm'
        },
        autoResize:{
            type: Boolean,
            default: false,
        },
        theme:{ // dark or 'light'
            type: String,
            default: 'dark'
        },
        placeholder:{
            type: String,
            default:'// Write your code here'
        },
        minimap:{
            type: Boolean,
            default: false,
        },
        readOnly: {
            type: Boolean,
            default: false,
        },
        // 視窗大小（最少顯示幾行）只在 autoResizeHeight 開啟時生效
        minRows: {
            type: Number,
            default: 1
        },
        // 視窗大小（最多顯示幾行的高度但不超過父容器）只在 autoResizeHeight 開啟時生效
        maxRows: Number,

        // 限制最多行數
        maxLines: Number,

        // 是否顯示標題列
        header:{
            type: Boolean,
            default: true,
        },
        headerTitle:{
            type: String,
            default: ''
        }
    },
    setup(props, context){
        let monaco = props.monaco;

        if(!monaco){
            throw new Error(`
                [VCodeEditor] Monaco instance not found.

                Possible solutions:
                1. Install and configure Monaco Editor.
                2. Register the Monaco plugin before mounting the app.
                3. Pass the Monaco instance via the \`monaco\` prop.

                Example:
                <VCodeEditor :monaco="monaco" />`
            )
        }

        // define custom theme
        monaco.editor.defineTheme('vorium-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': '#0A0A0A',
                'scrollbarSlider.background': '#2A2A2A80',
                'scrollbarSlider.hoverBackground': '#3A3A3ACC',
                'scrollbarSlider.activeBackground': '#4A4A4AFF',

            }
        })

        monaco.editor.defineTheme('vorium-light', {
            base: 'vs',
            inherit: true,
            rules: [],
            colors: {
                'scrollbarSlider.background': '#D0D0D080',
                'scrollbarSlider.hoverBackground': '#B8B8B8CC',
                'scrollbarSlider.activeBackground': '#A0A0A0FF',
            }
        })

        // headerHeight
        const headerSizeMap = {
            'xs':{ fontSize: 12, height: 34},
            'sm':{ fontSize: 14, height: 38},
            'md':{ fontSize: 16, height: 42},
            'lg':{ fontSize: 20, height: 50},
            'xl':{ fontSize: 24, height: 58}
        };
        
        const headerStyle = computed(()=>{
            const target = headerSizeMap[props.size];
            return {
                fontSize: target.fontSize + 'px',
                height: target.height + 'px'
            }
        })

        // editor
        const editor = ref();
        const editorWrapper = ref()

        let editorInstance = null;

        const editorConfig = {
            value: props.modelValue,
            language: props.language,
            theme: props.theme =='dark' ? 'vorium-dark' : 'vorium-light',
            minimap:{
                enabled: props.minimap
            },
            readOnly: props.readOnly,
            automaticLayout: true,
            ...sizeConfig[props.size],
        }

        // AutoResizeHeight
        let autoResizeHeight = ref(0);

        function calculateAutoResizeHeight(){
            
            if(!props.autoResize) return;
            const config = sizeConfig[props.size];
            let lineCount =  Math.max(editorInstance?.getModel()?.getLineCount() ?? 1, props.minRows);   

            // 視窗大小（最多顯示幾行但不超過父容器高度）
            if(props.maxRows && lineCount > props.maxRows) lineCount = props.maxRows;

            const parentHeight = editorWrapper.value?.parentElement?.parentElement?.clientHeight ?? Infinity;
            const currentHeight = lineCount * config.lineHeight + (config.padding.top + config.padding.bottom);

            const offset = props.header ? headerSizeMap[props.size].height:0;
            autoResizeHeight.value = Math.min(currentHeight , parentHeight - offset);

        }

        // action slot
        const hasActionSlot = computed(() => !!context.slots.action);

        onMounted(() => {

            // 初始化創建
            editorInstance = monaco.editor.create(editor.value, editorConfig)
            calculateAutoResizeHeight();

            if(props.modelValue == ''){
                context.emit('update:modelValue',props.placeholder)
            }

            // 監聽頁面內容變動
            editorInstance.onDidChangeModelContent(
                () => {
                    const value = editorInstance.getValue();
                    const lineCount = editorInstance.getModel().getLineCount();

                    // maxLines 限制
                    if(props.maxLines && lineCount > props.maxLines){
                        editorInstance.trigger('keyboard','undo')
                        return;
                    }

                    context.emit('update:modelValue',value);
                    calculateAutoResizeHeight();
                }
            )
        })
        onUnmounted(() => {
            editorInstance?.dispose()
        })

        // 監聽參數變動
        watch(() => props.modelValue, value => {
            if (!editorInstance) return
            if (value === editorInstance.getValue()) return
            editorInstance.setValue(value)
        })

        watch(() => props.language, language => {
            if (!editorInstance) return
            monaco.editor.setModelLanguage(editorInstance.getModel(), language)
        })

        watch(() => props.theme, theme => {
            monaco.editor.setTheme(theme === 'dark' ? 'vs-dark' : 'vs')
        })

        watch(() => props.readOnly, value => {
            editorInstance?.updateOptions({
                readOnly: value
            })
        })

        watch(() => props.minimap, value => {
            editorInstance?.updateOptions({
                minimap: {
                    enabled: value
                }
            })
        })

        watch(() => props.size, size => {
            if (!editorInstance) return

            const config = sizeConfig[size] ?? sizeConfig.sm

            editorInstance.updateOptions({
                fontSize: config.fontSize,
                lineHeight: config.lineHeight
            })

            calculateAutoResizeHeight()
        })

        watch(() => props.autoResize, () => {
            calculateAutoResizeHeight()
        })

        // functions
        let copyTimer = null;
        let copyStatus = ref(0);
        async function copy(){
            try{
                navigator.clipboard.writeText(props.modelValue);
                copyStatus.value = 1; // 成功
            }
            catch(e){
                copyStatus.value = 2; // 失敗
            }
            finally{
                await new Promise((r)=>{ setTimeout(() => { r() }, 2000)})
                copyStatus.value = 0;
            }
        }

        return {
            editor, editorWrapper, autoResizeHeight, headerStyle, CopyIcon, hasActionSlot, copy, copyStatus,
            CheckIcon, CloseIcon, CodeIcon
        }
    }
}
</script>

<style scoped>
.v-code-editor-wrapper-with-header{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: top;
    background: black;
}
.v-code-editor-wrapper{
    width: 100%;
    flex-shrink: 0;
}
.v-code-editor-header{
    box-sizing: border-box;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    padding-left: 20px;
    padding-right: 20px;
    box-sizing: border-box;
    border-radius: 3px 3px 0 0;
}
.v-code-editor-header-dark{
    background: rgba(255,255,255,0.1);
    color: rgba(220,220,220);
}
.v-code-editor-header-light{
    background: white;
    color: rgba(130,130,130);
    border-bottom: 0.1px solid rgba(0,0,0,0.07);
}

.v-code-editor-header-action{
    margin-left: auto;
}
.v-code-editor-header-language{
    display: flex;
    align-items: center;
}
.v-code-editor-header-language-title{
    margin-left: 10px;
}
.v-code-editor{
    width: 100%;
    height: 100%;
}

.v-code-editor-icon-wrapper{
    cursor: pointer;
    display: flex;
    align-items: center;
}
.v-code-editor-icon{
    margin-right: 5px;
}
</style>