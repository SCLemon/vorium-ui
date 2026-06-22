<template>
    <div class="v-radio-wrapper" :class="{ 'v-radio-wrapper-is-selected': isSelected, 'v-radio-wrapper-is-disabled': disabled, 'v-radio-wrapper-has-border': hasBorder }" :style="{ width, height, fontSize }" @click="!disabled && (model = value)">
        <input type="radio" :class="`v-radio-input v-radio-input-${radioTheme}`" :disabled="disabled" v-model="model" :value="value" v-if="showRadio" @click.stop>
        <div class="v-radio-label" :class="{'v-radio-label-is-disabled': disabled}">{{ label }}</div>
    </div>
</template>

<script>
import { useModel, computed } from 'vue';
export default {
    name: 'VRadio',
    emits:[
        'update:modelValue'
    ],
    props:{
        modelValue: {
            default: null
        },
        
        value:{
            default: null
        },

        label:{
            type: String,
            default: ''
        },

        width:{
            type: String,
            default: '100%'
        },
        height:{
            type: String,
            default: '38px'
        },
        fontSize:{
            type: String,
            default: '16px'
        },
        disabled:{
            type: Boolean,
            default: false
        },
        hasBorder:{
            type: Boolean,
            default: false
        },
        showRadio:{
            type: Boolean,
            default: true
        },
        radioTheme:{
            type: String,
            default: 'white'
        }
    },
    setup(props, context){
        // v-model
        const model = useModel(props, 'modelValue', context.emit);

        const isSelected = computed(() => {
            return model.value === props.value
        })

        return {
            model, isSelected
        }
    }
}
</script>

<style>
    .v-radio-wrapper{
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

    .v-radio-wrapper-has-border{
        border: var(--v-border);
        border-radius: var(--v-border-radius);
    }

    /* wrapper hover */
    .v-radio-wrapper:not(.v-radio-wrapper-is-disabled):hover{
        cursor: pointer;
        color: white;
    }

    .v-radio-wrapper::before {
        content: "";
        position: absolute;
        inset: 0;
        opacity: 0;
        background: var(--v-surfaces-hover);
        transition: opacity 0.25s linear;
        border-radius: var(--v-border-radius);
        pointer-events: none;
    }

    .v-radio-wrapper.v-radio-wrapper-has-border:not(.v-radio-wrapper-is-disabled):hover::before {
        opacity: var(--v-opacity-hover);
    }
    .v-radio-wrapper.v-radio-wrapper-has-border:not(.v-radio-wrapper-is-disabled):active::before{
        opacity: var(--v-opacity-active);
    }

    /* selected */
    .v-radio-wrapper-is-selected{
        color: white;
    }
    .v-radio-wrapper-is-selected.v-radio-wrapper-has-border{
        border: var(--v-border-white);
        background: var(--v-surfaces-hover);
    }

    /* disabled */
    .v-radio-wrapper-is-disabled{
        cursor: not-allowed !important;
        color: rgba(255,255,255,0.15);
    }
    .v-radio-wrapper-is-disabled.v-radio-wrapper-has-border{
        background: rgba(255,255,255,0.1);
    }

    .v-radio-label-is-disabled{
        cursor: not-allowed;
    }

    /* input */
    .v-radio-input{
        margin-left: 0;
        margin-right: 0;
        margin-top: 1px;
        
    }
    .v-radio-input-black{
        accent-color: black;
    }
    .v-radio-input-white{
        accent-color: rgba(255,255,255,0.1);
    }
    .v-radio-input-is-disabled{
        cursor: not-allowed;
    }
    .v-radio-input + .v-radio-label{
        margin-left: 10px;
    }
</style>