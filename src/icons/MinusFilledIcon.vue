<template>
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <mask id="minus-filled-mask">
        <rect
          width="24"
          height="24"
          fill="white"
        />

        <path
          d="M9 12H15"
          stroke="black"
          stroke-width="2"
          stroke-linecap="round"
        />
      </mask>
    </defs>

    <circle
      cx="12"
      cy="12"
      r="10"
      fill="currentColor"
      mask="url(#minus-filled-mask)"
    />
  </svg>
</template>

<script>
export default {
  name: 'MinusFilledIcon'
}
</script>