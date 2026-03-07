<template>
  <div class="schedule-page">
    <!-- Header -->
    <div class="page-header">
      <h2 class="page-title">ตารางเรียน</h2>
      <p class="page-sub">{{ profile.grade }} · {{ profile.classroom }} · ปีการศึกษา {{ profile.academicYear }}</p>
    </div>

    <!-- Day selector -->
    <div class="day-tabs-wrap">
      <div class="day-tabs">
        <button
          v-for="day in schedule"
          :key="day.day"
          class="day-tab"
          :class="{ 'day-tab--active': selectedDay === day.day, 'day-tab--today': day.day === todayKey }"
          @click="selectedDay = day.day"
        >
          <span class="day-abbr">{{ dayShort(day.day) }}</span>
          <span class="day-full">{{ day.dayTh }}</span>
          <span v-if="day.day === todayKey" class="today-dot" />
        </button>
      </div>
    </div>

    <!-- Selected day label -->
    <div class="selected-day-label">
      <span class="day-name">วัน{{ currentDay?.dayTh }}</span>
      <span v-if="currentDay?.day === todayKey" class="today-badge">วันนี้</span>
    </div>

    <!-- Periods list -->
    <div v-if="!currentDay || currentDay.periods.length === 0" class="empty-state">
      <span class="empty-icon">📅</span>
      <p>ไม่มีคาบเรียนวันนี้</p>
    </div>

    <div v-else class="periods-list">
      <!-- Lunch break indicator (after period 4) -->
      <template v-for="(period, idx) in currentDay.periods" :key="period.period">
        <div
          class="period-item"
          :class="{ 'period-item--now': isCurrentPeriod(period) }"
        >
          <div class="period-timeline">
            <div class="timeline-dot" :class="{ 'timeline-dot--now': isCurrentPeriod(period) }" />
            <div v-if="idx < currentDay.periods.length - 1" class="timeline-line" />
          </div>
          <div class="period-card" :style="{ background: period.color }">
            <div class="period-card-left">
              <div class="period-subject">{{ period.subject }}</div>
              <div class="period-code">{{ period.subjectCode }}</div>
            </div>
            <div class="period-card-right">
              <div class="period-time-badge">{{ period.startTime }}–{{ period.endTime }}</div>
              <div v-if="period.teacher" class="period-detail">{{ period.teacher }}</div>
              <div class="period-room">🚪 {{ period.room }}</div>
            </div>
          </div>
          <!-- Now indicator -->
          <div v-if="isCurrentPeriod(period)" class="now-label">กำลังเรียน</div>
        </div>

        <!-- Lunch break after period 4 -->
        <div v-if="period.period === 4" :key="'lunch'" class="break-row">
          <span class="break-icon">🍽️</span>
          <span class="break-label">พักกลางวัน 12:00–13:00</span>
        </div>
      </template>
    </div>

    <!-- Period count -->
    <div v-if="currentDay?.periods.length" class="period-summary">
      {{ currentDay.periods.length }} คาบ · {{ totalPeriodMinutes }} นาที
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStudentProfile } from '../../composables/useStudentProfile'
import { useScheduleData } from '../../composables/useScheduleData'

const { profile } = useStudentProfile()
const { schedule } = useScheduleData()

const dayMap: Record<number, string> = { 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri' }
const todayDow = new Date().getDay()
const todayKey = dayMap[todayDow] ?? 'Mon'

const selectedDay = ref(todayKey)

const dayShortMap: Record<string, string> = {
  Mon: 'จ',
  Tue: 'อ',
  Wed: 'พ',
  Thu: 'พฤ',
  Fri: 'ศ',
}

const currentDay = computed(() =>
  schedule.value.find(d => d.day === selectedDay.value)
)

function dayShort(dayKey: string): string {
  return dayShortMap[dayKey] ?? dayKey
}

function isCurrentPeriod(period: { startTime: string; endTime: string }): boolean {
  if (currentDay.value?.day !== todayKey) return false
  const now = new Date()
  const [sh, sm] = period.startTime.split(':').map(Number)
  const [eh, em] = period.endTime.split(':').map(Number)
  const start = sh * 60 + sm
  const end = eh * 60 + em
  const cur = now.getHours() * 60 + now.getMinutes()
  return cur >= start && cur < end
}

const totalPeriodMinutes = computed(() => {
  if (!currentDay.value) return 0
  return currentDay.value.periods.reduce((sum, p) => {
    const [sh, sm] = p.startTime.split(':').map(Number)
    const [eh, em] = p.endTime.split(':').map(Number)
    return sum + (eh * 60 + em - (sh * 60 + sm))
  }, 0)
})
</script>

<style scoped>
.schedule-page {
  padding: 16px 16px 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header { margin-bottom: 2px; }

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

/* Day tabs */
.day-tabs-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin: 0 -16px;
  padding: 0 16px;
}

.day-tabs {
  display: flex;
  gap: 8px;
  width: max-content;
}

.day-tab {
  width: 68px;
  height: 74px;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border: 1.5px solid #dbe3ef;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
}

.day-tab--active {
  background: linear-gradient(140deg, #2563eb 0%, #1d4ed8 100%);
  border-color: #2563eb;
  color: #fff;
  box-shadow: 0 8px 18px rgba(37,99,235,.35);
  transform: translateY(-1px);
}

.day-tab--today:not(.day-tab--active) {
  border-color: #93c5fd;
  box-shadow: 0 0 0 2px #dbeafe;
}

.day-abbr {
  min-width: 34px;
  height: 26px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 800;
  background: #eff6ff;
  color: #1d4ed8;
  letter-spacing: 0.2px;
}

.day-tab--active .day-abbr {
  background: rgba(255,255,255,0.22);
  color: #ffffff;
}

.day-full {
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
}

.today-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2563eb;
  position: absolute;
  top: 8px;
  right: 8px;
}

.day-tab--active .today-dot {
  background: #ffffff;
}

/* Selected day label */
.selected-day-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.day-name {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
}

.today-badge {
  padding: 2px 8px;
  background: #eff6ff;
  color: #2563eb;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
}

/* Periods list */
.periods-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.period-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  position: relative;
}

.period-timeline {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 16px;
  flex-shrink: 0;
  padding-top: 18px;
}

.timeline-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #cbd5e1;
  flex-shrink: 0;
  z-index: 1;
}

.timeline-dot--now {
  background: #2563eb;
  box-shadow: 0 0 0 3px rgba(37,99,235,.2);
}

.timeline-line {
  width: 2px;
  flex: 1;
  min-height: 32px;
  background: #e2e8f0;
  margin-top: 4px;
}

.period-card {
  flex: 1;
  border-radius: 14px;
  padding: 12px 14px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
  min-width: 0;
}

.period-item--now .period-card {
  box-shadow: 0 0 0 2px #2563eb;
}

.period-card-left { flex: 1; min-width: 0; }

.period-subject {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.period-code {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
}

.period-card-right {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex-shrink: 0;
}

.period-time-badge {
  font-size: 12px;
  font-weight: 700;
  color: #1e293b;
  background: rgba(255,255,255,.7);
  padding: 2px 8px;
  border-radius: 6px;
  white-space: nowrap;
}

.period-detail, .period-room {
  font-size: 11px;
  color: #475569;
  text-align: right;
}

.now-label {
  position: absolute;
  top: 12px;
  right: 14px;
  padding: 2px 8px;
  background: #2563eb;
  color: #fff;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
}

/* Break row */
.break-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px 8px 28px;
  color: #94a3b8;
  font-size: 12px;
}

.break-icon { font-size: 14px; }

/* Summary */
.period-summary {
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
  padding: 4px 0 8px;
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
}

.empty-icon { font-size: 36px; }

@media (min-width: 768px) {
  .day-tabs {
    gap: 10px;
  }

  .day-tab {
    width: 78px;
    height: 84px;
    border-radius: 20px;
  }

  .day-abbr {
    min-width: 38px;
    height: 28px;
    font-size: 14px;
  }

  .day-full {
    font-size: 12px;
  }
}
</style>
