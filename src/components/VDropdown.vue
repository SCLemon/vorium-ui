<template>
  <div class="v-dropdown-wrapper" :class="[`v-dropdown-wrapper-${placement}`,
    {
        'v-dropdown-wrapper-is-visible': isVisible,
        'v-dropdown-wrapper-has-border': hasBorder,
        [`v-dropdown-wrapper-${placement}-has-border`]: hasBorder,
    }]" 
    :style="{ width, minHeight, 
        '--arrow-position': arrowPosition, 
        '--arrow-border-color': arrowBorderColor, 
        '--arrow-size': arrowSize,
        '--arrow-inner-size': `calc(${arrowSize} - 1px)`,
        '--dropdown-bg': background, 
        '--dropdown-border-color': dropDownBorderColor 
    }">
    <slot></slot>
  </div>
</template>

<script>
export default {
    name: 'VDropdown',
    props:{
        placement:{
            type: String,
            default: 'top'
        },
        width: {
            type: String,
            default: '100%'
        },
        minHeight:{
            type: String,
            default: '30px'
        },
        background:{
            type: String,
            default: 'black'
        },
        hasBorder:{
            type: Boolean,
            default: true,
        },
        dropDownBorderColor: {
            type: String,
            default: 'rgba(255,255,255,0.3)'
        },
        arrowBorderColor: {
            type: String,
            default: 'rgba(0,0,0,0.4)'
        },
        isVisible:{
            type: Boolean,
            default: true
        },
        arrowPosition:{
            type: String,
            default: '50%'
        },
        arrowSize: {
            type: String,
            default: '8px'
        }
    },
}
</script>

<style>
    .v-dropdown-wrapper{
        position: relative;
        bottom: 120%;
        left: 0;
        box-sizing: border-box;
        background: var(--dropdown-bg);
        opacity: 0;
        transition: opacity 0.3s ease,
                    visibility 0s linear .3s;
        user-select: none;
        visibility: hidden;
    }
    .v-dropdown-wrapper-is-visible{
        visibility: visible;
        opacity: 1;
        transition:
            opacity .3s ease,
            visibility 0s linear 0s;
    }
    .v-dropdown-wrapper-has-border{
        border: 1px solid var(--dropdown-border-color);
    }

    /* top */
    .v-dropdown-wrapper-top::before{
        content: '';
        position: absolute;
        left: var(--arrow-position);
        bottom: calc(var(--arrow-size) * -1);
        transform: translateX(-50%);
        border-left: var(--arrow-size) solid transparent;
        border-right: var(--arrow-size) solid transparent;
        border-top: var(--arrow-size) solid transparent;
    }

    .v-dropdown-wrapper-top::after{
        content: '';
        position: absolute;
        left: var(--arrow-position);
        bottom: calc(var(--arrow-inner-size) * -1 + 0.5px);
        transform: translateX(-50%);
        border-left: var(--arrow-inner-size) solid transparent;
        border-right: var(--arrow-inner-size) solid transparent;
        border-top: var(--arrow-inner-size) solid var(--dropdown-bg);
    }

    .v-dropdown-wrapper-top-has-border::before{
        border-top-color: var(--arrow-border-color);
    }

    /* right */
    .v-dropdown-wrapper-right::before{
        content: '';
        position: absolute;
        top: var(--arrow-position);
        left: calc(var(--arrow-size) * -1);
        transform: translateY(-50%);
        border-top: var(--arrow-size) solid transparent;
        border-bottom: var(--arrow-size) solid transparent;
        border-right: var(--arrow-size) solid transparent;
    }

    .v-dropdown-wrapper-right::after{
        content: '';
        position: absolute;
        top: var(--arrow-position);
        left: calc(var(--arrow-inner-size) * -1 + 0.5px);
        transform: translateY(-50%);
        border-top: var(--arrow-inner-size) solid transparent;
        border-bottom: var(--arrow-inner-size) solid transparent;
        border-right: var(--arrow-inner-size) solid var(--dropdown-bg);
    }

    .v-dropdown-wrapper-right-has-border::before{
        border-right-color: var(--arrow-border-color);
    }

    /* bottom */
    .v-dropdown-wrapper-bottom::before{
        content: '';
        position: absolute;
        left: var(--arrow-position);
        top: calc(var(--arrow-size) * -1);
        transform: translateX(-50%);
        border-left: var(--arrow-size) solid transparent;
        border-right: var(--arrow-size) solid transparent;
        border-bottom: var(--arrow-size) solid transparent;
    }

    .v-dropdown-wrapper-bottom::after{
        content: '';
        position: absolute;
        left: var(--arrow-position);
        top: calc(var(--arrow-inner-size) * -1 + 0.5px);
        transform: translateX(-50%);
        border-left: var(--arrow-inner-size) solid transparent;
        border-right: var(--arrow-inner-size) solid transparent;
        border-bottom: var(--arrow-inner-size) solid var(--dropdown-bg);
    }

    .v-dropdown-wrapper-bottom-has-border::before{
        border-bottom-color: var(--arrow-border-color);
    }

    /* left */
    .v-dropdown-wrapper-left::before{
        content: '';
        position: absolute;
        top: var(--arrow-position);
        right: calc(var(--arrow-size) * -1);
        transform: translateY(-50%);
        border-top: var(--arrow-size) solid transparent;
        border-bottom: var(--arrow-size) solid transparent;
        border-left: var(--arrow-size) solid transparent;
    }

    .v-dropdown-wrapper-left::after{
        content: '';
        position: absolute;
        top: var(--arrow-position);
        right: calc(var(--arrow-inner-size) * -1 + 0.5px);
        transform: translateY(-50%);
        border-top: var(--arrow-inner-size) solid transparent;
        border-bottom: var(--arrow-inner-size) solid transparent;
        border-left: var(--arrow-inner-size) solid var(--dropdown-bg);
    }

    .v-dropdown-wrapper-left-has-border::before{
        border-left-color: var(--arrow-border-color);
    }
        

</style>