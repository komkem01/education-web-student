<template>
  <div class="attendance-page">
    <!-- Header -->
    <div class="page-header">
      <h2 class="page-title">การเข้าเรียน</h2>
      <p class="page-sub">{{ profile.grade }} · {{ termLabel }}</p>
    </div>

    <div v-if="isLoading" class="empty-state">
      <span>⏳</span>
      <p>กำลังโหลดข้อมูลการเข้าเรียน...</p>
    </div>

    <div v-else-if="accessDenied" class="empty-state empty-state--warn">
      <span>🔒</span>
      <p>{{ errorMessage || 'ไม่มีสิทธิ์เข้าถึงข้อมูลการเข้าเรียน' }}</p>
    </div>

    <template v-else>

    <!-- Summary cards -->
    <div class="summary-row">
      <div class="summary-card summary-card--main">
        <div class="donut-wrap">
          <svg class="donut" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="30" fill="none" stroke="#e2e8f0" stroke-width="8" />
            <circle
              cx="40" cy="40" r="30" fill="none"
              stroke="#2563eb" stroke-width="8"
              stroke-linecap="round"
              :stroke-dasharray="`${attendancePercent * 1.885} 188.5`"
              stroke-dashoffset="47.1"
              transform="rotate(-90 40 40)"
            />
          </svg>
          <div class="donut-label">
            <div class="donut-percent">{{ attendancePercent }}%</div>
            <div class="donut-sub">เข้าเรียน</div>
          </div>
        </div>
        <div class="summary-legend">
          <div class="legend-row"><span class="legend-dot" style="background:#16a34a" />มาเรียน <strong>{{ presentDays }}</strong> วัน</div>
          <div class="legend-row"><span class="legend-dot" style="background:#f59e0b" />มาสาย <strong>{{ lateDays }}</strong> วัน</div>
          <div class="legend-row"><span class="legend-dot" style="background:#dc2626" />ขาด <strong>{{ absentDays }}</strong> วัน</div>
          <div class="legend-row"><span class="legend-dot" style="background:#2563eb" />ลา/ป่วย <strong>{{ leaveDays }}</strong> วัน</div>
        </div>
      </div>
    </div>

    <!-- Alert: low attendance -->
    <div v-if="attendancePercent < 80" class="alert-card alert-card--warn">
      <span class="alert-icon">⚠️</span>
      <div>
        <div class="alert-title">การเข้าเรียนต่ำกว่าเกณฑ์</div>
        <div class="alert-body">การเข้าเรียนของคุณต่ำกว่า 80% อาจส่งผลต่อผลการเรียน กรุณาติดต่อครูที่ปรึกษา</div>
      </div>
    </div>

    <div v-else-if="attendancePercent >= 95" class="alert-card alert-card--success">
      <span class="alert-icon">✅</span>
      <div>
        <div class="alert-title">การเข้าเรียนดีเยี่ยม</div>
        <div class="alert-body">คุณมีสถิติการเข้าเรียนสม่ำเสมอ ขอแสดงความยินดี!</div>
      </div>
    </div>

    <!-- Records list -->
    <section class="section">
      <div class="section-header">
        <h3 class="section-title">ประวัติการเข้าเรียน</h3>
        <div class="filter-tabs">
          <button
            v-for="f in filterOptions"
            :key="f.value"
            class="filter-tab"
            :class="{ 'filter-tab--active': activeFilter === f.value }"
            @click="activeFilter = f.value"
          >
            {{ f.label }}
          </button>
        </div>
      </div>

      <div class="records-list">
        <div
          v-for="rec in filteredRecords"
          :key="rec.date"
          class="record-row"
        >
          <div class="record-date">
            <div class="record-day-num">{{ rec.date.split('/')[0] }}</div>
            <div class="record-month">{{ monthAbbr(rec.date) }}</div>
          </div>
          <div class="record-day-name">{{ rec.dayTh }}</div>
          <div
            class="record-status-badge"
            :style="{ background: statusBg(rec.status), color: statusColor(rec.status) }"
          >
            {{ rec.status }}
          </div>
          <div v-if="rec.note" class="record-note">{{ rec.note }}</div>
        </div>

        <div v-if="filteredRecords.length === 0" class="empty-state">
          <span>📋</span>
          <p>ไม่มีข้อมูล</p>
        </div>
      </div>
    </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStudentProfile } from '../../composables/useStudentProfile'
import { useAttendanceData } from '../../composables/useAttendanceData'
import { useStudentHeaderInfo } from '../../composables/useStudentHeaderInfo'

const { profile } = useStudentProfile()
const { termLabel } = useStudentHeaderInfo()
const { records, presentDays, lateDays, absentDays, leaveDays, attendancePercent, statusColor, statusBg, isLoading, accessDenied, errorMessage } = useAttendanceData()

const activeFilter = ref('all')

const filterOptions = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'ขาด', label: 'ขาด' },
  { value: 'สาย', label: 'สาย' },
  { value: 'ลา', label: 'ลา/ป่วย' },
]

const filteredRecords = computed(() => {
  if (activeFilter.value === 'all') return [...records.value].reverse()
  if (activeFilter.value === 'ลา') return records.value.filter(r => r.status === 'ลา' || r.status === 'ป่วย').reverse()
  return records.value.filter(r => r.status === activeFilter.value).reverse()
})

const MONTHS_TH = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
function monthAbbr(dateStr: string): string {
  const monthNum = parseInt(dateStr.split('/')[1]) - 1
  return MONTHS_TH[monthNum] ?? ''
}
</script>

<style scoped>
.attendance-page {
  padding: 16px 16px 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty-state--warn {
  border: 1px solid #fed7aa;
  color: #9a3412;
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

/* Summary */
.summary-row { display: flex; flex-direction: column; }

.summary-card {
  background: #fff;
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,.07);
}

.summary-card--main {
  display: flex;
  align-items: center;
  gap: 20px;
}

.donut-wrap {
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}

.donut {
  width: 80px;
  height: 80px;
}

.donut-label {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.donut-percent {
  font-size: 16px;
  font-weight: 900;
  color: #2563eb;
  line-height: 1;
}

.donut-sub {
  font-size: 9px;
  color: #64748b;
  margin-top: 2px;
}

.summary-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #475569;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-row strong {
  margin-left: auto;
  color: #1e293b;
  font-weight: 700;
}

/* Alert */
.alert-card {
  border-radius: 14px;
  padding: 14px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.alert-card--warn { background: #fff8e6; border: 1px solid #fde68a; }
.alert-card--success { background: #f0fdf4; border: 1px solid #bbf7d0; }

.alert-icon { font-size: 20px; flex-shrink: 0; }

.alert-title {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 3px;
}

.alert-body {
  font-size: 12px;
  color: #475569;
  line-height: 1.5;
}

/* Section */
.section { display: flex; flex-direction: column; }

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 8px;
}

.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
}

.filter-tabs {
  display: flex;
  gap: 6px;
}

.filter-tab {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  background: #f1f5f9;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tab--active {
  background: #2563eb;
  color: #fff;
}

/* Records */
.records-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.record-row {
  background: #fff;
  border-radius: 12px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,.04);
}

.record-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 30px;
}

.record-day-num {
  font-size: 16px;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
}

.record-month {
  font-size: 10px;
  color: #94a3b8;
  line-height: 1;
}

.record-day-name {
  font-size: 13px;
  color: #475569;
  flex: 1;
}

.record-status-badge {
  padding: 3px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.record-note {
  font-size: 11px;
  color: #94a3b8;
}

/* Empty */
.empty-state {
  text-align: center;
  padding: 28px 16px;
  color: #94a3b8;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: #fff;
  border-radius: 12px;
}
</style>
