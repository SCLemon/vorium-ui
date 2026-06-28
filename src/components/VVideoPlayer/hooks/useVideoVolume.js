import { ref } from 'vue'

export function useVideoVolume(videoRef, hoverVolumeIndex) {
    const volume = ref(1)
    const isMuted = ref(false)
    const previousVolume = ref(1)

    const setVolume = (value) => {
        volume.value = value

        if (!videoRef.value) return

        videoRef.value.volume = value; // 0-1

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
            hoverVolumeIndex.value = previousVolume.value * 10;
        }
        else {
            previousVolume.value = volume.value
            hoverVolumeIndex.value = 0;
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