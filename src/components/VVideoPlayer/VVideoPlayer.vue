<template>
  <div class="v-video-player-wrapper" :class="{'v-video-player-wrapper-fullscreen': isFullscreen}" ref="wrapperRef" :style="{ aspectRatio }">
    <div class="v-video-header-wrapper"></div>
    <video ref="videoRef" class="v-video-player" @click="toggleLaunch" :src="src" @loadedmetadata="onLoadedMetadata" @timeupdate="onTimeUpdate"></video>
    <div class="v-video-controllers-wrapper">
        <div class="v-video-controller-progress-wrapper" ref="progressWrapperRef"
            @pointerdown.stop="startDrag" @pointermove.stop="dragTo" @pointerup.stop="stopDrag" @pointercancel.stop="stopDrag">
            <div class="v-video-controller-progress-track"></div>
            <div class="v-video-controller-progress" :style="{ width: progress + '%' }"></div>
            <div class="v-video-controller-progress-controller" ref="dragRef" :style="{ left: progress + '%' }"></div>
        </div>
        <div class="v-video-controller-list-wrapper">
            <div class="v-video-controller-list-launch" @click="isPlaying?pause():start()">
                <VIcon :icon="isPlaying? PauseIcon : PlayIcon" :size="28"></VIcon>
            </div>
            <div class="v-video-controller-list-fullscreen" @click="toggleFullscreen()">
                <VIcon :icon="isFullscreen? ExitFullscreenIcon : FullscreenIcon" :size="20"></VIcon>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useVideoProgress } from './hooks/useVideoProgress'
import VIcon from '../VIcon.vue';
import PlayIcon from '@/icons/PlayIcon.vue';
import PauseIcon from '@/icons/PauseIcon.vue';
import FullscreenIcon from '@/icons/FullscreenIcon.vue';
import ExitFullscreenIcon from '@/icons/ExitFullscreenIcon.vue';
import { useVideoLaunch } from './hooks/useVideoLaunch';
import { useVideoFullscreen } from './hooks/useVideoFullScreen'

export default {
    name:'VVideoPlayer',
    props:{
        source:{
            type: Object,
            default: {}
        },
        quality:{
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
        const dragRef = ref();

        let src = computed(()=>{
            const target = props.source[props.quality];
            if(target){
                if(typeof target == 'string') return target
                else if(target instanceof File) return URL.createObjectURL(target)
            }
            return '';
        })

        // video launch
        let { isPlaying, start, pause, toggleLaunch } = useVideoLaunch(videoRef);

        // video progress
        let { duration, currentTime, progress, onLoadedMetadata, onTimeUpdate, startDrag, stopDrag, dragTo } = useVideoProgress(videoRef, progressWrapperRef, dragRef);
        
        // video fullscreen
        let { isFullscreen, toggleFullscreen } = useVideoFullscreen(wrapperRef);

        return {
            src, wrapperRef, videoRef, duration, currentTime, progress, onLoadedMetadata, onTimeUpdate, start, pause,
            PlayIcon, PauseIcon, isPlaying, isFullscreen, toggleFullscreen, startDrag, stopDrag, dragTo,
            FullscreenIcon, ExitFullscreenIcon, progressWrapperRef, toggleLaunch, dragRef
        }
    }
}
</script>

<style>
    /* General */
    .v-video-player-wrapper{
        position: relative;
        width: 100%;
        box-sizing: border-box;
    }
    .v-video-player-wrapper-fullscreen{
        width: 100vw;
        height: 100vh;
        position: fixed;
        inset: 0;
        z-index: 999999;
        background: black;
    }
    .v-video-player{
        width: 100%;
        height: 100%;
    }
    .v-video-player:hover{
        cursor: pointer;
    }
    .v-video-header-wrapper{
        position: absolute;
        width: 100%;
        height: 50px;
        box-sizing: border-box;
        top:0;
        left: 0;
        background: transparent;
        backdrop-filter: blur(1.5px);
        z-index: 999;
    }
    .v-video-controllers-wrapper{
        position: absolute;
        width: 100%;
        height: 50px;
        box-sizing: border-box;
        bottom:0;
        left: 0;
        padding-left: 5px;
        padding-right: 5px;
        background: transparent;
        backdrop-filter: blur(1.5px);
        z-index: 999;
    }

    /* Progress */
    .v-video-controller-progress-wrapper{
        position: relative;
        width: 100%;
        height: 13px;
        display: flex;
        align-items: center;
    }
    .v-video-controller-progress-track{
        position: absolute;
        width: 100%;
        height: 3px;
        background: rgba(255,255,255,.12);
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        transition: height .15s ease;
    }
    .v-video-controller-progress{
        position: absolute;
        height: 3px;
        background: white;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        transition:
            width .05s linear,
            height .15s ease;
    }
    .v-video-controller-progress-track,
    .v-video-controller-progress{
        transform-origin: center center;
    }

    .v-video-controller-progress-controller{
        position: absolute;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: white;
        top: 50%;
        transform: translate(0%, -50%);
        transition: transform .15s ease;
    }

    .v-video-controller-progress-wrapper:hover{
        cursor: pointer;
    }
    .v-video-controller-progress-wrapper:hover
    .v-video-controller-progress-controller{
        transform: translate(0%, -50%) scale(1.1);
    }
    
    .v-video-controller-progress-wrapper:hover
    .v-video-controller-progress-track{
        transform: translateY(-50%) scaleY(1.5);
    }
    .v-video-controller-progress-wrapper:hover
    .v-video-controller-progress{
        transform: translateY(-50%) scaleY(1.5);
    }

    /* Control List */
    .v-video-controller-list-wrapper{
        width: 100%;
        height: 47px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
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
    .v-video-controller-list-fullscreen{
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        margin-left: auto;
    }
    .v-video-controller-list-fullscreen:hover{
        cursor: pointer;
    }
</style>