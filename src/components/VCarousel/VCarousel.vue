<template>
    <div class="v-carousel-wrapper" :style="{ aspectRatio }" @mouseenter="isHover = true" @mouseleave="isHover = false">
        <div class="v-carousel-go-button-wrapper v-carousel-go-previous">
            <VButton class="v-carousel-go-button" circle type="ghost" @click.stop="goPrevious" v-if="currentIndex != 0"><VIcon :icon="ChevronLeftIcon"></VIcon></VButton>
        </div>
        <div class="v-carousel-go-button-wrapper v-carousel-go-next" >
            <VButton class="v-carousel-go-button" circle type="ghost" @click.stop="goNext" v-if="currentIndex != itemsLength - 1"><VIcon :icon="ChevronRightIcon"></VIcon></VButton>
        </div>
        <div class="v-carousel" ref="carouselRef" :class="{'v-carousel-is-opacity':isOpacity}">
            <slot></slot>
        </div>
        <div class="v-carousel-indicator-wrapper" v-if="(itemsLength > 1) && indicators">
            <div class="v-carousel-indicator-track" :style="{transform: `translateX(-${indicatorOffset}px)`}">
                <div class="v-carousel-indicator" @click="goToSection(i-1)" v-for="i in itemsLength" :key="i">
                    <div class="v-carousel-indicator-item" :class="{'v-carousel-indicator-item-selected': currentIndex == (i - 1)}"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, onUnmounted, ref, useSlots, watch } from 'vue';
import VIcon from '../VIcon.vue';
import ChevronLeftIcon from '@/icons/ChevronLeftIcon.vue';
import ChevronRightIcon from '@/icons/ChevronRightIcon.vue';
import VButton from '../VButton.vue';

export default {
    name: 'VCarousel',
    props:{
        aspectRatio:{
            type: String,
            default: '16/9'
        },
        indicators:{
            type: Boolean,
            default: true,
        },
        autoPlay:{
            type: Boolean,
            default: true
        },
        interval:{
            type: Number,
            default: 3000,
        }
    },
    components:{
        VIcon, VButton
    },
    setup(props, context){

        const carouselRef = ref();
        const currentIndex = ref(0);
        const isHover = ref(false);
        const isOpacity = ref(false); // 從最後一頁換到第一頁使用

        // 獲取 slot 數量
        const slots = useSlots();
        const itemsLength = computed(() => {
            return slots.default?.().length ?? 0
        })


        // 換頁
        function goNext(){
            const items = carouselRef.value.children;
            const next = items[currentIndex.value + 1];
            if (next) {
                next.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
                currentIndex.value++;
            }
        }
        
        function goPrevious(){
            const items = carouselRef.value.children;
            const previous = items[currentIndex.value - 1];
            if (previous) {
                previous.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
                currentIndex.value--;
            }
        }
        function goToSection(index){
            const items = carouselRef.value.children;
            const section = items[index];
            if (section) {
                if((currentIndex.value == items.length - 1) && index == 0){
                    isOpacity.value = true;
                    setTimeout(() => {
                        currentIndex.value = index;
                        carouselRef.value.scrollLeft = 0;
                        isOpacity.value = false;
                    }, 400);
                    return
                }
                else section.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
                currentIndex.value = index;
            }
        }

        // 最多顯示三個 indicator
        const indicatorOffset = computed(() => {

            const itemWidth = 48;

            const startIndex = Math.max(0, currentIndex.value - 1);
            return startIndex * itemWidth;
        })

        
        // 自動輪播
        let timer = null;

        watch([() => props.autoPlay, () => props.interval], (value) => {
            if(value[0]){
                startAutoPlay();
            }
            else{
                stopAutoPlay();
            }
        },{ immediate: true })

        watch(isHover, (hover)=>{
            
            if(!props.autoPlay) return;
            
            // 當 Hover 時，自動重置
            if(hover) stopAutoPlay();
            else startAutoPlay();
        })

        function startAutoPlay(){

            stopAutoPlay(); // 清除正在執行的 timer 確保同時只有一個 timer 在運行

            timer = setInterval(() => {
                if(isHover.value) return;

                if(currentIndex.value == (itemsLength.value - 1)){
                    goToSection(0)
                }
                else goNext();

            }, props.interval);
        }

        function stopAutoPlay(){
            if(timer){
                clearInterval(timer)
                timer = null;
            }
        }

        onUnmounted(()=>{
            stopAutoPlay();
        })


        return{
            carouselRef, goNext, goPrevious, goToSection, ChevronLeftIcon, ChevronRightIcon, currentIndex, itemsLength, indicatorOffset, isHover, isOpacity
        }
    }
}
</script>

<style>

    /* General*/
    .v-carousel-wrapper{
        width: 100%;
        position: relative;
    }
    .v-carousel-wrapper:hover .v-carousel-go-button-wrapper{
        opacity: 1;
    }
    .v-carousel{
        width: 100%;
        height: 100%;
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        background: black;
        box-sizing: border-box;
        scroll-snap-type: x mandatory;
        opacity: 1;
        transition: opacity 0.35s linear;
        position: relative;
        z-index: 1;
    }
    .v-carousel-is-opacity{
        opacity: 0;
    }

    /* Button */
    .v-carousel-go-button-wrapper{
        position: absolute;
        width: 40px;
        height: 40px;
        top: 50%;
        transform: translateY(-50%);
        background: transparent;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--v-text-gray);
        opacity: 0;
        transition: opacity 0.3s linear;
        z-index: 2;
    }
    .v-carousel-go-button{
        background: var(--v-surfaces-gray);
        border: 0;
    }
    .v-carousel-go-previous{
        left: 20px;
    }
    .v-carousel-go-next{
        right: 20px;
    }

    /* indicator */
    .v-carousel-indicator-wrapper{
        max-width: 136px;
        box-sizing: border-box;
        height: 10px;
        position: absolute;
        bottom: 15px;
        left: 50%;
        transform: translateX(-50%);
        overflow: hidden;
        z-index: 2;
    }
    .v-carousel-indicator-track{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        transition: transform 0.3s linear;
    }
    .v-carousel-indicator{
        height: 100%;
        flex-shrink: 0;
        flex-grow: 0;
        flex-basis: 40px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
    }
    .v-carousel-indicator-item{
        width: 100%;;
        height: 2.5px;
        background: rgba(255,255,255,0.15);
        transition: background 0.3s linear;
    }

    .v-carousel-indicator:hover{
        cursor: pointer;
    }
    .v-carousel-indicator:hover .v-carousel-indicator-item{
        background: rgba(255, 255, 255, 0.7);
    }

    .v-carousel-indicator-item-selected{
        background: rgba(255, 255, 255, 0.7);
    }
</style>