<template>
  <button
    class="v-button" 
    :class="[ 
        `v-button--${type}`,
        { 
            [`v-button-is-disabled--${type}`]: disabled || loading, 
            'v-button-is-disabled': disabled || loading,
            'v-button-is-loading': loading,
            'v-button-is-loading-primary': type == 'primary',
            'v-button-is-circle': circle,
            'v-button-is-round': round
        }
    ]" 
    :style="{ width, height: (circle? '' :height) , fontSize, padding }"
    
    :disabled="disabled || loading">

    <template v-if="loading">
        <VIcon :icon="loadingIcon" :size="iconSize"></VIcon>
        <div v-if="!circle" class="v-button-loading-text" :class="{'v-button-loading-text-no-content': loadingText.trim()==''}">{{ loadingText }}</div>
    </template>

    <slot v-else></slot>

  </button>
</template>

<script>

import VIcon from '../components/VIcon.vue';
import { LoadingIcon } from '../icons/index.js';
import { computed } from 'vue';

export default {
  name: 'VButton',
  components:{
    VIcon
  },
  props: {
    type: {
        type: String,
        default: 'primary',
    },
    width: {
        type: String,
        default: '100%'
    },
    height:{
        type: String,
        default: '38px'
    },
    fontSize:{
        type: String,
        default: '16px'
    },
    iconSize:{
        type: Number,
        default: 14,
    },
    padding:{
        type: String,
        default: '0 20px'
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    // cirle 優先級較 round 高
    circle:{
        type: Boolean,
        default: false
    },
    round:{
        type: Boolean,
        default: false,
    },
    loading:{
        type: Boolean,
        default: false,
    },
    loadingText:{
        type: String,
        default: 'Loading'
    },
    loadingIcon:{
        type:Object,
        default:() => LoadingIcon
    }
  },

  setup(props){

    return {
        VIcon
    }
  }
}
</script>

<style>

/* =========================
   Common
========================= */

.v-button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border: 0;
    position: relative;
    box-sizing: border-box;
    border: var(--v-border);
    border-radius: var(--v-border-radius);
    overflow: hidden;
    font-variant-numeric: tabular-nums;
}

.v-button:not(:disabled):hover{
    cursor: pointer;
}

.v-button::before {
    content: "";
    position: absolute;
    inset: 0;
    opacity: 0;
    background: var(--v-surfaces-hover);
    transition: opacity 0.25s linear;
    border-radius: var(--v-border-radius);
    pointer-events: none;
}

.v-button:not(:disabled):hover::before {
    opacity: var(--v-opacity-hover);
}
.v-button:not(:disabled):active::before{
    opacity: var(--v-opacity-active);
}



/* =========================
   Variants
========================= */

.v-button--primary {
    background: var(--v-surface-primary);
    color: var(--v-text-black);
    transition: all 0.25s linear;
}
.v-button--primary:not(:disabled):hover{
    color: white;
    background: var(--v-surfaces-hover-primary);
    border: 0.1px solid rgba(190,190,190);
}
.v-button--primary:not(:disabled):hover::before{
    opacity: 0;
}
.v-button--primary:not(:disabled):active::before{
    opacity: 1;
}

.v-button--danger {
    background: var(--v-surfaces-danger);
    color: var(--v-text-white);
}

.v-button--warning {
    background: var(--v-surfaces-warning);
    color: var(--v-text-white);
}
.v-button--success {
    background: var(--v-surfaces-success);
    color: var(--v-text-white);
}
.v-button--info {
    background: var(--v-surfaces-info);
    color: var(--v-text-white);
}
.v-button--ghost {
    background: var(--v-surfaces-ghost);
    color: var(--v-text-white);
}

/* =========================
   Disabled
========================= */

.v-button-is-disabled {
    color: var(--v-text-gray);
    cursor: not-allowed !important;
}
.v-button-is-disabled:hover::before{
    opacity: 0 !important;
}

.v-button-is-disabled--primary{
    background: var(--v-surfaces-primary-disabled);
}
.v-button-is-disabled--danger{
    background: var(--v-surfaces-danger-disabled);
}
.v-button-is-disabled--warning{
    background: var(--v-surfaces-warning-disabled);
}
.v-button-is-disabled--success{
    background: var(--v-surfaces-success-disabled);
}
.v-button-is-disabled--info{
    background: var(--v-surfaces-info-disabled);
}
.v-button-is-disabled--ghost{
    background: var(--v-surfaces-ghost-disabled);
}


/* =========================
   Round
========================= */

.v-button-is-round{
    border-radius: var(--v-border-radius-round);
}

/* =========================
   Circle
========================= */

.v-button-is-circle{
    padding: 0 !important;
    aspect-ratio: 1/1;
    border-radius: var(--v-border-radius-circle);
}


/* =========================
   Loading
========================= */

.v-button-is-loading{
    position: relative;
    overflow: hidden;
    cursor: wait !important;
}


.v-button-is-loading::after{
    content: "";
    position: absolute;
    inset: 0;

    background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255,255,255,.05) 30%,
        rgba(255,255,255,.15) 40%,
        rgba(255,255,255,.4) 50%,
        rgba(255,255,255,.15) 60%,
        rgba(255,255,255,.05) 70%,
        transparent 100%
    );

    transform: translateX(-100%);
    animation: v-button-loading-scan 4.4s linear infinite;

    pointer-events: none;
}

.v-button-is-loading-primary::after{
    background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(0,0,0,.03) 30%,
        rgba(0,0,0,.06) 40%,
        rgba(0,0,0,.10) 50%,
        rgba(0,0,0,.06) 60%,
        rgba(0,0,0,.03) 70%,
        transparent 100%
    );
}

@keyframes v-button-loading-scan{
    0%{
        transform: translateX(-100%);
    }

    75%{
        transform: translateX(100%);
    }

    100%{
        transform: translateX(100%);
    }
}

.v-button-loading-text{
    min-width: 4ch;
    margin-left: 14px;
}
.v-button-loading-text-no-content{
    display: none;
}

</style>