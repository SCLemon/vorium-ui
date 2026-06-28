<template>
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <mask id="info-filled-mask">
        <rect
          width="24"
          height="24"
          fill="white"
        />

        <circle
          cx="12"
          cy="7.8"
          r="0.8"
          fill="black"
        />

        <path
          d="M12 11V16"
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
      mask="url(#info-filled-mask)"
    />
  </svg>
</template>

<script>
export default {
  name: 'InfoFilledIcon'
}
</script>