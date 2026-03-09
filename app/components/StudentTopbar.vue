<template>
  <header class="topbar">
    <div class="topbar-left">
      <div class="logo-mark">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path d="M10 2L3 6v8l7 4 7-4V6L10 2z" fill="#fff" fill-opacity=".9" />
        </svg>
      </div>
      <div class="topbar-info">
        <span class="school-name">{{ schoolName }}</span>
        <span class="term-label">{{ termLabel }}</span>
      </div>
    </div>
    <div class="topbar-right">
      <button class="notif-btn" aria-label="การแจ้งเตือน" @click="router.push('/notifications')">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M15 17h5l-1.405-1.405C18.21 15.21 18 14.617 18 14V11a6 6 0 0 0-9.33-4.997A6 6 0 0 0 6 11v3c0 .617-.21 1.21-.595 1.595L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span v-if="unreadCount > 0" class="notif-dot">{{ unreadCount }}</span>
      </button>

      <button class="logout-btn" aria-label="ออกจากระบบ" @click="showLogoutModal = true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M16 17l5-5-5-5" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M21 12H9" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>ออก</span>
      </button>
    </div>
  </header>

  <Teleport to="body">
    <div v-if="showLogoutModal" class="logout-modal-backdrop" @click.self="closeLogoutModal">
      <div class="logout-modal-card" role="dialog" aria-modal="true" aria-labelledby="logout-modal-title">
        <h3 id="logout-modal-title" class="logout-modal-title">ยืนยันออกจากระบบ</h3>
        <p class="logout-modal-text">คุณต้องการออกจากระบบตอนนี้หรือไม่</p>
        <div class="logout-modal-actions">
          <button class="btn-cancel" @click="closeLogoutModal">ยกเลิก</button>
          <button class="btn-confirm" @click="confirmLogout">ยืนยันออกจากระบบ</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationsData } from '../composables/useNotificationsData'
import { useStudentHeaderInfo } from '../composables/useStudentHeaderInfo'

const router = useRouter()
const authToken = useCookie<string | null>('edu_student_token')
const activeRole = useCookie<string | null>('edu_active_role')
const studentEmail = useCookie<string | null>('edu_student_email')
const { notifications } = useNotificationsData()
const { schoolName, termLabel } = useStudentHeaderInfo()
const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)
const showLogoutModal = ref(false)

function closeLogoutModal() {
  showLogoutModal.value = false
}

function confirmLogout() {
  authToken.value = null
  activeRole.value = null
  studentEmail.value = null
  closeLogoutModal()
  router.push('/login')
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && showLogoutModal.value) {
    closeLogoutModal()
  }
}

watch(showLogoutModal, (open) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = open ? 'hidden' : ''
  }
})

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleEscape)
}

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleEscape)
  }
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.topbar {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: var(--student-shell-max-width);
  height: 60px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 50;
  box-shadow: 0 2px 8px rgba(37,99,235,.3);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-mark {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.topbar-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.school-name {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
}

.term-label {
  font-size: 11px;
  color: rgba(255,255,255,0.75);
  line-height: 1.2;
}

.notif-btn {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s;
}

.notif-btn:active {
  background: rgba(255,255,255,0.25);
}

.notif-dot {
  position: absolute;
  top: 6px;
  right: 6px;
  min-width: 16px;
  height: 16px;
  background: #ef4444;
  border-radius: 8px;
  font-size: 9px;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
  border: 1.5px solid #1d4ed8;
}

.logout-btn {
  height: 40px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.28);
  color: #fff;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
  transition: background 0.2s;
}

.logout-btn:active {
  background: rgba(255,255,255,0.3);
}

.logout-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 120;
}

.logout-modal-card {
  width: 100%;
  max-width: 340px;
  border-radius: 16px;
  background: #fff;
  padding: 18px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.24);
}

.logout-modal-title {
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 8px;
}

.logout-modal-text {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 16px;
}

.logout-modal-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.btn-cancel,
.btn-confirm {
  height: 38px;
  border-radius: 10px;
  padding: 0 12px;
  font-size: 13px;
  font-weight: 700;
}

.btn-cancel {
  background: #fff;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.btn-confirm {
  background: #dc2626;
  color: #fff;
  border: 1px solid #dc2626;
}

.btn-cancel:active {
  background: #f9fafb;
}

.btn-confirm:active {
  background: #b91c1c;
}

@media (min-width: 768px) {
  .topbar {
    height: 68px;
    padding: 0 22px;
  }

  .logo-mark {
    width: 36px;
    height: 36px;
  }

  .school-name {
    font-size: 14px;
  }

  .term-label {
    font-size: 12px;
  }

  .notif-btn {
    width: 44px;
    height: 44px;
  }

  .logout-btn {
    height: 44px;
    padding: 0 14px;
    font-size: 13px;
  }

  .logout-modal-card {
    max-width: 380px;
    padding: 20px;
  }
}
</style>
