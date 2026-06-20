<template>
    <div class="v-slider-controller-progress-wrapper-all">
        <div class="v-slider-prepend-slot" v-if="hasSlot('prepend')" :style="{marginRight: circleRadius}"><slot name="prepend"></slot></div>
        <div class="v-slider-controller-progress-wrapper" ref="progressWrapperRef" :style="{height : `calc(${height} + 10px)`}"
            :class="{ 'v-slider-controller-progress-wrapper-is-disabled': disabled }"
            @pointerdown.stop="startDrag" @pointermove.stop="dragTo" @pointerup.stop="stopDrag" @pointercancel.stop="stopDrag">
            <div class="v-slider-controller-progress-track" :style="{ height }"></div>
            
            <div class="v-slider-controller-progress" :class="{ 'v-slider-controller-progress-is-disabled': disabled }" :style="{ width: progress + '%', height, background: (disabled ? disabledColor: color)}"></div>
            
            <div class="v-slider-controller-progress-controller" :style="{ left: progress + '%', background: (disabled ? disabledColor: color), height: circleRadius }"
            @mouseenter="isHover = true" @mouseleave="isHover = false">
                <VDropdown class="v-slider-controller-progress-controller-dropdown" placement="top" minHeight="22.5px" width="35px" v-if="isHover || isDragging">
                    <div class="v-slider-value">{{ progress.toFixed(1) }}</div>
                </VDropdown>
            </div>
        </div>
        <div class="v-slider-append-slot" v-if="hasSlot('append')" :style="{marginLeft: circleRadius}"><slot name="append"></slot></div>
    </div>
</template>

<script>
import { ref, useModel } from 'vue';
import { useSliderProgress } from './hooks/useSliderProgress.js'
import VDropdown from '../VDropdown.vue';
export default {
    name: 'VSlider',
    emits: ['update:modelValue'],
    components:{
        VDropdown
    },
    props:{
        modelValue:{
            type: Number,
            default: 0,
        },
        height: {
            type: String,
            default: '4.5px'
        },
        circleRadius:{
            type: String,
            default: '14.5px'
        },
        color:{
            type: String,
            default: 'white'
        },
        disabledColor:{
            type: String,
            default: '#4a4a4a'
        },
        disabled:{
            type: Boolean,
            default: false,
        }
    },
    setup(props, context){
        const progressWrapperRef = ref(null);
        const isHover = ref(false);
        
        const progress = useModel(props, 'modelValue', context.emit);

        // v-model
        let { startDrag, stopDrag, dragTo, isDragging } = useSliderProgress(progressWrapperRef, progress, props);
        
        function hasSlot(name){
            return !!context.slots[name];
        }

        return {
            progress, isHover, progressWrapperRef, startDrag, stopDrag, dragTo, isDragging, hasSlot
        }
    }
}
</script>

<style>
    .v-slider-controller-progress-wrapper-all{
        width: 100%;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        user-select: none;
    }
    .v-slider-controller-progress-wrapper{
        position: relative;
        flex: 1;
        margin: 0 auto;
    }

    .v-slider-controller-progress-track{
        position: absolute;
        width: 100%;
        background: rgba(255,255,255,.12);
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        transition: height .15s ease, transform .15s ease;;
    }

    .v-slider-controller-progress{
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        transition: height .15s ease, transform .15s ease;
    }

    .v-slider-controller-progress-track,
    .v-slider-controller-progress{
        transform-origin: center;
    }

    .v-slider-controller-progress-controller{
        position: absolute;
        aspect-ratio: 1/1;
        border-radius: 50%;
        
        top: 50%;
        left: 0;

        transform: translate(-50%, -50%);
        transition: transform .15s ease;
    }
    .v-slider-controller-progress-controller-dropdown{
        position: absolute;
        bottom: calc(100% + 11.5px);
        transform: translateX(-11.5px);
    }

    .v-slider-controller-progress-wrapper:hover{
        cursor: pointer;
    }

    .v-slider-controller-progress-wrapper:not(.v-slider-controller-progress-wrapper-is-disabled):hover
    .v-slider-controller-progress-controller{
        transform: translate(-50%, -50%) scale(1.1);
    }

    .v-slider-controller-progress-wrapper:not(.v-slider-controller-progress-wrapper-is-disabled):hover
    .v-slider-controller-progress-track{
        transform: translateY(-50%) scaleY(1.2);
    }

    .v-slider-controller-progress-wrapper:not(.v-slider-controller-progress-wrapper-is-disabled):hover
    .v-slider-controller-progress{
        transform: translateY(-50%) scaleY(1.2);
    }

    /* dropdown */

    .v-slider-value{
        font-size: 10px;
        width: 100%;
        height: 100%;
        line-height: 22.5px;
        text-align: center;
        color: white;
    }

    /* slot */
    .v-slider-prepend-slot{
        color: white;
    }
    .v-slider-append-slot{
        color: white;
    }

    /* disabled */
    .v-slider-controller-progress-wrapper-is-disabled:hover{
        cursor: not-allowed !important;
    }
</style>