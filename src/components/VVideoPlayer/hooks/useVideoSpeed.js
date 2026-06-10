import { ref } from 'vue'

export function useVideoSpeed(videoRef) {
    const speed = ref(1)

    const setSpeed = (value) => {
        speed.value = value

        if (!videoRef.value) return

        videoRef.value.playbackRate = value
    }

    return {
        speed,
        setSpeed
    }
}