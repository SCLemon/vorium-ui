<template>
  <div class="v-select-wrapper" ref="selectRef" :class="{ 'v-select-wrapper-has-border': hasBorder, 'v-select-wrapper-is-disabled': disabled }" :style="{ width, height, '--v-select-border-color': borderColor }" @click.stop="toggle()">
    <input class="v-select-input" :value="modelValue?.label || ''" :style="{ fontSize }" type="text" :placeholder="placeholder" readonly>
    <div class="v-select-icon" :class="{ [`v-select-icon-is-open-${direction}`]: isOpen }"><VIcon :icon="direction =='bottom' ? ChevronDownIcon : ChevronUpIcon"></VIcon></div>
    <div class="v-select-dropdown-wrapper" :class="[`v-select-dropdown-wrapper-${direction}`, { 'v-select-dropdown-wrapper-is-open':isOpen }]">
        <VDropdown class="v-select-dropdown" :hasBorder="hasBorder" :placement="direction" :style="{ fontSize }" 
        :isVisible="isOpen" :min-height="height" :arrowPosition="arrowPosition" :arrow-size="arrowSize" :dropDownBorderColor="borderColor" :background="dropDownBackground" :arrow-border-color="borderColor">
            <div class="v-select-dropdown-item-wrapper" :style="{ maxHeight: `calc(${height} * ${maxVisibleItems})`}" v-if="list.length">
                <div class="v-select-dropdown-item" :class="{ 'v-select-dropdown-item-selected': !item.disabled && modelValue?.value === item.value, 'v-select-dropdown-item-disabled': item.disabled}" :style="{ height, fontSize, lineHeight:height, textAlign }" v-for="(item, id) in list" :key="id" @click.stop="!item.disabled && setValue(item)">{{ item.label }}</div>
            </div>
            <div v-else>
                <div class="v-select-dropdown-item-empty" :style="{ height, fontSize, lineHeight:height }">{{ emptyText }}</div>
            </div>
        </VDropdown>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import ChevronDownIcon from '@/icons/ChevronDownIcon.vue';
import ChevronUpIcon from '@/icons/ChevronUpIcon.vue';
import VDropdown from './VDropdown.vue';
import VIcon from './VIcon.vue';
export default {
    name: 'VSelect',
    components:{
        VDropdown, VIcon
    },
    emits: ['update:modelValue'],
    props:{
        modelValue: {
            type: Object,
            default: null
        },
        direction:{
            type: String,
            default: 'bottom'
        },
        width:{
            type: String,
            default: '100%',
        },
        height:{
            type:String,
            default: '35px'
        },
        fontSize:{
            type: String,
            default: '12px'
        },
        textAlign:{
            type: String,
            default: 'left'
        },
        placeholder:{
            type: String,
            default: 'Select Something...'
        },
        disabled:{
            type:Boolean,
            default: false,
        },
        maxVisibleItems:{
            type:Number,
            default:4
        },
        emptyText:{
            type: String,
            default: 'Nothing here'
        },
        hasBorder:{
            type: Boolean,
            default: true,
        },
        borderColor:{
            type: String,
            default: 'rgba(255,255,255,0.12)'
        },
        dropDownBackground:{
            type: String,
            default: 'black'
        },
        arrowPosition:{
            type: String,
            default: '40px',
        },
        arrowSize: {
            type: String,
            default: '8px'
        },
        list:{ // label, value, disabled
            type: Array,
            default:() => []
        }
    },
    setup(props, context){

        const isOpen = ref(false);

        function setValue(item){
            context.emit('update:modelValue', item);
            isOpen.value = false
        }

        const selectRef = ref(null)

        function handleClickOutside(event){
            if (!selectRef.value?.contains(event.target)) {
                isOpen.value = false
            }
        }

        function toggle() {
            if (props.disabled) return
            isOpen.value = !isOpen.value
        }


        onMounted(() => {
            document.addEventListener('click', handleClickOutside)
        })

        onUnmounted(() => {
            document.removeEventListener('click', handleClickOutside)
        })

        watch(
            () => props.disabled,
            (disabled) => {
                if (disabled) {
                    isOpen.value = false
                }
            }
        )


        return {
            ChevronDownIcon, ChevronUpIcon, isOpen, setValue, selectRef, toggle
        }
    }
}
</script>

<style>
    /* select */
    .v-select-wrapper{
        width:100%;
        display: flex;
        align-items: center;
        color: white;
        box-sizing: border-box;
        padding-left: 10px;
        padding-right: 10px;
        border-radius: var(--v-border-radius);
        position: relative;
    }

    .v-select-wrapper-is-disabled:before{
        content: "";
        position: absolute;
        inset: 0;
        opacity: 1;
        background: var(--v-surfaces-hover);
        transition: opacity var(--v-transition-fast);
        border-radius: var(--v-border-radius);
        cursor: not-allowed;
        pointer-events: none;
    }

    .v-select-wrapper-has-border{
        border: 0.1px solid var(--v-select-border-color);
    }
    .v-select-input{
        width: 100%;
        flex-grow: 0;
        outline: 0;
        background: transparent;
        color: var(--v-text-gray);
        border: 0;
        margin-right: 5px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .v-select-input:hover{
        cursor: pointer;
    }
    .v-select-icon{
        flex-shrink: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.3s ease;
        color: gray;
    }
    .v-select-icon-is-open-top{
        rotate: -180deg;
        color: white;
    }
    .v-select-icon-is-open-bottom{
        rotate: 180deg;
        color: white;
    }
    .v-select-icon:hover{
        cursor: pointer;
    }

    /* dropdown */
    .v-select-dropdown-wrapper{
        position: absolute;
        left: 0;
        width: 100%;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
    }
    .v-select-dropdown-wrapper-is-open{
        opacity: 1;
        pointer-events: auto;
    }
    .v-select-dropdown-wrapper-top{
        bottom: calc(100% + 12.5px);
    }
    .v-select-dropdown-wrapper-bottom{
        top: calc(100% + 12.5px);
    }

    /* item */
    .v-select-dropdown-item-wrapper{
        width: 100%;
        height: auto;
        overflow-y: auto;
    }
    .v-select-dropdown-item{
        width: 100%;
        padding-left: 10px;
        padding-right: 10px;
        box-sizing: border-box;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        box-sizing: border-box;
        color: var(--v-text-gray);
    }
    .v-select-dropdown-item-empty{
        text-align: center;
        color: rgba(255,255,255,0.4);
    }
    
    .v-select-dropdown-item-selected,
    .v-select-dropdown-item:hover{
        position: relative;
        cursor: pointer;
        background: var(--v-surfaces-hover);
        color: white;
    }
    .v-select-dropdown-item-disabled{
        color: gray;
    }
    .v-select-dropdown-item-disabled:hover{
        cursor:not-allowed;
        background: none;
        color: gray;
    }
</style>