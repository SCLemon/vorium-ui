<template>
    <div class="v-switch-wrapper-all">
        <div class="v-switch-wrapper-inactiveText" :class="{'v-switch-wrapper-selected': !model, 'v-switch-wrapper-text-hover-disabled': disabled }" v-if="inactiveText" @click="disabled?'':model = false">{{ inactiveText }}</div>
        <div ref="switchWrapperRef" 
            :class="[
                'v-switch-wrapper',
                `v-switch-wrapper-${model? 'on':'off'}`,
                {
                    'v-switch-wrapper-is-disabled': disabled       
                }
            ]" 
            :style="{ width, height }" @click="toggle()">
            <div :class="`v-switch-knob v-switch-knob-${model? 'on':'off'}`" :style="{ '--v-switch-knob-offsetX':`translateX(${offsetX}px)` }"></div>
        </div>
        <div class="v-switch-wrapper-activeText" :class="{'v-switch-wrapper-selected': model, 'v-switch-wrapper-text-hover-disabled': disabled }" v-if="activeText" @click="disabled?'':model = true">{{ activeText }}</div>
    </div>
</template>

<script>
import { computed, ref, useModel } from 'vue';

export default {
    name: 'VSwitch',
    emits: [
        'update:modelValue'
    ],
    props:{
        modelValue:{
            type: Boolean,
            default: false
        },
        width:{
            type: String,
            default: '40px'
        },
        height:{
            type: String,
            default: '20px'
        },
        disabled:{
            type: Boolean,
            default: false
        },
        activeText:{
            type: String,
            default: '',
        },
        inactiveText:{
            type: String,
            default: ''
        }
    },
    setup(props, context){
        
        const switchWrapperRef = ref(null);

         // v-model
        const model = useModel(props, 'modelValue', context.emit)

        const offsetX = computed(() => {
            const wrapper = switchWrapperRef.value

            if (!wrapper) return 0

            const knobSize = wrapper.clientHeight
            const travelDistance = wrapper.clientWidth - knobSize - 3

            return travelDistance
        })

        function toggle(){
            if(props.disabled) return
            model.value = !model.value
        }

        return {
            model, offsetX, toggle, switchWrapperRef
        }
    }
}
</script>

<style>
    .v-switch-wrapper-all{
        display: flex;
        align-items: center;
        box-sizing: border-box;
        user-select: none;
    }
    .v-switch-wrapper{
        position: relative;
        box-sizing: border-box;
        border-radius: var(--v-border-radius-round);
        display: flex;
        align-items: center;
        padding-left: 3px;
        flex-shrink: 0;
        flex-grow: 0;
    }
    .v-switch-knob{
        height: calc(100% - 3px);
        aspect-ratio: 1/1;
        border-radius: var(--v-border-radius-round);
        box-sizing: border-box;
        transition: transform .2s ease;
    }
    .v-switch-wrapper:hover{
        cursor: pointer;
    }

    /* ON & OFF */
    .v-switch-wrapper-off{
        background: #2C2C2C;
    }
    .v-switch-knob-off{
        background: #B3B3B3;
        transform: translateX(0px);
    }

    .v-switch-wrapper-on{
        background: #FFFFFF;
    }
    .v-switch-knob-on{
        background: #000000;
        transform: var(--v-switch-knob-offsetX);
    }

    /* active/inactive text */
    .v-switch-wrapper-activeText,
    .v-switch-wrapper-inactiveText{
        color: #6B6B6B;
        transition: color 0.2s ease;
    }

    .v-switch-wrapper-activeText{
        margin-left: 10px;    
    }
    .v-switch-wrapper-inactiveText{
        margin-right: 10px;
    }

    .v-switch-wrapper-activeText:hover,
    .v-switch-wrapper-inactiveText:hover{
        cursor: pointer;
        
    }
    .v-switch-wrapper-selected{
        color: #FFFFFF;
    }
    .v-switch-wrapper-text-hover-disabled:hover{
        cursor: not-allowed;
    }

    /* Disabled */
    .v-switch-wrapper-is-disabled{
        cursor: not-allowed !important;
    }
    .v-switch-wrapper-is-disabled::before {
        content: "";
        position: absolute;
        inset: 0;
        opacity: 1;
        background: var(--v-surfaces-hover);
        transition: opacity var(--v-transition-fast);
        border-radius: inherit;
        cursor: not-allowed;
    }
</style>