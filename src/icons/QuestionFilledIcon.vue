<template>
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <mask id="question-filled-mask">
        <rect
          width="24"
          height="24"
          fill="white"
        />

        <path
          d="M10.2 9.5C10.2 8.2 11.1 7.4 12.4 7.4C13.7 7.4 14.6 8.2 14.6 9.4C14.6 10.3 14.1 10.9 13.2 11.5C12.4 12.1 12 12.5 12 13.8"
          stroke="black"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
        />

        <circle
          cx="12"
          cy="16.6"
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
      mask="url(#question-filled-mask)"
    />
  </svg>
</template>

<script>
export default {
  name: 'QuestionFilledIcon'
}
</script>