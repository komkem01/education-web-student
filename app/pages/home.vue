<template>
  <div class="home-page">
    <!-- Welcome section -->
    <div class="welcome-section">
      <div class="welcome-avatar">{{ profile.firstName.charAt(0) }}</div>
      <div class="welcome-info">
        <p class="welcome-greeting">สวัสดี 👋</p>
        <h2 class="welcome-name">{{ profile.prefixTh }}{{ profile.firstName }} {{ profile.lastName }}</h2>
        <p class="welcome-class">{{ profile.classroom }} · เลขที่ {{ profile.classNumber }}</p>
      </div>
    </div>

    <div class="api-session">
      <div class="api-session-title">ข้อมูลผู้ใช้จาก API</div>
      <p v-if="mePending" class="api-session-text">กำลังโหลดข้อมูล...</p>
      <p v-else-if="meError" class="api-session-text api-session-error">ไม่สามารถดึงข้อมูลจาก /auth/me ได้</p>
      <p v-else class="api-session-text">
        member: <strong>{{ meData?.member_id }}</strong>
        · role: <strong>{{ meData?.role }}</strong>
        · school: <strong>{{ meData?.school_id }}</strong>
        · หมดอายุ: <strong>{{ meData?.expires_at }}</strong>
      </p>
    </div>

    <!-- Stats row -->
    <div class="stats-row">
      <NuxtLink to="/attendance" class="stat-card stat-card--blue">
        <div class="stat-value">{{ attendancePercent }}%</div>
        <div class="stat-label">เข้าเรียน</div>
      </NuxtLink>
      <NuxtLink to="/grades" class="stat-card stat-card--green">
        <div class="stat-value">{{ gpa ?? '-' }}</div>
        <div class="stat-label">GPA ล่าสุด</div>
      </NuxtLink>
      <NuxtLink to="/grades" class="stat-card stat-card--purple">
        <div class="stat-value">{{ totalCredits }}</div>
        <div class="stat-label">หน่วยกิต</div>
      </NuxtLink>
    </div>

    <!-- Today schedule -->
    <section class="section">
      <div class="section-header">
        <h3 class="section-title">ตารางเรียนวันนี้</h3>
        <NuxtLink to="/schedule" class="section-link">ดูทั้งหมด</NuxtLink>
      </div>
      <div v-if="todaySchedule.periods.length === 0" class="empty-state">
        <span class="empty-icon">🎉</span>
        <p>ไม่มีคาบเรียนวันนี้</p>
      </div>
      <div v-else class="today-periods">
        <div
          v-for="period in todaySchedule.periods.slice(0, 4)"
          :key="period.period"
          class="period-card"
          :style="{ borderLeftColor: periodBorderColor(period.subject) }"
        >
          <div class="period-time">
            <span class="period-num">คาบ {{ period.period }}</span>
            <span class="period-clock">{{ period.startTime }}–{{ period.endTime }}</span>
          </div>
          <div class="period-info">
            <div class="period-subject">{{ period.subject }}</div>
            <div class="period-meta">{{ period.teacher }} · {{ period.room }}</div>
          </div>
        </div>
        <div v-if="todaySchedule.periods.length > 4" class="more-periods">
          +{{ todaySchedule.periods.length - 4 }} คาบ
          <NuxtLink to="/schedule" class="more-link">ดูเพิ่ม</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Recent grades -->
    <section class="section">
      <div class="section-header">
        <h3 class="section-title">ผลการเรียนล่าสุด</h3>
        <NuxtLink to="/grades" class="section-link">ดูทั้งหมด</NuxtLink>
      </div>
      <div class="grade-list">
        <div
          v-for="g in recentGrades"
          :key="g.id"
          class="grade-row"
        >
          <div class="grade-subject">
            <div class="grade-name">{{ g.subjectName }}</div>
            <div class="grade-teacher">{{ g.teacher }}</div>
          </div>
          <div class="grade-chip" :style="{ background: gradeColor(g.grade) + '22', color: gradeColor(g.grade) }">
            {{ g.grade }}
          </div>
        </div>
      </div>
    </section>

    <!-- Announcements -->
    <section class="section">
      <div class="section-header">
        <h3 class="section-title">ประกาศล่าสุด</h3>
        <NuxtLink to="/notifications" class="section-link">ดูทั้งหมด</NuxtLink>
      </div>
      <div class="announcement-list">
        <div
          v-for="notif in announcements"
          :key="notif.id"
          class="announcement-card"
          :class="{ unread: !notif.read }"
          @click="goToNotification(notif.id)"
        >
          <div class="announcement-content">
            <p class="announcement-title">{{ notif.title }}</p>
            <p class="announcement-body">{{ notif.body }}</p>
          </div>
          <span class="announcement-time">{{ notif.timestamp.split(' ')[0] }}</span>
        </div>
      </div>
    </section>

    <!-- Quick links -->
    <section class="section">
      <h3 class="section-title" style="margin-bottom: 12px">ทางลัด</h3>
      <div class="quick-grid">
        <NuxtLink to="/schedule" class="quick-item">
          <span class="quick-icon">📅</span>
          <span class="quick-label">ตารางเรียน</span>
        </NuxtLink>
        <NuxtLink to="/grades" class="quick-item">
          <span class="quick-icon">📊</span>
          <span class="quick-label">ผลการเรียน</span>
        </NuxtLink>
        <NuxtLink to="/attendance" class="quick-item">
          <span class="quick-icon">🕐</span>
          <span class="quick-label">การเข้าเรียน</span>
        </NuxtLink>
        <NuxtLink to="/profile" class="quick-item">
          <span class="quick-icon">👤</span>
          <span class="quick-label">ข้อมูลฉัน</span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStudentProfile } from '../composables/useStudentProfile'
import { useScheduleData } from '../composables/useScheduleData'
import { useGradesData } from '../composables/useGradesData'
import { useAttendanceData } from '../composables/useAttendanceData'
import { useNotificationsData } from '../composables/useNotificationsData'

const router = useRouter()
const config = useRuntimeConfig()
const authToken = useCookie<string | null>('edu_student_token')
const { profile } = useStudentProfile()
const { schedule } = useScheduleData()
const { currentGrades, gpa, totalCredits, gradeColor } = useGradesData()
const { attendancePercent } = useAttendanceData()
const { notifications } = useNotificationsData()

const { data: meResponse, pending: mePending, error: meError } = useAsyncData(
  'student-auth-me',
  () => $fetch<{ data: { member_id: string; school_id: string; role: string; expires_at: string } }>(`${config.public.apiBase}/auth/me`, {
    headers: {
      Authorization: `Bearer ${authToken.value}`,
    },
  }),
  { server: false },
)

const meData = computed(() => meResponse.value?.data)

// Today's schedule (show Wednesday as demo)
const dayMap: Record<number, string> = { 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri' }
const todayDow = new Date().getDay()
const todayKey = dayMap[todayDow] ?? 'Wed'
const todaySchedule = computed(() =>
  schedule.value.find(d => d.day === todayKey) ?? schedule.value[2]
)

const recentGrades = computed(() =>
  currentGrades.value.filter(g => g.grade !== '-').slice(0, 4)
)

const announcements = computed(() =>
  notifications.value.filter(n => n.type === 'announcement' || n.type === 'grade').slice(0, 3)
)

function periodBorderColor(subject: string): string {
  if (subject.includes('คณิต')) return '#2563eb'
  if (subject.includes('วิทย')) return '#16a34a'
  if (subject.includes('ไทย')) return '#f59e0b'
  if (subject.includes('อังกฤษ')) return '#ef4444'
  if (subject.includes('สังคม') || subject.includes('ประวัติ')) return '#ec4899'
  if (subject.includes('พล')) return '#10b981'
  if (subject.includes('ศิลปะ') || subject.includes('ดนตรี')) return '#8b5cf6'
  if (subject.includes('คอมพิวเตอร์')) return '#6366f1'
  return '#94a3b8'
}

function goToNotification(id: string) {
  router.push('/notifications')
}
</script>

<style scoped>
.home-page {
  padding: 16px 16px 8px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.api-session { background: #ecfeff; border: 1px solid #a5f3fc; border-radius: 12px; padding: 10px 12px; }
.api-session-title { font-size: 0.76rem; font-weight: 700; color: #155e75; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.03em; }
.api-session-text { margin: 0; font-size: 0.8rem; color: #0e7490; line-height: 1.4; }
.api-session-error { color: #b91c1c; }

/* Welcome */
.welcome-section {
  display: flex;
  align-items: center;
  gap: 14px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  border-radius: 16px;
  padding: 18px 16px;
  color: #fff;
  box-shadow: 0 4px 16px rgba(37,99,235,.25);
}

.welcome-avatar {
  width: 52px;
  height: 52px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 800;
  flex-shrink: 0;
}

.welcome-greeting {
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 2px;
}

.welcome-name {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 2px;
}

.welcome-class {
  font-size: 12px;
  opacity: 0.75;
}

/* Stats row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.stat-card {
  border-radius: 14px;
  padding: 14px 10px;
  text-align: center;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: transform 0.15s;
}

.stat-card:active { transform: scale(0.96); }

.stat-card--blue { background: #eff6ff; }
.stat-card--green { background: #f0fdf4; }
.stat-card--purple { background: #f5f3ff; }

.stat-value {
  font-size: 22px;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
}

.stat-card--blue .stat-value { color: #2563eb; }
.stat-card--green .stat-value { color: #16a34a; }
.stat-card--purple .stat-value { color: #7c3aed; }

.stat-label {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
}

/* Section */
.section { display: flex; flex-direction: column; }

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
}

.section-link {
  font-size: 12px;
  color: #2563eb;
  font-weight: 600;
}

/* Today periods */
.today-periods { display: flex; flex-direction: column; gap: 8px; }

.period-card {
  background: #fff;
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 14px;
  border-left: 4px solid #e2e8f0;
  box-shadow: 0 1px 4px rgba(0,0,0,.05);
}

.period-time {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 48px;
  text-align: center;
}

.period-num {
  font-size: 10px;
  font-weight: 600;
  color: #64748b;
}

.period-clock {
  font-size: 10px;
  color: #94a3b8;
}

.period-info { flex: 1; min-width: 0; }

.period-subject {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.period-meta {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.more-periods {
  text-align: center;
  font-size: 13px;
  color: #64748b;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.more-link {
  font-size: 12px;
  color: #2563eb;
  font-weight: 600;
}

/* Grade list */
.grade-list { display: flex; flex-direction: column; gap: 8px; }

.grade-row {
  background: #fff;
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,.05);
}

.grade-subject { flex: 1; min-width: 0; }

.grade-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.grade-teacher {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.grade-chip {
  min-width: 40px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 800;
  flex-shrink: 0;
}

/* Announcements */
.announcement-list { display: flex; flex-direction: column; gap: 8px; }

.announcement-card {
  background: #fff;
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,.05);
  cursor: pointer;
  transition: background 0.15s;
}

.announcement-card:active { background: #f8fafc; }

.announcement-card.unread {
  border-left: 3px solid #2563eb;
}

.announcement-content { flex: 1; min-width: 0; }

.announcement-title {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.announcement-body {
  font-size: 12px;
  color: #64748b;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.announcement-time {
  font-size: 11px;
  color: #94a3b8;
  white-space: nowrap;
  flex-shrink: 0;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 28px 16px;
  color: #94a3b8;
  background: #fff;
  border-radius: 12px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.empty-icon { font-size: 28px; }

/* Quick links */
.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.quick-item {
  background: #fff;
  border-radius: 14px;
  padding: 14px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  box-shadow: 0 1px 4px rgba(0,0,0,.05);
  transition: transform 0.15s;
}

.quick-item:active { transform: scale(0.94); }

.quick-icon { font-size: 24px; }

.quick-label {
  font-size: 11px;
  font-weight: 600;
  color: #475569;
  text-align: center;
  line-height: 1.2;
}

@media (min-width: 768px) {
  .home-page {
    padding: 24px;
    gap: 24px;
  }

  .welcome-section {
    padding: 22px;
    border-radius: 18px;
  }

  .welcome-avatar {
    width: 58px;
    height: 58px;
    font-size: 26px;
  }

  .welcome-name {
    font-size: 18px;
  }

  .stats-row {
    gap: 12px;
  }

  .stat-card {
    padding: 16px 12px;
  }

  .today-periods,
  .grade-list,
  .announcement-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .more-periods {
    grid-column: 1 / -1;
  }

  .quick-grid {
    gap: 12px;
  }
}
</style>
