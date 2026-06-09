import { ref, computed, onMounted, onUnmounted } from 'vue';

export function useVideoProgress(videoRef, progressWrapperRef, dragRef){

    const duration = ref(0)
    const currentTime = ref(0)
    const progress = computed(() => {
        if (!duration.value) return 0
        return currentTime.value / duration.value * 100
    })
    const onLoadedMetadata = () => {
        duration.value = videoRef.value.duration
    }
    const onTimeUpdate = () => {
        currentTime.value = videoRef.value.currentTime
    }

    // 快轉
    const forward = (seconds = 10) => {
        if (!videoRef.value) return
        videoRef.value.currentTime += seconds
    }

    // 倒退
    const backward = (seconds = 10) => {
        if (!videoRef.value) return
        videoRef.value.currentTime -= seconds
    }

    // 指定跳躍
    const seekTo = (event) => {
        const rect = progressWrapperRef.value.getBoundingClientRect()
        const clickX = event.clientX - rect.left;
        const ratio = clickX / rect.width;
        videoRef.value.currentTime = duration.value * ratio
    }

    // 拖曳跳躍
    const isDragging = ref(false);


    const startDrag = (event) => {
        isDragging.value = true
        event.target.setPointerCapture(event.pointerId)
        dragTo(event)
    }

    const stopDrag = (event) => {
        isDragging.value = false
        event.target.releasePointerCapture(event.pointerId)
    }
    
    const dragTo = (event) => {
        if(!isDragging.value) return

        const rect = progressWrapperRef.value.getBoundingClientRect()
        const x = event.clientX - rect.left
        const ratio = Math.max(0, Math.min(1, x / rect.width))
        const seekTime = duration.value * ratio

        currentTime.value = seekTime
        videoRef.value.currentTime = seekTime
    }



    return {
        duration, currentTime, progress, onLoadedMetadata, onTimeUpdate, forward, backward, seekTo, startDrag, stopDrag, dragTo
    }
}