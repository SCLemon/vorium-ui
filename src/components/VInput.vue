<template>
  <div class="v-input-wrapper" :class="[`v-input-wrapper--${size}`,
    {'v-input-wrapper-is-disabled': disabled,'v-input-wrapper-is-disabled-is-round': disabled && round, 'v-input-wrapper-is-focus': isFocus && hasBorder,'v-input-wrapper-is-round': round && hasBorder, 'v-input-wrapper-has-border': hasBorder}]" @mouseenter="isHover = true" @mouseleave="isHover = false">
    <VIcon class="v-input-wrapper-icon" v-if="showIcon" :icon="icon" :size="iconSize"></VIcon>
    <div class="v-input-box">
        <input ref="input_element" class="v-input" :class="[`v-input-${size}`]" 
            @focus="isFocus = true" @blur="isFocus = false"
            v-model="model" :type="type" :placeholder="placeholder" :disabled="disabled">
        <div v-if="(!disabled && modelValue && (isFocus || isHover))">
            <VIcon v-if="clearable && (type!='password' || !showPassword)" class="v-input-icon" :icon="CloseIcon" :size="iconSize" @mousedown.prevent  @click.stop="clear()"></VIcon>
            <VIcon v-else-if="(type == 'password' && showPassword)" class="v-input-icon" :icon="passwordIsOpen?EyeOffIcon:EyeIcon" :size="iconSize" @mousedown.prevent  @click.stop="togglePassword()"></VIcon>
        </div>
        <div>
            <div v-if="(!isFocus && !disabledHotKey && !(hasActionSlot && modelValue))" class="v-input-send-button-wrapper" :class="[`v-input-send-button-wrapper-${size}`,{'v-input-send-button-wrapper-is-round': round}]">Ctrl+{{ hotKey }}</div>
            <div class="v-input-action-slot-wrapper" v-else-if="hasActionSlot && modelValue">
                <slot name="action"></slot>
            </div>
        </div>
    </div>
    <div v-if="isFocus && !disabled && type!='password' && (suggestionList.length || suggestionListIsLoading)" class="v-input-suggestion-list-wrapper-with-triangle" :class="[`v-input-suggestion-list-wrapper-with-triangle-${suggestionListDirection}`, `v-input-suggestion-list-wrapper-with-triangle-${suggestionListDirection}-${size}`]">
        <div class="v-input-suggestion-list-wrapper" :class="[`v-input-suggestion-list-wrapper-${size}`]" >
            <div v-if="!suggestionListIsLoading" class="v-input-suggestion-list-item" :class="[`v-input-suggestion-list-item-${size}`]" 
                @mousedown.prevent @click.stop="setValueFromSuggestion(item)" v-for="(item, i) in suggestionList" :key="i">
                <div class="v-input-suggestion-list-text">{{ item }}</div>
            </div>
            <div v-else class="v-input-suggestion-list-item v-input-suggestion-list-item-is-loading" :class="[`v-input-suggestion-list-item-${size}`]" @mousedown.prevent>
                <VIcon :icon="LoadingIcon" :size="iconSize"></VIcon>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted,computed, useModel, ref } from 'vue';
import VIcon from './VIcon.vue';
import { SearchIcon, CloseIcon, EyeIcon, EyeOffIcon, LoadingIcon } from '../icons/index.js';
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
        round:{
            type: Boolean,
            default: false
        },
        hasBorder:{
            type: Boolean,
            default: true
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

        // action slot
        const hasActionSlot = computed(() => !!context.slots.action);

        return{
            model, hasActionSlot, input_element, isFocus, isHover, iconSize, CloseIcon, LoadingIcon, EyeIcon, EyeOffIcon, clear, togglePassword, setValueFromSuggestion, passwordIsOpen
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
    background: var(--v-surfaces-ghost);
}
.v-input-wrapper-has-border{
    border: var(--v-border);
    border-radius: var(--v-border-radius);
}
.v-input-wrapper-is-focus{
    border: var(--v-border-white);
}
.v-input-wrapper-is-round{
    border-radius: var(--v-border-radius-round);
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
.v-input-send-button-wrapper-is-round{
    border-radius: var(--v-border-radius-round);
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
.v-input-wrapper-is-disabled-is-round::before{
    border-radius: var(--v-border-radius-round);
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
   SuggestionList Popper
========================= */

.v-input-suggestion-list-wrapper-with-triangle{
    position: absolute;
    height: auto;
    width: 100%;
    box-sizing: border-box;
    z-index: 1;
    border: var(--v-border);
    border-radius: var(--v-border-radius);
    background: var(--v-surfaces-ghost);
}

.v-input-suggestion-list-wrapper-with-triangle-top{
    bottom: calc(100% + 10px);
    left: 0;
}
.v-input-suggestion-list-wrapper-with-triangle-bottom{
    top: calc(100% + 10px);
    left: 0;
}
.v-input-suggestion-list-wrapper-with-triangle-left{
    top:0;
    right: calc(100% + 10px);
}
.v-input-suggestion-list-wrapper-with-triangle-right{
    top:0;
    left: calc(100% + 10px);
}

.v-input-suggestion-list-wrapper-with-triangle::before,
.v-input-suggestion-list-wrapper-with-triangle::after{
    content: '';
    position: absolute;
    width: 0;
    height: 0;
}
.v-input-suggestion-list-wrapper-with-triangle-bottom::before{
    left: 50%;
    top: -8px;
    transform: translateX(-50%);
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid rgba(255,255,255,.15);
}
.v-input-suggestion-list-wrapper-with-triangle-bottom::after{
    left: 50%;
    top: -6px;
    transform: translateX(-50%);
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-bottom: 7px solid var(--v-surfaces-ghost);
}

.v-input-suggestion-list-wrapper-with-triangle-top::before{
    left: 50%;
    bottom: -8px;
    transform: translateX(-50%);
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid rgba(255,255,255,.15);
}
.v-input-suggestion-list-wrapper-with-triangle-top::after{
    left: 50%;
    bottom: -6px;
    transform: translateX(-50%);
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-top: 7px solid var(--v-surfaces-ghost);
}
.v-input-suggestion-list-wrapper-with-triangle-left::before{
    right: -8px;
    top: 50%;
    transform: translateY(-50%);
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-left: 8px solid rgba(255,255,255,.15);
}

.v-input-suggestion-list-wrapper-with-triangle-left::after{
    right: -6px;
    top: 50%;
    transform: translateY(-50%);
    border-top: 7px solid transparent;
    border-bottom: 7px solid transparent;
    border-left: 7px solid var(--v-surfaces-ghost);
}
.v-input-suggestion-list-wrapper-with-triangle-right::before{
    left: 50%;
    top: -8px;
    transform: translateX(-50%);
}
.v-input-suggestion-list-wrapper-with-triangle-right::before{
    left: -8px;
    transform: translateY(-50%);
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-right: 8px solid rgba(255,255,255,.15);
}
.v-input-suggestion-list-wrapper-with-triangle-right::after{
    left: -6px;
    transform: translateY(-50%);
    border-top: 7px solid transparent;
    border-bottom: 7px solid transparent;
    border-right: 7px solid var(--v-surfaces-ghost);
}
.v-input-suggestion-list-wrapper-with-triangle-right-xs::before,
.v-input-suggestion-list-wrapper-with-triangle-left-xs::before{
    top: calc(0.5 * var(--v-input-height-xs));
}
.v-input-suggestion-list-wrapper-with-triangle-right-xs::after,
.v-input-suggestion-list-wrapper-with-triangle-left-xs::after{
    top: calc(0.5 * var(--v-input-height-xs));
}
.v-input-suggestion-list-wrapper-with-triangle-right-sm::before,
.v-input-suggestion-list-wrapper-with-triangle-left-sm::before{
    top: calc(0.5 * var(--v-input-height-sm));
}
.v-input-suggestion-list-wrapper-with-triangle-right-sm::after,
.v-input-suggestion-list-wrapper-with-triangle-left-sm::after{
    top: calc(0.5 * var(--v-input-height-sm));
}
.v-input-suggestion-list-wrapper-with-triangle-right-md::before,
.v-input-suggestion-list-wrapper-with-triangle-left-md::before{
    top: calc(0.5 * var(--v-input-height-md));
}
.v-input-suggestion-list-wrapper-with-triangle-right-md::after,
.v-input-suggestion-list-wrapper-with-triangle-left-md::after{
    top: calc(0.5 * var(--v-input-height-md));
}
.v-input-suggestion-list-wrapper-with-triangle-right-lg::before,
.v-input-suggestion-list-wrapper-with-triangle-left-lg::before{
    top: calc(0.5 * var(--v-input-height-lg));
}
.v-input-suggestion-list-wrapper-with-triangle-right-lg::after,
.v-input-suggestion-list-wrapper-with-triangle-left-lg::after{
    top: calc(0.5 * var(--v-input-height-lg));
}
.v-input-suggestion-list-wrapper-with-triangle-right-xl::before,
.v-input-suggestion-list-wrapper-with-triangle-left-xl::before{
    top: calc(0.5 * var(--v-input-height-xl));
}
.v-input-suggestion-list-wrapper-with-triangle-right-xl::after,
.v-input-suggestion-list-wrapper-with-triangle-left-xl::after{
    top: calc(0.5 * var(--v-input-height-xl));
}

/* =========================
   SuggestionList
========================= */

.v-input-suggestion-list-wrapper{
    width: 100%;
    color: white;
    overflow-y: scroll;
    box-sizing: border-box;
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

/* =========================
   SuggestionList Item
========================= */

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

/* =========================
   Action-slot
========================= */

.v-input-action-slot-wrapper{
    margin-left: 10px;
    white-space: nowrap;
}
</style>