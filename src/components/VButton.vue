<template>
  <button
    class="v-button" 
    :class="[ 
        `v-button--${type}`,`v-button--${size}`,
        { 
            [`is-disabled--${type}`]: disabled || loading, 
            'is-disabled': disabled || loading,
            'is-loading': loading,
            'is-circle': circle,
            'is-round': round
        }
    ]" 
    :disabled="disabled || loading">

    <template v-if="loading">
        <VIcon :icon="loadingIcon" :size="iconSize"></VIcon>
        <div v-if="!circle" :class="`v-button-loading-text--${size}`">{{ loadingText }}</div>
    </template>

    <slot v-else></slot>

  </button>
</template>

<script>

import VIcon from '@/components/VIcon.vue';
import { LoadingIcon } from '@/icons/index.js';
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
    size: {
        type: String,
        default: 'md',
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

    // loading 圖案大小
    const sizeMap = {
        xs: 12, sm: 14, md: 16, lg: 18, xl: 20,
    }
    const iconSize = computed(() => sizeMap[props.size] || 16)

    return {
        VIcon, iconSize
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
    border-radius: var(--v-button-border-radius);
    overflow: hidden;
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
    transition: opacity var(--v-transition-fast);
    border-radius: var(--v-button-border-radius);
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
}
.v-button--primary:not(:disabled):hover{
    color: white;
    background: var(--v-surfaces-hover-primary);
    border: 1px solid white;
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

.is-disabled {
    color: var(--v-text-gray);
    cursor: not-allowed !important;
}
.is-disabled:hover::before{
    opacity: 0 !important;
}

.is-disabled--primary{
    background: var(--v-surfaces-primary-disabled);
}
.is-disabled--danger{
    background: var(--v-surfaces-danger-disabled);
}
.is-disabled--warning{
    background: var(--v-surfaces-warning-disabled);
}
.is-disabled--success{
    background: var(--v-surfaces-success-disabled);
}
.is-disabled--info{
    background: var(--v-surfaces-info-disabled);
}
.is-disabled--ghost{
    background: var(--v-surfaces-ghost-disabled);
}


/* =========================
   Sizes
========================= */

.v-button--xs {
    padding: 0 16px;
    height: var(--v-height-xs);
    font-size: var(--v-font-xs);
}

.v-button--sm {
    padding: 0 18px;
    height:  var(--v-height-sm);
    font-size: var(--v-font-sm);
}

.v-button--md {
    padding: 0 20px;
    height: var(--v-height-md);
    font-size: var(--v-font-md);
}

.v-button--lg {
    padding: 0 22px;
    height: var(--v-height-lg);
    font-size: var(--v-font-lg);
}

.v-button--xl {
    padding: 0 24px;
    height: var(--v-height-xl);
    font-size: var(--v-font-xl);
}

/* =========================
   Round
========================= */

.is-round{
    border-radius: var(--v-border-radius-round);
}

/* =========================
   Circle
========================= */

.is-circle{
    padding:0;
    aspect-ratio: 1/1;
    border-radius: var(--v-border-radius-circle);
}


/* =========================
   Loading
========================= */

.is-loading{
    cursor: wait !important;
}
.v-button-loading-text--xs{
    margin-left: 12px;
}
.v-button-loading-text--sm{
    margin-left: 14px;
}
.v-button-loading-text--md{
    margin-left: 16px;
}
.v-button-loading-text--lg{
    margin-left: 18px;
}
.v-button-loading-text--xl{
    margin-left: 20px;
}

</style>