<template>
  <svg
    class="v-loading-icon"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      class="v-loading-track"
      cx="12"
      cy="12"
      r="9"
    />

    <path
      class="v-loading-head"
      d="M21 12A9 9 0 0 0 12 3"
    />
  </svg>
</template>

<script>
export default {
  name: 'LoadingIcon',
}
</script>

<style scoped>
.v-loading-icon {
  width: 100%;
  height: 100%;

  animation: vorium-spin 0.8s linear infinite;
}

.v-loading-track {
  stroke: currentColor;
  opacity: 0.15;
  stroke-width: 2;
}

.v-loading-head {
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}

@keyframes vorium-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>