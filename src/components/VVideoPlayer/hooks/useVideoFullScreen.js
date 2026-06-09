import { ref, onMounted, onUnmounted } from 'vue'

export function useVideoFullscreen(wrapperRef) {
    const isFullscreen = ref(false)

    async function enterFullscreen() {
        if (!wrapperRef.value) return
        isFullscreen.value = true
    }

    async function exitFullscreen() {
        isFullscreen.value = false
    }

    async function toggleFullscreen() {
        if (isFullscreen.value) await exitFullscreen()
        else await enterFullscreen()
    }

    return {
        isFullscreen,
        enterFullscreen,
        exitFullscreen,
        toggleFullscreen
    }
}