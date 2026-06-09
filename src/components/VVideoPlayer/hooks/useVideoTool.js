import { ref, computed } from 'vue'

export function useVideoTool(isPlaying){

    let isMoving = ref(false);
    let isTouchingTool = ref(false);

    let showTool = computed(()=>{
        return !isPlaying.value || isTouchingTool.value || isMoving.value
    })


    let timer = null;

    function videoPlayerMouseMove(){

        isMoving.value = true;
        clearTimeout(timer)

        timer = setTimeout(() => {
            isMoving.value = false
        }, 3000)
    }

    function videoPlayerMouseLeave(){
        isMoving.value = false;
        clearTimeout(timer)
    }

    function videoPlayerMouseEnter(){
        isMoving.value = true;
        clearTimeout(timer)
    }

    return {
        isMoving, isTouchingTool, showTool, videoPlayerMouseMove, videoPlayerMouseLeave, videoPlayerMouseEnter
    }
}