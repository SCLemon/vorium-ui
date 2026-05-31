<template>
  <button
    class="v-button" 
    :class="[ 
        `v-button--${type}`,`v-button--${size}`,
        { [`is-disabled--${type}`]: disabled, 
            'is-disabled': disabled || isLoading,
            'is-loading': isLoading,
            'is-circle': circle 
        }
    ]" 
    :disabled="disabled || isLoading">

    <template v-if="isLoading">
        <VIcon :icon="LoadingIcon" :size="iconSize"></VIcon>
        <div v-if="!circle" class="v-button-loading-text">{{ loadingText }}</div>
    </template>

    <slot v-else></slot>

  </button>
</template>

<script>
import { LoadingIcon } from '@/icons/index.js';
import VIcon from '@/components/foundation/VIcon.vue';
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
        default: 'xs',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    circle:{
        type: Boolean,
        default: false
    },
    isLoading:{
        type: Boolean,
        default: false,
    },
    loadingText:{
        type: String,
        default: '運行中'
    }
  },

  setup(props){

    // loading 圖案大小
    const sizeMap = {
        xs: 12, sm: 14, md: 16, lg: 18, xl: 20,
    }
    const iconSize = computed(() => sizeMap[props.size] || 16)

    return {
        LoadingIcon, VIcon, iconSize
    }
  }
}
</script>

<style>
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

.v-button:hover::before {
    opacity: var(--v-opacity-hover);
}
.v-button:active::before{
    opacity: var(--v-opacity-active);
}

/* =========================
   Variants
========================= */

.v-button--primary {
    background: var(--v-surface-primary);
    color: var(--v-text-black);
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
   Circle
========================= */

.is-circle{
    padding:0;
    aspect-ratio: 1/1;
    border-radius: 50%;
}

/* =========================
   Loading
========================= */

.is-loading{
    cursor: wait !important;
}
.v-button-loading-text{
    margin-left: 12px;
}

</style>