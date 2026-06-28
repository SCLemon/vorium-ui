<template>
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <mask id="exclamation-filled-mask">
        <rect
          width="24"
          height="24"
          fill="white"
        />

        <path
          d="M12 7.5V13"
          stroke="black"
          stroke-width="2"
          stroke-linecap="round"
        />

        <circle
          cx="12"
          cy="16.5"
          r="0.8"
          fill="black"
        />
      </mask>
    </defs>

    <circle
      cx="12"
      cy="12"
      r="10"
      fill="currentColor"
      mask="url(#exclamation-filled-mask)"
    />
  </svg>
</template>

<script>
export default {
  name: 'ExclamationFilledIcon'
}
</script>