<template>
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <mask id="check-filled-mask">
        <rect width="24" height="24" fill="white" />

        <path
          d="M8.5 12L11 14.5L15.5 10"
          stroke="black"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
        />
      </mask>
    </defs>

    <circle
      cx="12"
      cy="12"
      r="10"
      fill="currentColor"
      mask="url(#check-filled-mask)"
    />
  </svg>
</template>

<script>
export default {
  name: 'CheckFilledIcon'
}
</script>