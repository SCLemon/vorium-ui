<template>
    <div class="v-checkbox-wrapper" :class="{ 'v-checkbox-wrapper-is-selected': isSelected, 'v-checkbox-wrapper-is-disabled': isDisabled, 'v-checkbox-wrapper-has-border': hasBorder }" :style="{ width, height, fontSize }" @click="handleClick">
        <input type="checkbox" :class="`v-checkbox-input v-checkbox-input-${checkBoxTheme}`" :disabled="isDisabled" :checked="isSelected" :value="value" v-if="showCheckBox" @click.stop>
        <div class="v-checkbox-label" :class="{'v-checkbox-label-is-disabled': isDisabled}">{{ label }}</div>
    </div>
</template>

<script>
import { inject, computed, onMounted, onUnmounted } from 'vue';

export default {
    name: 'VCheckBoxOption',

    props:{
        value:{
            default: null
        },

        label:{
            type: String,
            default: ''
        },

        width:{
            type: String,
            default:'fit-content'
        },

        height:{
            type: String,
            default: '38px'
        },

        fontSize:{
            type: String,
            default: '16px'
        },
        disabled:{ // 同時，不參與全選與反選
            type: Boolean,
            default: false
        },
        hasBorder:{
            type: Boolean,
            default: false
        },

        showCheckBox:{
            type: Boolean,
            default: true
        },

        checkBoxTheme:{
            type: String,
            default: 'white'
        }
    },

    setup(props){

        const group = inject('VCheckBoxGroup');

        if (!group) {
            console.warn(
                '[VCheckBoxOption] must be used inside VCheckBoxGroup'
            );
        }

        const isSelected = computed(() => {
            
            return group?.model.value?.includes(props.value) ?? false;
        });

        const handleClick = () => {

            if(isDisabled.value){
                return;
            }

            group?.toggle(props);
        }

        onMounted(()=>{
            group?.register(props)
        })

        onUnmounted(()=>{
            group?.unregister(props)
        })


        // 在達到最高數量限制時，判斷是否可選
        const isMaxReached = computed(() => {

            if(group?.max?.value === undefined) return false;

            return ( !isSelected.value && group.model.value.length >= group.max.value);
        });

        const isDisabled = computed(() => {
            return props.disabled || isMaxReached.value;
        });

        return {
            isSelected, isDisabled,
            handleClick
        }
    }
}
</script>

<style>
    .v-checkbox-wrapper{
        flex-shrink: 0;
        flex-grow: 0;
        color: gray;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-left: 10px;
        padding-right: 10px;
        position: relative;
        user-select: none;
        transition: color 0.8s ease, border 0.25s ease, background 0.25s ease;
    }

    .v-checkbox-wrapper-has-border{
        border: var(--v-border);
        border-radius: var(--v-border-radius);
    }

    /* wrapper hover */
    .v-checkbox-wrapper:not(.v-checkbox-wrapper-is-disabled):hover{
        cursor: pointer;
        color: white;
    }

    .v-checkbox-wrapper::before {
        content: "";
        position: absolute;
        inset: 0;
        opacity: 0;
        background: var(--v-surfaces-hover);
        transition: opacity 0.25s linear;
        border-radius: var(--v-border-radius);
        pointer-events: none;
    }

    .v-checkbox-wrapper.v-checkbox-wrapper-has-border:not(.v-checkbox-wrapper-is-disabled):hover::before {
        opacity: var(--v-opacity-hover);
    }
    .v-checkbox-wrapper.v-checkbox-wrapper-has-border:not(.v-checkbox-wrapper-is-disabled):active::before{
        opacity: var(--v-opacity-active);
    }

    /* selected */
    .v-checkbox-wrapper-is-selected{
        color: white;
    }
    .v-checkbox-wrapper-is-selected.v-checkbox-wrapper-has-border{
        border: var(--v-border-white);
        background: var(--v-surfaces-hover);
    }

    /* disabled */
    .v-checkbox-wrapper-is-disabled{
        cursor: not-allowed !important;
        color: rgba(255,255,255,0.15);
    }
    .v-checkbox-wrapper-is-disabled.v-checkbox-wrapper-has-border{
        background: rgba(255,255,255,0.1);
    }

    .v-checkbox-label-is-disabled{
        cursor: not-allowed;
    }

    /* input */
    .v-checkbox-input{
        margin-left: 0;
        margin-right: 0;
        margin-top: 1px;
        
    }
    .v-checkbox-input-black{
        accent-color: black;
    }
    .v-checkbox-input-white{
        accent-color: rgba(255,255,255,0.1);
    }
    .v-checkbox-input-is-disabled{
        cursor: not-allowed;
    }
    .v-checkbox-input + .v-checkbox-label{
        margin-left: 10px;
    }
</style>