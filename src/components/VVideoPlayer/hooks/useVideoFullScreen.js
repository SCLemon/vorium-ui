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


// import { ref, onMounted, onUnmounted } from 'vue'

// export function useVideoFullscreen(wrapperRef) {

//     const isFullscreen = ref(false)

//     const onFullscreenChange = () => {
//         isFullscreen.value = !!document.fullscreenElement
//     }

//     const enterFullscreen = async () => {
//         if (!wrapperRef.value) return

//         try {
//             await wrapperRef.value.requestFullscreen()
//         }
//         catch(error){
//             console.error(error)
//         }
//     }

//     const exitFullscreen = async () => {
//         if (!document.fullscreenElement) return

//         try{
//             await document.exitFullscreen()
//         }
//         catch(error){
//             console.error(error)
//         }
//     }

//     const toggleFullscreen = async () => {
//         if (document.fullscreenElement) {
//             await exitFullscreen()
//         }
//         else {
//             await enterFullscreen()
//         }
//     }

//     onMounted(() => {
//         document.addEventListener(
//             'fullscreenchange',
//             onFullscreenChange
//         )
//     })

//     onUnmounted(() => {
//         document.removeEventListener(
//             'fullscreenchange',
//             onFullscreenChange
//         )
//     })

//     return {
//         isFullscreen,
//         enterFullscreen,
//         exitFullscreen,
//         toggleFullscreen
//     }
// }