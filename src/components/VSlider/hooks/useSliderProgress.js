import { ref } from 'vue';

export function useSliderProgress(progressWrapperRef, progress, props){

    // 拖曳跳躍
    const isDragging = ref(false);

    const startDrag = (event) => {

        if(props.disabled) return;
        isDragging.value = true
        event.target.setPointerCapture(event.pointerId)
        dragTo(event)
    }

    const stopDrag = (event) => {

        if(props.disabled) return;
        isDragging.value = false
        event.target.releasePointerCapture(event.pointerId)
    }
    
    const dragTo = (event) => {

        if(!isDragging.value || props.disabled) return
        const rect = progressWrapperRef.value.getBoundingClientRect()
        const x = event.clientX - rect.left
        const ratio = Math.max(0, Math.min(1, x / rect.width))
        progress.value = ratio * 100;

    }



    return {
        startDrag, stopDrag, dragTo, isDragging
    }
}