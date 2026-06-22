<template>
    <div class="v-input-number-wrapper" :style="{ width, height }">
        <div class="v-input-number-input-wrapper" :class="{ 'v-input-number-input-wrapper-disabled': disabled}">
            <input v-model="model" class="v-input-number-input" type="number" :style="{ fontSize }" :max="max" :min="min" :disabled="disabled" @wheel.prevent="onWheel">
        </div>
        <div class="v-input-number-button-wrapper">
            <div class="v-input-number-button v-input-number-button-top" :class="{ 'v-input-number-button-disabled': disabled || model >= max }" @mousedown="startIncrease" @mouseup="stop" @mouseleave="stop" @touchstart.prevent="startIncrease" @touchend="stop">
                <VIcon :icon="ChevronUpIcon" :size="iconSize"></VIcon>
            </div>
            <div class="v-input-number-button v-input-number-button-bottom" :class="{ 'v-input-number-button-disabled': disabled || model <= min }" @mousedown="startDecrease" @mouseup="stop" @mouseleave="stop" @touchstart.prevent="startDecrease" @touchend="stop">
                <VIcon :icon="ChevronDownIcon" :size="iconSize"></VIcon>
            </div>
        </div>
    </div>
</template>

<script>
import { useModel, watch, onUnmounted } from 'vue';
import ChevronUpIcon from '@/icons/ChevronUpIcon.vue';
import ChevronDownIcon from '@/icons/ChevronDownIcon.vue';
import VIcon from './VIcon.vue';
export default {
    name: 'VInputNumber',
    emits:[
        'update:modelValue'
    ],
    components:{
        VIcon
    },
    props:{
        modelValue:{
            type: Number,
            default: 0,
        },
        width: { // min-allowed-value is 100px to ensure the component has the best view
            type: String,
            default: '100%'
        },
        height:{
            type: String,
            default: '38px'
        },
        fontSize:{
            type: String,
            default: '14px'
        },
        iconSize:{
            type: Number,
            default: 16
        },
        min:{
            type: Number,
            default: -100,
        },
        max: {
            type: Number,
            default: 100,
        },
        disabled: {
            type: Boolean,
            default: false
        },
        step: {
            type: Number,
            default: 1
        },
        wheel: {
            type: Boolean,
            default: true
        }
    },
    setup(props, context){

        // v-model
        const model = useModel(props, 'modelValue', context.emit)


        // decrease & increase
        let holdTimer = null;
        let repeatTimer = null;

        const startDecrease = () => {

            stop();

            if(props.disabled) return;

            model.value -= props.step;

            holdTimer = setTimeout(() => {

                repeatTimer = setInterval(() => {
                    model.value -= props.step;
                }, 50);

            }, 400);
        };

        const startIncrease = () => {

            stop();

            if(props.disabled) return;

            model.value += props.step;

            holdTimer = setTimeout(() => {

                repeatTimer = setInterval(() => {
                    model.value += props.step;
                }, 50);

            }, 400);
        };

        const stop = () => {

            clearTimeout(holdTimer);
            clearInterval(repeatTimer);

            holdTimer = null;
            repeatTimer = null;
        };

        // wheel
        const onWheel = (e) => {

            if (props.disabled || !props.wheel) return;

            if (e.deltaY < 0) {
                model.value += props.step;
            }
            else {
                model.value -= props.step;
            }
        }



        watch(model ,(newVal)=>{

            if (Number.isNaN(model.value)) {
                model.value = props.min ?? 0;
                return;
            }

            if(props.max !== undefined && props.max !== null && model.value > props.max){
                model.value = props.max;
                return;
            }
            if(props.min !== undefined && props.min !== null && model.value < props.min){
                model.value = props.min;
                return;
            }
        },{ immediate: true })

        onUnmounted(() => {
            stop();
        });

        return {
            model, ChevronUpIcon, ChevronDownIcon, startDecrease, startIncrease, stop, onWheel
        }
    }
}
</script>

<style>
    .v-input-number-wrapper{
        border: var(--v-border);
        border-radius: var(--v-border-radius);
        display: flex;
        align-items: center;
        box-sizing: border-box;
        user-select: none;
        min-width: 100px !important;
    }
    .v-input-number-wrapper-has-border{
        border: var(--v-border);
    }

    /* input */
    .v-input-number-input-wrapper{
        width: 70%;
        height: 100%;
        box-sizing: border-box;
    }
    .v-input-number-input{
        width: 100%;
        height: 100%;
        outline: 0;
        border: 0;
        border-right: var(--v-border);
        padding: 0;
        background: transparent;
        border-radius: 3px 0 0 3px;
        color: white;
        text-align: center;
        -moz-appearance: textfield;
        appearance: textfield;
    }
    .v-input-number-input::-webkit-outer-spin-button,
    .v-input-number-input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* button */
    .v-input-number-button-wrapper{
        flex-shrink: 0;
        flex-grow: 0;
        width: 30%;
        height: 100%;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        border-radius: 0 3px 3px 0;
    }
    .v-input-number-button{
        width: 100%;
        height: 50%;
        box-sizing: border-box;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .v-input-number-button-top{
        border-bottom: var(--v-border);
        border-radius: 0 3px 0 0;
    }
    .v-input-number-button-bottom{
        border-radius: 0 0 3px 0;
    }
    .v-input-number-button:hover{
        cursor: pointer;
        background: var(--v-surfaces-hover);
    }
    .v-input-number-button:active{
        cursor: pointer;
        background: rgba(255,255,255,0.075);
    }
    .v-input-number-button-top:not(.v-input-number-button-disabled):hover{
        border-bottom: 1px solid transparent;
    }

    /* disabled */
    .v-input-number-input-wrapper-disabled{
        background: var(--v-surfaces-ghost-disabled);
    }
    .v-input-number-button-disabled{
        background: var(--v-surfaces-ghost-disabled);
        border: 0;
    }
    .v-input-number-button-disabled:hover{
        cursor: not-allowed;
        background: var(--v-surfaces-ghost-disabled);
    }
</style>