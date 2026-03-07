<template>
  <nav class="bottom-nav">
    <NuxtLink
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      class="nav-item"
      active-class="nav-item--active"
    >
      <span class="nav-icon" v-html="item.icon" />
      <span class="nav-label">{{ item.label }}</span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
const navItems = [
  {
    path: '/home',
    label: 'หน้าหลัก',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9 21V12h6v9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
  {
    path: '/schedule',
    label: 'ตารางเรียน',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/>
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <rect x="7" y="14" width="3" height="3" rx=".5" fill="currentColor"/>
      <rect x="11" y="14" width="3" height="3" rx=".5" fill="currentColor"/>
    </svg>`,
  },
  {
    path: '/grades',
    label: 'ผลการเรียน',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
  {
    path: '/attendance',
    label: 'การเข้าเรียน',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/>
      <path d="M12 7v5l3 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
  {
    path: '/profile',
    label: 'ข้อมูลฉัน',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8"/>
      <path d="M4 20c0-4 4-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`,
  },
]
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: max(8px, env(safe-area-inset-bottom));
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 16px);
  max-width: calc(var(--student-shell-max-width) - 16px);
  height: 72px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #dbe4f0;
  border-radius: 22px;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 6px;
  z-index: 50;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.14);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  flex: 1;
  padding: 9px 4px;
  color: #64748b;
  border-radius: 14px;
  transition: color 0.2s, background 0.2s, transform 0.15s;
  min-width: 0;
  text-decoration: none;
}

.nav-item:active {
  color: #2563eb;
  transform: scale(0.98);
}

.nav-item--active {
  color: #2563eb;
  background: #eff6ff;
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-label {
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60px;
}

.nav-item--active .nav-label {
  font-weight: 700;
}

.nav-item--active .nav-icon {
  transform: translateY(-1px);
}

@media (min-width: 768px) {
  .bottom-nav {
    bottom: 10px;
    width: calc(100% - 24px);
    max-width: calc(var(--student-shell-max-width) - 24px);
    height: 84px;
    border-radius: 24px;
    padding: 0 12px;
  }

  .nav-item {
    gap: 6px;
    padding: 10px 6px;
    border-radius: 16px;
  }

  .nav-label {
    font-size: 12px;
    max-width: 96px;
  }
}
</style>
