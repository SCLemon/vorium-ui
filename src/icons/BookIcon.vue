<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <!-- 左頁 -->
    <path
      d="
        M12 5
        C9.8 3.9 6.8 4.0 3.8 5.3
        V18.2
        C6.8 16.8 9.8 17.0 12 19
      "
    />

    <!-- 右頁 -->
    <path
      d="
        M12 5
        C14.2 3.9 17.2 4.0 20.2 5.3
        V18.2
        C17.2 16.8 14.2 17.0 12 19
      "
    />

    <!-- 書脊 -->
    <path d="M12 5V19" />
  </svg>
</template>

<script>
export default {
  name: 'BookIcon'
}
</script>