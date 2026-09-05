<template>
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="translate(7.5, 8) rotate(-15)">
      <mask id="gear-hole-1">
        <rect x="-10" y="-10" width="20" height="20" fill="white" />
        <circle cx="0" cy="0" r="1.8" fill="black" />
      </mask>
      <g mask="url(#gear-hole-1)">
        <circle cx="0" cy="0" r="4.3" />
        <rect x="-1.5" y="-5.6" width="3" height="11.2" rx="0.9" />
        <rect x="-1.5" y="-5.6" width="3" height="11.2" rx="0.9" transform="rotate(60)" />
        <rect x="-1.5" y="-5.6" width="3" height="11.2" rx="0.9" transform="rotate(120)" />
      </g>
    </g>

    <g transform="translate(15.5, 16) rotate(15)">
      <mask id="gear-hole-2">
        <rect x="-10" y="-10" width="20" height="20" fill="white" />
        <circle cx="0" cy="0" r="1.8" fill="black" />
      </mask>
      <g mask="url(#gear-hole-2)">
        <circle cx="0" cy="0" r="4.3" />
        <rect x="-1.5" y="-5.6" width="3" height="11.2" rx="0.9" />
        <rect x="-1.5" y="-5.6" width="3" height="11.2" rx="0.9" transform="rotate(60)" />
        <rect x="-1.5" y="-5.6" width="3" height="11.2" rx="0.9" transform="rotate(120)" />
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  name: 'SettingsIcon'
}
</script>