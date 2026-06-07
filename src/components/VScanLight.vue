<template>
  <div :class="`v-${scan}-wrapper v-${scan}`">
    <slot></slot>
  </div>
</template>

<script>
export default {
    name:'VScanLight',
    props:{
        scan:{
            type: String,
            default: 'light-sweep' // or text-shimmer   
        }
    }
}
</script>

<style>
    /* Light Sweep */
    .v-light-sweep-wrapper{
        color: var(--v-text-gray);
        padding: 5px;
    }
    .v-light-sweep{
        position: relative;
        overflow: hidden;
    }

    .v-light-sweep::after{
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
        animation: light-sweep 4.4s linear infinite;

        pointer-events: none;
    }

    @keyframes light-sweep{
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
    
     /* Text Shimmer */
    .v-text-shimmer-wrapper{
        padding: 5px;
        color: transparent;
        background: linear-gradient(
            90deg,
            #8a8a8a 0%,
            #8a8a8a 45%,
            #ffffff 50%,
            #8a8a8a 55%,
            #8a8a8a 100%
        );

        background-size: 400% 100%;
        background-position: -400% 0;

        -webkit-background-clip: text;
        background-clip: text;

        filter: drop-shadow(
            0 0 6px rgba(255,255,255,.08)
        );
    }

    .v-text-shimmer{
        animation: text-shimmer 26s linear infinite;
        will-change: background-position;
    }

    @keyframes text-shimmer{
        from{
            background-position: 400% 0;
        }

        to{
            background-position: -400% 0;
        }
    }
</style>