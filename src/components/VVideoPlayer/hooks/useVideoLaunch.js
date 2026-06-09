import { ref } from 'vue'

export function useVideoLaunch(videoRef){

    let isPlaying = ref(false);
    
    function start(){
        if (!videoRef.value) return
        videoRef.value.play();
        isPlaying.value = true;
    }

    function pause(){
        if (!videoRef.value) return
        videoRef.value.pause();
        isPlaying.value = false;
    }

    function toggleLaunch(){
        if (!videoRef.value) return
        
        if(isPlaying.value) pause();
        else start();
    }

    return {
        isPlaying, start, pause, toggleLaunch
    }
}