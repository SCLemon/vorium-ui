<template>
  <div class="v-textarea-wrapper" 
  :class="{'v-textarea-wrapper-is-disabled': disabled, 'v-textarea-wrapper-has-border': hasBorder, 'v-textarea-wrapper-is-focus': hasBorder && isFocus}" 
  :style="{ '--v-textarea-border-color': borderColor }">
    <textarea v-model="model" ref="textareaRef" :rows="minRows" :maxlength="setMaxLengthLimit ? maxLength : undefined"  :disabled="disabled" :readonly="readonly" class="v-textarea" :style="textareaStyle" :placeholder="placeholder" @focus="isFocus = true" @blur="isFocus = false"></textarea>
    <div class="v-textarea-count" v-if="setMaxLengthLimit">{{ textCount }} / {{ maxLength }}</div>
  </div>
</template>

<script>
import { ref, onMounted, computed, useModel, watch } from 'vue';

export default {
    name: 'VTextArea',
    emits: ['update:modelValue'],
    props:{
        modelValue:{
            type: String,
            default: ''
        },
        minRows:{
            type: Number,
            default: 1
        },
        maxRows:{
            type: Number,
            default: 10
        },
        setMaxLengthLimit:{
            type: Boolean,
            default: true,
        },
        maxLength:{
            type: Number,
            default: 100,
        },
        fontSize:{
            type: String,
            default: '14px'
        },
        lineHeight:{
            type: Number,
            default: 1.35
        },
        textAlign:{
            type: String,
            default: 'left'
        },
        placeholder:{
            type: String,
            default: 'Input Something...'
        },
        disabled:{
            type: Boolean,
            default: false,
        },
        readonly:{
            type:Boolean,
            default:false
        },
        hasBorder:{
            type: Boolean,
            default: true,
        },
        borderColor:{
            type: String,
            default: 'rgba(255,255,255,0.12)'
        }
    },
    setup(props, context){
        const textareaRef = ref();

        const textCount = ref(0);

        const isFocus = ref(false);

        const textareaStyle = computed(() => {

            return {
                fontSize: props.fontSize,
                lineHeight: props.lineHeight,
                textAlign: props.textAlign,
            }
        })
            
        onMounted(() => {
            textCount.value = props.modelValue.length
            resize()
        })

        // v-model
        const model = useModel(props, 'modelValue', context.emit)

        function resize(){

            const el = textareaRef.value

            if (!el) return

            el.style.height = 'auto'

            const style = getComputedStyle(el)

            const maxHeight =
                parseFloat(style.lineHeight) *
                props.maxRows +
                parseFloat(style.paddingTop) +
                parseFloat(style.paddingBottom)

            const nextHeight = Math.min(el.scrollHeight, maxHeight);

            el.style.height = `${nextHeight}px`
            el.style.overflowY = el.scrollHeight > maxHeight ? 'auto': 'hidden'
        }

        watch(model, (val) => {

            textCount.value = val?.length || 0

            requestAnimationFrame(resize)
        })


        return {
            textareaRef, textareaStyle, textCount, model, isFocus
        }

    },
}
</script>

<style>
    .v-textarea-wrapper{
        width: 100%;
        border: none;
        position: relative;
    }
    .v-textarea-wrapper-has-border{
        border: 0.1px solid var(--v-textarea-border-color);
        border-radius: var(--v-border-radius);
    }
    .v-textarea-wrapper-is-focus{
        border: var(--v-border-white);
    }
    .v-textarea{
        width: 100%;
        height: auto;
        border: 0;
        box-sizing: border-box;
        background: transparent;
        color: white;
        outline: 0;
        resize: none;
        padding: 7.5px 7.5px 5px 10px;
    }
    .v-textarea-count{
        color: gray;
        font-size: 14px;
        text-align: right;
        box-sizing: border-box;
        
        padding-right: 9.5px;
        padding-bottom: 7.5px;
        
    }

    .v-textarea-wrapper-is-disabled{
        cursor: not-allowed;
    }
    .v-textarea-wrapper-is-disabled::before {
        content: "";
        position: absolute;
        inset: 0;
        opacity: 1;
        background: var(--v-surfaces-hover);
        transition: opacity var(--v-transition-fast);
        border-radius: var(--v-border-radius);
        cursor: not-allowed;
    }
    .v-textarea-wrapper-is-disabled-is-round::before{
        border-radius: var(--v-border-radius-round);
    }
</style>