<template>
    <div class="v-slider-controller-progress-wrapper-all">
        <div class="v-slider-prepend-slot" v-if="hasSlot('prepend')" :style="{marginRight: circleRadius}"><slot name="prepend"></slot></div>
        <div class="v-slider-controller-progress-wrapper" ref="progressWrapperRef" :style="{height : `calc(${height} + 10px)`}"
            :class="{ 'v-slider-controller-progress-wrapper-is-disabled': disabled }"
            @pointerdown.stop="startDrag" @pointermove.stop="dragTo" @pointerup.stop="stopDrag" @pointercancel.stop="stopDrag"
            @mouseenter="handleTrackHover" @mouseleave="handleTrackBlur"  @mousemove="handleTrackHover">
            <div class="v-slider-controller-progress-track" ref="progressTrackRef" :style="{ height }">
                <div class="v-slider-controller-progress-track-hover-mask" :style="{width: trackHoverWidth + '%'}">
                    <div class="v-slider-controller-progress-track-hover-mask-dropdown" v-if="showTips && showTrackHoverDropdown">
                        <VDropdown placement="top" minHeight="22.5px" width="fit-content">
                            <div class="v-slider-value">{{ displayTipText }}</div>
                        </VDropdown>
                    </div>
                </div>
            </div>
            
            <div class="v-slider-controller-progress" :class="{ 'v-slider-controller-progress-is-disabled': disabled }" :style="{ width: progress + '%', height, background: (disabled ? disabledColor: color)}"></div>
            
            <div class="v-slider-controller-progress-controller" :style="{ left: progress + '%', background: (disabled ? disabledColor: color), height: circleRadius }"></div>
        </div>
        <div class="v-slider-append-slot" v-if="hasSlot('append')" :style="{marginLeft: circleRadius}"><slot name="append"></slot></div>
    </div>
</template>

<script>
import { ref, useModel, computed } from 'vue';
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
        },
        showTips:{
            type: Boolean,
            default: true,
        },
        tipText:{
            type: Function,
            default: null
        },
    },
    setup(props, context){
        const progressWrapperRef = ref(null);
        const progressTrackRef = ref();
        const trackHoverWidth = ref(0);
        const showTrackHoverDropdown = ref(false)

        const trackHoverValue = computed(()=>{
            return Math.min(100, Math.max(0, trackHoverWidth.value));
        })

        // v-model
        const progress = useModel(props, 'modelValue', context.emit);

        let { startDrag, stopDrag, dragTo, isDragging } = useSliderProgress(progressWrapperRef, progress, props);
        
        function hasSlot(name){
            return !!context.slots[name];
        }

        // tipText
        const displayTipText = computed(() => {

            if(props.tipText){
                return props.tipText(trackHoverValue.value)
            }

            return trackHoverValue.value.toFixed(1)
        })

        // track
        function handleTrackHover(event){
            const rect = progressTrackRef.value.getBoundingClientRect()
            const clickX = event.clientX - rect.left;
            trackHoverWidth.value = Math.min(100, Math.max(0,(clickX / rect.width) * 100));
            showTrackHoverDropdown.value = true;
        }
        function handleTrackBlur(event){
            trackHoverWidth.value = 0;
            showTrackHoverDropdown.value = false;
        }

        return {
            progress, progressWrapperRef, progressTrackRef, startDrag, stopDrag, dragTo, isDragging, hasSlot, handleTrackHover, handleTrackBlur, 
            showTrackHoverDropdown, trackHoverWidth, trackHoverValue, displayTipText
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

    .v-slider-controller-progress-track-hover-mask{
        width: 0%;
        height: 100%;
        background: rgba(255,255,255,0.15);
        position: relative;
    }
    .v-slider-controller-progress-track-hover-mask-dropdown{
        position: absolute;
        bottom: calc(100% + 13px);
        left: 100%;
        transform: translate(-50%, 0);
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
        height: 100%;
        line-height: 22.5px;
        text-align: center;
        color: white;
        white-space: nowrap;
        padding-left: 10px;
        padding-right: 10px;
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