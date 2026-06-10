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
                <div class="v-video-controller-volume-wrapper">
                    <VIcon class="v-video-controller-volume-icon" :icon="isMuted ? VolumeMuteIcon : (volume >= 50 ? VolumeHighIcon : VolumeLowIcon)" :size="20" @click="toggleMute()"></VIcon>
                    <div class="v-video-controller-volume-lattice-wrapper">
                        <div class="v-video-controller-volume-lattice" :class="{'v-video-controller-volume-lattice-selected': volume / 10 >= i}" v-for="i in 10" :key="i" @click.stop="handleVolume(i)"></div>
                    </div>
                </div>
                <div class="v-video-controller-video-speed-wrapper">
                    <div class="v-video-controller-video-speed-value-wrapper" @click="toggleSpeedList()">
                        <div class="v-video-controller-video-speed-value">{{speed.toFixed(2)}}x</div>
                        <VIcon class="v-video-controller-video-speed-icon" :class="{'v-video-controller-video-speed-icon-rotate': showSpeedList}" :icon="ChevronDownIcon"></VIcon>
                    </div>
                    <div class="v-options-list-wrapper" :class="{'v-options-list-wrapper-fullscreen': isFullscreen}" v-if="showSpeedList">
                        <div class="v-options-list-options" v-for="(item,id) in speedList" :key="id" @click="handleSpeed(item.value)">{{ item.label }}</div>
                    </div>
                </div>
                <div class="v-video-controller-video-quality-wrapper">
                    <div class="v-video-controller-video-quality-value-wrapper" @click="toggleQualityList()">
                        <div class="v-video-controller-video-quality-value">{{ currentQuality }}</div>
                        <VIcon class="v-video-controller-video-quality-icon" :class="{'v-video-controller-video-quality-icon-rotate': showQualityList}" :icon="ChevronDownIcon"></VIcon>
                    </div>
                    <div class="v-options-list-wrapper" :class="{'v-options-list-wrapper-fullscreen': isFullscreen}" v-if="showQualityList">
                        <div class="v-options-list-options" v-for="(item,id) in source" :key="id" @click="handleQuality(item.quality)">{{ item.quality }}</div>
                    </div>
                </div>
                <slot name="controller"></slot>
                <div class="v-video-controller-list-fullscreen" @click="toggleFullscreen()">
                    <VIcon :icon="isFullscreen? ExitFullscreenIcon : FullscreenIcon" :size="18"></VIcon>
                </div>
            </div>

        </div>
    </div>
  </div>
</template>

<script>

import { ref, onMounted, nextTick } from 'vue';
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
import LogoImg from './assets/full_logo_trans.png'

// slot -> logo, controller
export default {
    name:'VVideoPlayer',
    props:{
        source:{
            type: Object,
            default: {}
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
        const currentQuality = ref('');
        const videoName = ref('');
        const src = ref('');

        onMounted(()=>{
            let target = props.source[0];
            if(target){
                videoName.value = target.name;
                currentQuality.value = target.quality;
                src.value = (typeof target.src == 'string')? target.src : URL.createObjectURL(target.src)
            }
        })

        // General
        function hasSlot(name){
            return !!context.slots[name];
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

        // speed & quality
        const speedList = [
            { label:'1.0x',value:1.00 },
            { label:'1.25x',value:1.25 },
            { label:'1.5x',value:1.50 },
            { label:'1.75x',value:1.75 },
            { label:'2.0x',value:2.00 },
        ].reverse();

        const showSpeedList = ref(false);
        const showQualityList = ref(false);

        function toggleSpeedList(){
            showSpeedList.value = !showSpeedList.value
        }
        function toggleQualityList(){
            showQualityList.value = !showQualityList.value
        }

        function handleSpeed(speed){
            setSpeed(speed)
            showSpeedList.value = false;
        }

        function handleQuality(quality){

            if(quality == currentQuality.value){
                showQualityList.value = false;
                return;
            }

            currentQuality.value = quality;

            const target = props.source.find(i=> i.quality == quality);
            
            if(target){
                videoName.value = target.name;
                currentQuality.value = target.quality;
                src.value = (typeof target.src == 'string')? target.src : URL.createObjectURL(target.src);
                
                // 讓影片維持原狀態
                const currentTimeStamp = currentTime.value;
                const currentLaunchStatus = isPlaying.value;

                nextTick(()=>{
                    if(currentLaunchStatus) start();
                    setCurrentTime(currentTimeStamp)
                })
            }
            // 加載錯誤則 reset
            else reset();

            showQualityList.value = false;
        }


        // volume
        function handleVolume(i){
            setVolume(i*10);    
        }


        // video launch
        let { isPlaying, start, pause, toggleLaunch } = useVideoLaunch(videoRef);

        // video tool bar
        let { isTouchingTool, videoPlayerMouseMove, videoPlayerMouseLeave, videoPlayerMouseEnter, showTool } = useVideoTool(isPlaying);

        // video progress
        let { duration, currentTime, progress, setCurrentTime, onLoadedMetadata, onTimeUpdate, startDrag, stopDrag, dragTo } = useVideoProgress(videoRef, progressWrapperRef, isPlaying);
        
        // video fullscreen
        let { isFullscreen, toggleFullscreen } = useVideoFullscreen(wrapperRef);

        // video volume
        let { volume, isMuted, setVolume, toggleMute } = useVideoVolume(videoRef)

        // video speed
        let { speed, setSpeed } = useVideoSpeed(videoRef)

        
        // reset expect Volume
        function reset(){
            setSpeed(1.0);
            setCurrentTime(0);
            isPlaying.value = false;
            pause();
        }

        return {
            src, wrapperRef, videoRef, duration, currentTime, progress, onLoadedMetadata, onTimeUpdate, start, pause, LogoImg, speedList, handleSpeed, toggleSpeedList, toggleQualityList,
            PlayIcon, PauseIcon, isPlaying, isFullscreen, toggleFullscreen, startDrag, stopDrag, dragTo, formatTime, hasSlot, videoName, showSpeedList, showQualityList, handleQuality,
            FullscreenIcon, ExitFullscreenIcon, progressWrapperRef, toggleLaunch, showTool, isTouchingTool, videoPlayerMouseMove,videoPlayerMouseLeave, videoPlayerMouseEnter,
            volume, isMuted, setVolume, toggleMute, VolumeHighIcon, handleVolume, VolumeMuteIcon, VolumeLowIcon, speed, setSpeed, ChevronDownIcon, currentQuality
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
        user-select: none;
    }
    .v-video-player{
        width: 100%; 
        border: 0.01px solid rgba(0,0,0,0.1);
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
        padding-left: 20px;
        padding-right: 15px;
    }
    .v-video-header-wrapper-fullscreen{
        height: 100px;
        padding-left: 25px;
        padding-right: 25px;
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
    }


    /* Progress */
    .v-video-controller-progress-wrapper{
        position: relative;
        width: calc(100% - 16px);
        margin: 0 auto;
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
        border-right: 0.5px solid rgba(255,255,255,0.2);
        padding-left: 12px;
        padding-right: 12px;
        font-size: 14px;
        height: 65%;
        position: relative;
    }
    .v-video-controller-video-speed-wrapper:hover,
    .v-video-controller-video-quality-wrapper:hover
    {
        cursor: pointer;
    }

    .v-video-controller-video-speed-value-wrapper,
    .v-video-controller-video-quality-value-wrapper
    {
        display: flex;
        height: 100%;
        align-items: center;
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
        transition: rotate 0.1s ease;
    }
    .v-video-controller-video-speed-icon-rotate,
    .v-video-controller-video-quality-icon-rotate
    {
        rotate: 180deg;
    }

    /* options list */
    .v-options-list-wrapper{
        position: absolute;
        width: 100%;
        bottom: 120%;
        left: 0;
        min-height: 31px;
        box-sizing: border-box;
        background: rgba(0,0,0,0.6);
        border: 1px solid rgba(255,255,255,0.3);
    }
    .v-options-list-wrapper::before{
        content: '';
        position: absolute;
        left: 50%;
        bottom: -8px;
        transform: translateX(-50%);
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 8px solid transparent;
    }
    .v-options-list-wrapper::after{
        content: '';
        position: absolute;
        left: 50%;
        bottom: -6.8px;
        transform: translateX(-50%);
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-top: 7px solid rgba(0,0,0,0.6);
    }
    .v-options-list-wrapper-fullscreen::before{
        border-top: 8px solid rgba(255,255,255,0.3);
    }
    .v-options-list-wrapper-fullscreen::after{
        border-top: 7px solid black;
    }
    .v-options-list-options{
        width: 100%;
        height: 31px;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
    }
    .v-options-list-options:hover{
        cursor: pointer;
        background: rgba(255,255,255,0.3);
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