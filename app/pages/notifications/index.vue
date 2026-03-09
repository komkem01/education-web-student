<template>
  <div class="notif-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h2 class="page-title">การแจ้งเตือน</h2>
        <p class="page-sub">{{ unreadCount > 0 ? `ยังไม่ได้อ่าน ${unreadCount} รายการ` : 'อ่านทั้งหมดแล้ว' }}</p>
      </div>
      <button v-if="unreadCount > 0" class="btn-mark-all" @click="markAllRead">
        อ่านทั้งหมด
      </button>
    </div>

    <div v-if="isLoading" class="empty-state">
      <span class="empty-icon">⏳</span>
      <p>กำลังโหลดการแจ้งเตือน...</p>
    </div>

    <div v-else-if="accessDenied" class="empty-state empty-state--warn">
      <span class="empty-icon">🔒</span>
      <p>{{ errorMessage || 'ไม่มีสิทธิ์เข้าถึงข้อมูลการแจ้งเตือน' }}</p>
    </div>

    <template v-else>

    <!-- Notification list -->
    <div class="notif-list">
      <div
        v-for="notif in notifications"
        :key="notif.id"
        class="notif-card"
        :class="{ 'notif-card--unread': !notif.read }"
        @click="markRead(notif.id)"
      >
        <div class="notif-icon-wrap" :style="{ background: typeColor(notif.type) + '22' }">
          <span class="notif-icon">{{ typeIcon(notif.type) }}</span>
        </div>
        <div class="notif-content">
          <div class="notif-header-row">
            <p class="notif-title" :class="{ 'notif-title--bold': !notif.read }">{{ notif.title }}</p>
            <span v-if="!notif.read" class="unread-dot" />
          </div>
          <p class="notif-body">{{ notif.body }}</p>
          <p class="notif-time">{{ notif.timestamp }}</p>
        </div>
      </div>

      <div v-if="notifications.length === 0" class="empty-state">
        <span class="empty-icon">🔔</span>
        <p>ยังไม่มีการแจ้งเตือน</p>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNotificationsData } from '../../composables/useNotificationsData'

type NotifType = 'grade' | 'attendance' | 'announcement' | 'system' | 'document'

const { notifications, markRead, markAllRead, isLoading, accessDenied, errorMessage } = useNotificationsData()

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

function typeIcon(type: NotifType): string {
  const map: Record<NotifType, string> = {
    grade: '📊',
    attendance: '⏰',
    announcement: '📢',
    system: '⚙️',
    document: '📄',
  }
  return map[type] ?? '🔔'
}

function typeColor(type: NotifType): string {
  const map: Record<NotifType, string> = {
    grade: '#2563eb',
    attendance: '#f59e0b',
    announcement: '#8b5cf6',
    system: '#16a34a',
    document: '#0891b2',
  }
  return map[type] ?? '#64748b'
}
</script>

<style scoped>
.notif-page {
  padding: 16px 16px 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty-state--warn {
  border: 1px solid #fed7aa;
  color: #9a3412;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.page-title {
  font-size: 20px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 2px;
}

.page-sub {
  font-size: 12px;
  color: #64748b;
}

.btn-mark-all {
  padding: 6px 14px;
  background: #eff6ff;
  color: #2563eb;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 0.2s;
}

.btn-mark-all:active { background: #dbeafe; }

/* List */
.notif-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.notif-card {
  background: #fff;
  border-radius: 16px;
  padding: 14px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  box-shadow: 0 1px 6px rgba(0,0,0,.05);
  cursor: pointer;
  transition: background 0.15s;
}

.notif-card:active { background: #f8fafc; }

.notif-card--unread {
  border-left: 3px solid #2563eb;
  background: #fdfdff;
}

.notif-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notif-icon { font-size: 22px; }

.notif-content { flex: 1; min-width: 0; }

.notif-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 6px;
  margin-bottom: 4px;
}

.notif-title {
  font-size: 14px;
  color: #475569;
  line-height: 1.4;
}

.notif-title--bold {
  font-weight: 700;
  color: #1e293b;
}

.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2563eb;
  flex-shrink: 0;
  margin-top: 4px;
}

.notif-body {
  font-size: 12px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notif-time {
  font-size: 11px;
  color: #94a3b8;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 40px 16px;
  color: #94a3b8;
  background: #fff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.empty-icon { font-size: 36px; }
</style>
