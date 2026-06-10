import { ref } from 'vue'

export function useVideoVolume(videoRef) {
    const volume = ref(100)
    const isMuted = ref(false)
    const previousVolume = ref(100)

    const setVolume = (value) => {
        volume.value = value

        if (!videoRef.value) return

        videoRef.value.volume = value / 100

        if (value <= 0) {
            isMuted.value = true
            videoRef.value.muted = true
        }
        else {
            isMuted.value = false
            videoRef.value.muted = false
        }
    }

    const toggleMute = () => {
        if (!videoRef.value) return

        if (isMuted.value) {
            setVolume(previousVolume.value)
        }
        else {
            previousVolume.value = volume.value
            setVolume(0)
        }
    }

    return {
        volume,
        isMuted,
        setVolume,
        toggleMute
    }
}