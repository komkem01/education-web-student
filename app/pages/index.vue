<template>
  <div>
    <NuxtRedirect to="/login" />
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from '#app'
await navigateTo('/login', { redirectCode: 301 })
</script>
