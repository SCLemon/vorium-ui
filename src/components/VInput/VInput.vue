<template>
  <div class="v-input-wrapper" :class="[`v-input-wrapper--${size}`,{'v-input-wrapper-is-disabled': disabled}]" @mouseenter="isHover = true" @mouseleave="isHover = false">
    <VIcon class="v-input-wrapper-icon" v-if="showIcon" :icon="icon" :size="iconSize"></VIcon>
    <div class="v-input-box">
        <input ref="input_element" class="v-input" :class="[`v-input-${size}`]" 
            @focus="isFocus = true" @blur="isFocus = false"
            v-model="model" :type="type" :placeholder="placeholder" :disabled="disabled">
        <div v-if="(!disabled && modelValue && (isFocus || isHover))">
            <VIcon v-if="clearable && (type!='password' || !showPassword)" class="v-input-icon" :icon="CloseIcon" :size="iconSize" @mousedown.prevent  @click.stop="clear()"></VIcon>
            <VIcon v-else-if="(type == 'password' && showPassword)" class="v-input-icon" :icon="passwordIsOpen?EyeOffIcon:EyeIcon" :size="iconSize" @mousedown.prevent  @click.stop="togglePassword()"></VIcon>
        </div>
        <div v-if="(!isFocus && !disabledHotKey)" class="v-input-send-button-wrapper" :class="[`v-input-send-button-wrapper-${size}`]">Ctrl+{{ hotKey }}</div>
    </div>
    <div v-if="isFocus && (suggestionList.length || suggestionListIsLoading)" class="v-input-suggestion-list-wrapper" :class="[`v-input-suggestion-list-wrapper-${suggestionListDirection}`, `v-input-suggestion-list-wrapper-${size}`]">
        <div v-if="!suggestionListIsLoading" class="v-input-suggestion-list-item" :class="[`v-input-suggestion-list-item-${size}`]" @mousedown.prevent @click.stop="setValueFromSuggestion(item)" v-for="(item, i) in suggestionList" :key="i">
            <div class="v-input-suggestion-list-text">{{ item }}</div>
        </div>
        <div v-else class="v-input-suggestion-list-item v-input-suggestion-list-item-is-loading" :class="[`v-input-suggestion-list-item-${size}`]" @mousedown.prevent>
            <VIcon :icon="LoadingIcon" :size="iconSize"></VIcon>
        </div>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted,computed, useModel, ref } from 'vue';
import VIcon from '../VIcon.vue';
import { SearchIcon, CloseIcon, EyeIcon, EyeOffIcon, LoadingIcon } from '@/icons/index.js';
export default {
    name:'VInput',
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
        size:{
            type: String,
            default: 'md'
        },
        type: {
            type: String,
            default: 'text'
        },
        disabled:{
            type: Boolean,
            default: false
        },
        clearable:{
            type: Boolean,
            default: true,
        },
        showPassword:{
            type: Boolean,
            default: true,
        },
        placeholder:{
            type: String,
            default: 'Input Placeholder...'
        },
        showIcon:{
            type: Boolean,
            default: true,
        },
        icon:{
            type:Object,
            default:() => SearchIcon
        },
        hotKey:{
            type: String,
            default: 'F'
        },
        disabledHotKey:{
            type: Boolean,
            default: false,
        },
        suggestionList:{
            type: Array,
            default: []
        },
        suggestionListDirection:{
            type: String,
            default: 'bottom'
        },
        suggestionListIsLoading:{
            type: Boolean,
            default: false,
        }
    },
    setup(props, context){
        
        const input_element = ref();

        let isFocus = ref(false);
        let isHover = ref(false);
        let passwordIsOpen = ref(false);

        // v-model
        const model = useModel(props, 'modelValue', context.emit)


        // hotKey
        const handleKeydown = (e) => {
            if(props.disabledHotKey || props.disabled) return;
            if ((e.ctrlKey || e.metaKey) && (e.key).toLowerCase() === (props.hotKey).toLowerCase()) {
                e.preventDefault()
                input_element.value?.focus()
                input_element.value?.select()
            }
        }
        onMounted(() => {
            window.addEventListener('keydown', handleKeydown)
        })
        onUnmounted(() => {
            window.removeEventListener('keydown', handleKeydown)
        })


         // loading 圖案大小
        const sizeMap = {
            xs: 12, sm: 14, md: 16, lg: 18, xl: 20,
        }
        const iconSize = computed(() => sizeMap[props.size] || 16)

        // functions
        function clear(){
            model.value = ''
        }
        function togglePassword(){
            const isOpen = (input_element.value.type !== 'password');
            input_element.value.type = isOpen ? 'password' : 'text';
            passwordIsOpen.value = !isOpen;
        }
        function setValueFromSuggestion(value){
            model.value = value
            isFocus.value = false;
            input_element.value.blur();
        }

        return{
            model, input_element, isFocus, isHover, iconSize, CloseIcon, LoadingIcon, EyeIcon, EyeOffIcon, clear, togglePassword, setValueFromSuggestion, passwordIsOpen
        }
    }
}
</script>

<style>

/* =========================
   Common
========================= */
.v-input-wrapper{
    width: 100%;
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 5px 10px;
    color: white;
    border: var(--v-border);
    border-radius: var(--v-border-radius);
    background: var(--v-surfaces-ghost);
}
.v-input-box{
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
}
.v-input{
    outline: none;
    width: 100%;
    border: 0;
    color: white;
    background: black;
    display: block;
}
.v-input-wrapper-icon{
    margin-right: 10px;
}
.v-input-icon{
    margin-left: 10px;
    color: var(--v-text-gray);
    cursor: pointer;
}
.v-input-send-button-wrapper{
    white-space: nowrap;
    margin-left: 10px;
    padding: 7px 10px;
    border: var(--v-border);
    border-radius: var(--v-border-radius);
    color: var(--v-text-gray);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* =========================
   Disabled
========================= */

.v-input-wrapper-is-disabled{
    cursor: not-allowed;
}
.v-input-wrapper-is-disabled::before {
    content: "";
    position: absolute;
    inset: 0;
    opacity: 1;
    background: var(--v-surfaces-hover);
    transition: opacity var(--v-transition-fast);
    border-radius: var(--v-border-radius);
    cursor: not-allowed;
}

/* =========================
   Size
========================= */

.v-input-wrapper--xs{
    height: var(--v-input-height-xs);
}
.v-input-wrapper--sm{
    height: var(--v-input-height-sm);
}
.v-input-wrapper--md{
    height: var(--v-input-height-md);
}
.v-input-wrapper--lg{
    height: var(--v-input-height-lg);
}
.v-input-wrapper--xl{
    height: var(--v-input-height-xl);
}

.v-input-xs{
    font-size: var(--v-input-font-xs);
}
.v-input-sm{
    font-size: var(--v-input-font-sm);
}
.v-input-md{
    font-size: var(--v-input-font-md);
}
.v-input-lg{
    font-size: var(--v-input-font-lg);
}
.v-input-xl{
    font-size: var(--v-input-font-xl);
}

.v-input-send-button-wrapper-xs{
    font-size: 8px;
}
.v-input-send-button-wrapper-sm{
    font-size: 9px;
}
.v-input-send-button-wrapper-md{
    font-size: 10px;
}
.v-input-send-button-wrapper-lg{
    font-size: 11px;
}
.v-input-send-button-wrapper-xl{
    font-size: 12px;
}

/* =========================
   SuggestionList
========================= */

.v-input-suggestion-list-wrapper{
    position: absolute;
    width: 100%;
    height: auto;
    color: white;
    overflow-y: scroll;
    border: var(--v-border);
    background: var(--v-surfaces-ghost);
    box-sizing: border-box;
}
.v-input-suggestion-list-wrapper-top{
    bottom: calc(100% + 10px);
    left: 0;
}
.v-input-suggestion-list-wrapper-bottom{
    top: calc(100% + 10px);
    left: 0;
}
.v-input-suggestion-list-wrapper-left{
    top:0;
    right: calc(100% + 10px);
}
.v-input-suggestion-list-wrapper-right{
    top:0;
    left: calc(100% + 10px);
}

.v-input-suggestion-list-wrapper-xs{
    font-size: var(--v-input-font-xs);
    max-height: calc(4 * var(--v-input-height-xs));
}
.v-input-suggestion-list-wrapper-sm{
    font-size: var(--v-input-font-sm);
    max-height: calc(4 * var(--v-input-height-sm));
}
.v-input-suggestion-list-wrapper-md{
    font-size: var(--v-input-font-md);
    max-height: calc(4 * var(--v-input-height-md));
}
.v-input-suggestion-list-wrapper-lg{
    font-size: var(--v-input-font-lg);
    max-height: calc(4 * var(--v-input-height-lg));
}
.v-input-suggestion-list-wrapper-xl{
    font-size: var(--v-input-font-xl);
    max-height: calc(4 * var(--v-input-height-xl));
}

.v-input-suggestion-list-item{
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding-left: 10px;
    padding-right: 10px;
}

.v-input-suggestion-list-item:hover{
    cursor: pointer;
    background: var(--v-surfaces-hover);
}

.v-input-suggestion-list-text{
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.v-input-suggestion-list-item-xs{
    height: var(--v-input-height-xs);
}
.v-input-suggestion-list-item-sm{
    height: var(--v-input-height-sm);
}
.v-input-suggestion-list-item-md{
    height: var(--v-input-height-md);
}
.v-input-suggestion-list-item-lg{
    height: var(--v-input-height-lg);
}
.v-input-suggestion-list-item-xl{
    height: var(--v-input-height-xl);
}

.v-input-suggestion-list-item-is-loading{
    justify-content: center;
}
.v-input-suggestion-list-item-is-loading:hover{
    background: none;
    cursor: wait;
}
</style>