<template>
  <div class="v-video-player-wrapper" ref="wrapperRef" :style="{ aspectRatio }" 
        @mousemove.stop="videoPlayerMouseMove" @mouseleave.stop="videoPlayerMouseLeave" @mouseenter.stop="videoPlayerMouseEnter">

    <div class="v-video-header-wrapper" :class="{'v-video-header-wrapper-fullscreen': isFullscreen,'v-video-header-wrapper-show': showTool}" @mouseenter.stop="isTouchingTool = true"  @mouseleave.stop="isTouchingTool = false">
        <div class="v-video-header-left-wrapper">
            <img class="v-video-header-logo" v-if="!hasSlot('logo')" :src="LogoImg" alt="">
            <slot v-else name="logo"></slot>
        </div>
        <div class="v-video-header-right-wrapper">
            <div class="v-video-header-name">{{ videoName }}</div>
        </div>
    </div>

    <video ref="videoRef" class="v-video-player" :class="{'v-video-player-mouse-hide': !showTool}" @click.stop="toggleLaunch" :src="src" @loadedmetadata="onLoadedMetadata" @timeupdate="onTimeUpdate"></video>

    <div class="v-video-controllers-wrapper" :class="{'v-video-controllers-wrapper-fullscreen': isFullscreen, 'v-video-controllers-wrapper-show': showTool}" @mouseenter="isTouchingTool = true"  @mouseleave="isTouchingTool = false">
        <div class="v-video-controller-progress-wrapper" ref="progressWrapperRef"
            @pointerdown.stop="startDrag" @pointermove.stop="dragTo" @pointerup.stop="stopDrag" @pointercancel.stop="stopDrag">
            <div class="v-video-controller-progress-track"></div>
            <div class="v-video-controller-progress" :style="{ width: progress + '%' }"></div>
            <div class="v-video-controller-progress-controller" :style="{ left: progress + '%' }"></div>
        </div>
        <div class="v-video-controller-list-wrapper" :class="{'v-video-controller-list-wrapper-fullscreen': isFullscreen}">

            <div class="v-video-controller-left-wrapper">
                <div class="v-video-controller-list-launch" @click="isPlaying?pause():start()">
                    <VIcon :icon="isPlaying? PauseIcon : PlayIcon" :size="28"></VIcon>
                </div>
                <div class="v-video-controller-timer">{{ formatTime(currentTime) }} / <span style="color: rgba(220,220,220);">{{ formatTime(duration) }}</span></div>
            </div>

            <div class="v-video-controller-right-wrapper">
                <slot name="controller"></slot>
                <div class="v-video-controller-volume-wrapper">
                    <VIcon class="v-video-controller-volume-icon" :icon="isMuted ? VolumeMuteIcon : (volume >= 50 ? VolumeHighIcon : VolumeLowIcon)" :size="20" @click="toggleMute()"></VIcon>
                    <div class="v-video-controller-volume-lattice-wrapper">
                        <div class="v-video-controller-volume-lattice" :class="{'v-video-controller-volume-lattice-selected': volume / 10 >= i}" v-for="i in 10" :key="i" @click.stop="handleVolume(i)"></div>
                    </div>
                </div>
                <div class="v-video-controller-video-speed-wrapper">
                    <div class="v-video-controller-video-speed-value">1.0x</div>
                    <VIcon class="v-video-controller-video-speed-icon" :icon="ChevronDownIcon"></VIcon>
                </div>
                <div class="v-video-controller-video-quality-wrapper">
                    <div class="v-video-controller-video-quality-value">1080P</div>
                    <VIcon class="v-video-controller-video-quality-icon" :icon="ChevronDownIcon"></VIcon>
                </div>
                <div class="v-video-controller-list-fullscreen" @click="toggleFullscreen()">
                    <VIcon :icon="isFullscreen? ExitFullscreenIcon : FullscreenIcon" :size="18"></VIcon>
                </div>
            </div>

        </div>
    </div>
  </div>
</template>

<script>

import { ref, computed } from 'vue';
import { useVideoProgress } from './hooks/useVideoProgress'

// icons
import VIcon from '../VIcon.vue';
import PlayIcon from '@/icons/PlayIcon.vue';
import PauseIcon from '@/icons/PauseIcon.vue';
import FullscreenIcon from '@/icons/FullscreenIcon.vue';
import ExitFullscreenIcon from '@/icons/ExitFullscreenIcon.vue';
import VolumeHighIcon from '@/icons/VolumeHighIcon.vue';
import VolumeMuteIcon from '@/icons/VolumeMuteIcon.vue';
import VolumeLowIcon from '@/icons/VolumeLowIcon.vue';
import ChevronDownIcon from '@/icons/ChevronDownIcon.vue';

// hooks
import { useVideoLaunch } from './hooks/useVideoLaunch';
import { useVideoFullscreen } from './hooks/useVideoFullScreen'
import { useVideoTool } from './hooks/useVideoTool';
import { useVideoVolume } from './hooks/useVideoVolume';
import { useVideoSpeed } from './hooks/useVideoSpeed';

// assets
import LogoImg from '../../../public/assets/full_logo_trans.png'

// slot -> logo, controller
export default {
    name:'VVideoPlayer',
    props:{
        source:{
            type: Object,
            default: {}
        },
        currentQuality:{
            type: String,
            default: '720p'
        },
        aspectRatio:{
            type: Number,
            default: 16/9
        }
    },
    components:{
        VIcon
    },
    setup(props, context){
        const videoRef = ref();
        const wrapperRef = ref();
        const progressWrapperRef = ref();

        let videoName = computed(()=>{
            const target = props.source.find((i)=> i.quality == props.currentQuality);
            if(target) return target.name;      
            return '';
        })
        let src = computed(()=>{
            const target = props.source.find((i)=> i.quality == props.currentQuality);
            if(target){
                if(typeof target.src == 'string') return target.src
                else if(target.src instanceof File) return URL.createObjectURL(target.src)
            }
            return '';
        })

        function hasSlot(name){
            return !!context.slots[name];
        }
        
        // General
        function handleVolume(i){
            setVolume(i*10);    
        }

        function formatTime(seconds){
            if (!seconds || isNaN(seconds)) return '00:00'

            const h = Math.floor(seconds / 3600)
            const m = Math.floor((seconds % 3600) / 60)
            const s = Math.floor(seconds % 60)

            if (h > 0) {
                return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
            }

            return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
        }
        

        // video launch
        let { isPlaying, start, pause, toggleLaunch } = useVideoLaunch(videoRef);

        // video tool bar
        let { isTouchingTool, videoPlayerMouseMove, videoPlayerMouseLeave, videoPlayerMouseEnter, showTool } = useVideoTool(isPlaying);

        // video progress
        let { duration, currentTime, progress, onLoadedMetadata, onTimeUpdate, startDrag, stopDrag, dragTo } = useVideoProgress(videoRef, progressWrapperRef, isPlaying);
        
        // video fullscreen
        let { isFullscreen, toggleFullscreen } = useVideoFullscreen(wrapperRef);

        // video volume
        let { volume, isMuted, setVolume, toggleMute } = useVideoVolume(videoRef)

        // video speed
        let { speed, setSpeed } = useVideoSpeed(videoRef)

        
        return {
            src, wrapperRef, videoRef, duration, currentTime, progress, onLoadedMetadata, onTimeUpdate, start, pause, LogoImg,
            PlayIcon, PauseIcon, isPlaying, isFullscreen, toggleFullscreen, startDrag, stopDrag, dragTo, formatTime, hasSlot, videoName,
            FullscreenIcon, ExitFullscreenIcon, progressWrapperRef, toggleLaunch, showTool, isTouchingTool, videoPlayerMouseMove,videoPlayerMouseLeave, videoPlayerMouseEnter,
            volume, isMuted, setVolume, toggleMute, VolumeHighIcon, handleVolume, VolumeMuteIcon, VolumeLowIcon, speed, setSpeed, ChevronDownIcon
        }
    }
}
</script>

<style>
    /* video player */
    .v-video-player-wrapper{
        position: relative;
        box-sizing: border-box;
        overflow: hidden;
        display: flex;
        align-items: center;
    }
    .v-video-player{
        width: 100%; 
        border: 0.01px solid rgba(0,0,0,1);
    }
    .v-video-player:hover{
        cursor: pointer;
    }
    .v-video-player-mouse-hide:hover{
        cursor: none !important;
    }


    /* header */
    .v-video-header-wrapper{
        position: absolute;
        width: 100%;
        height: 65px;
        box-sizing: border-box;
        top:-100%;
        left: 0;
        background: transparent;
        backdrop-filter: blur(1.5px);
        transition: top 0.3s linear;
        color: white;
        display: flex;
        align-items: center;
        padding-left: 25px;
        padding-right: 25px;
    }
    .v-video-header-wrapper-fullscreen{
        height: 100px;
    }
    .v-video-header-wrapper-show{
        top:0;
    }
    .v-video-header-left-wrapper{
        height: 100%;
        display: flex;
        align-items: center;
    }
    .v-video-header-logo{
        height: 50px;
    }
    .v-video-header-right-wrapper{
        margin-left: auto;
    }
    .v-video-header-name{
        font-size: 20px;
        color: rgba(200, 200, 200);
        /* font-weight: bolder; */
    }


    /* Progress */
    .v-video-controller-progress-wrapper{
        position: relative;
        width: 100%;
        height: 13px;
    }

    .v-video-controller-progress-track{
        position: absolute;
        width: 100%;
        height: 3px;
        background: rgba(255,255,255,.12);
        left: 0;
        bottom: 0;
        transition: height .15s ease;
    }

    .v-video-controller-progress{
        position: absolute;
        height: 3px;
        background: white;
        left: 0;
        bottom: 0;
        transition:
            width .05s linear,
            height .15s ease;
    }

    .v-video-controller-progress-track,
    .v-video-controller-progress{
        transform-origin: center bottom;
    }

    .v-video-controller-progress-controller{
        position: absolute;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: white;
        bottom: 1.5px;
        transform: translate(0%, 50%);
        transition: transform .15s ease;
    }

    .v-video-controller-progress-wrapper:hover{
        cursor: pointer;
    }

    .v-video-controller-progress-wrapper:hover
    .v-video-controller-progress-controller{
        transform: translate(0%, 50%) scale(1.1);
    }

    .v-video-controller-progress-wrapper:hover
    .v-video-controller-progress-track{
        transform: scaleY(1.5);
    }

    .v-video-controller-progress-wrapper:hover
    .v-video-controller-progress{
        transform: scaleY(1.5);
    }

    /* Control List */
    .v-video-controllers-wrapper{
        position: absolute;
        width: 100%;
        height: 65px;
        box-sizing: border-box;
        bottom: -100%;
        left: 0;
        padding-left: 5px;
        padding-right: 5px;
        background: transparent;
        backdrop-filter: blur(1.5px);
        transition: bottom 0.3s linear;
    }
    .v-video-controllers-wrapper-fullscreen{
        height: 100px;
    }
    .v-video-controllers-wrapper-show{
        bottom: 0;
    }
    .v-video-controller-list-wrapper{
        width: 100%;
        height: 45px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        color: white;
    }
    .v-video-controller-list-wrapper-fullscreen{
        height: 65px;
    }
    .v-video-controller-left-wrapper{
        display: flex;
        align-items: center;
        height: 100%;
    }
    .v-video-controller-right-wrapper{
        display: flex;
        align-items: center;
        margin-left: auto;
        height: 100%;
    }
    .v-video-controller-list-launch{
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
    }
    .v-video-controller-list-launch:hover{
        cursor: pointer;
    }

    .v-video-controller-timer{
        color: white;
        margin-left: 10px;
        font-size: 14px;
    }

    /* volume */
    .v-video-controller-volume-wrapper{
        padding-right: 17.5px;
        border-right: 0.5px solid rgba(255,255,255,0.2);
        display: flex;
        align-items: center;
        height: 65%;
    }
    .v-video-controller-volume-icon:hover{
        cursor: pointer;
    }
    .v-video-controller-volume-lattice-wrapper{
        display: flex;
        gap: 4px;
        margin-left: 10px;
        padding-left: 5px;
    }
    .v-video-controller-volume-lattice{
        width: 5px;
        height: 14px;
        box-sizing: border-box;
        background: rgba(255,255,255,0.15);
        flex-shrink: 0;
        flex-grow: 0;
    }
    .v-video-controller-volume-lattice:hover{
        cursor: pointer;
    }
    .v-video-controller-volume-lattice-selected{
        background: white;
    }
    /* video speed & quality */
    .v-video-controller-video-speed-wrapper,
    .v-video-controller-video-quality-wrapper
    {
        display: flex;
        align-items: center;
        border-right: 0.5px solid rgba(255,255,255,0.2);
        padding-left: 12px;
        padding-right: 12px;
        font-size: 14px;
        height: 65%;
    }
    .v-video-controller-video-speed-wrapper:hover,
    .v-video-controller-video-quality-wrapper:hover
    {
        cursor: pointer;
    }
    .v-video-controller-video-speed-value,
    .v-video-controller-video-quality-value
    {
        margin-right: 7.5px;
    }
    .v-video-controller-video-speed-icon,
    .v-video-controller-video-quality-icon
    {
        color: rgba(170,170,170);
    }

    /* fullscreen */
    .v-video-controller-list-fullscreen{
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        padding-left: 5px;
        padding-right: 5px;
    }
    .v-video-controller-list-fullscreen:hover{
        cursor: pointer;
    }


</style>