<template>
  <div class="student-shell">
    <!-- Top bar (shown only when logged in) -->
    <StudentTopbar v-if="isLoggedIn" />

    <!-- Main content -->
    <main class="student-main" :class="{ 'has-topbar': isLoggedIn, 'has-bottomnav': isLoggedIn }">
      <slot />
    </main>

    <!-- Bottom navigation (shown only when logged in) -->
    <StudentBottomNav v-if="isLoggedIn" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isLoggedIn = computed(() => route.path !== '/login' && route.path !== '/')
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  font-family: 'Segoe UI', 'Noto Sans Thai', sans-serif;
  font-size: 15px;
  color: #1e293b;
  background: #f1f5f9;
  -webkit-font-smoothing: antialiased;
}

:root {
  --student-shell-max-width: 820px;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
}
</style>

<style scoped>
.student-shell {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  max-width: var(--student-shell-max-width);
  width: 100%;
  margin: 0 auto;
  position: relative;
}

.student-main {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.student-main.has-topbar {
  padding-top: 60px;
}

.student-main.has-bottomnav {
  padding-bottom: 72px;
}

@media (min-width: 768px) {
  .student-shell {
    border-left: 1px solid #e2e8f0;
    border-right: 1px solid #e2e8f0;
    box-shadow: 0 8px 32px rgba(15, 23, 42, 0.08);
  }

  .student-main.has-topbar {
    padding-top: 68px;
  }

  .student-main.has-bottomnav {
    padding-bottom: 84px;
  }
}
</style>
