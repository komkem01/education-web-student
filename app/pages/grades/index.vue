<template>
  <div class="grades-page">
    <!-- Header -->
    <div class="page-header">
      <h2 class="page-title">ผลการเรียน</h2>
      <p class="page-sub">{{ profile.grade }} · {{ profile.classroom }}</p>
    </div>

    <!-- Semester selector -->
    <div class="semester-select-wrap">
      <select v-model="selectedSemesterId" class="semester-select">
        <option v-for="s in semesters" :key="s.id" :value="s.id">{{ s.label }}</option>
      </select>
    </div>

    <!-- GPA summary card -->
    <div class="gpa-card">
      <div class="gpa-main">
        <div class="gpa-value">{{ gpa ?? '-' }}</div>
        <div class="gpa-label">เกรดเฉลี่ย (GPA)</div>
      </div>
      <div class="gpa-divider" />
      <div class="gpa-stats">
        <div class="gpa-stat">
          <div class="gpa-stat-val">{{ totalCredits }}</div>
          <div class="gpa-stat-lbl">หน่วยกิต</div>
        </div>
        <div class="gpa-stat">
          <div class="gpa-stat-val">{{ currentGrades.length }}</div>
          <div class="gpa-stat-lbl">รายวิชา</div>
        </div>
        <div class="gpa-stat">
          <div class="gpa-stat-val">{{ completedGrades.length }}</div>
          <div class="gpa-stat-lbl">ออกผลแล้ว</div>
        </div>
      </div>
    </div>

    <!-- Grade scale legend -->
    <div class="scale-card">
      <div class="scale-title">เกณฑ์การให้เกรด</div>
      <div class="scale-row">
        <span v-for="s in scaleItems" :key="s.grade" class="scale-item">
          <span class="scale-chip" :style="{ background: s.bg, color: s.color }">{{ s.grade }}</span>
          <span class="scale-desc">{{ s.label }}</span>
        </span>
      </div>
    </div>

    <!-- Subject grades -->
    <div class="subjects-section">
      <h3 class="section-title">รายละเอียดรายวิชา</h3>
      <div class="subject-list">
        <div
          v-for="g in currentGrades"
          :key="g.id"
          class="subject-card"
          @click="selectedSubject = selectedSubject?.id === g.id ? null : g"
        >
          <div class="subject-card-main">
            <div class="subject-card-left">
              <div class="subject-name">{{ g.subjectName }}</div>
              <div class="subject-meta">{{ g.subjectCode }} · {{ g.credits }} หน่วยกิต · {{ g.teacher }}</div>
            </div>
            <div class="subject-card-right">
              <div
                class="grade-badge"
                :style="{ background: gradeColor(g.grade) + '22', color: gradeColor(g.grade) }"
              >
                {{ g.grade }}
              </div>
              <div :class="statusClass(g.status)">{{ g.status }}</div>
            </div>
          </div>

          <!-- Expanded details -->
          <Transition name="expand">
            <div v-if="selectedSubject?.id === g.id && g.total !== null" class="subject-expand">
              <div class="score-grid">
                <div class="score-item">
                  <div class="score-label">กลางภาค</div>
                  <div class="score-val">{{ g.midterm ?? '-' }}/30</div>
                </div>
                <div class="score-item">
                  <div class="score-label">ปลายภาค</div>
                  <div class="score-val">{{ g.final ?? '-' }}/40</div>
                </div>
                <div class="score-item">
                  <div class="score-label">เวลาเรียน</div>
                  <div class="score-val">{{ g.attendance ?? '-' }}/20</div>
                </div>
                <div class="score-item">
                  <div class="score-label">จิตพิสัย</div>
                  <div class="score-val">{{ g.behavior ?? '-' }}/10</div>
                </div>
              </div>
              <div class="total-row">
                <span class="total-label">รวม</span>
                <span class="total-val">{{ g.total }}/100 คะแนน</span>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <!-- Status explanation -->
    <div class="status-note">
      <div class="status-note-title">หมายเหตุ</div>
      <div class="status-row-note"><span class="note-chip note--r">ร</span> ผลการเรียนไม่สมบูรณ์ รอส่งงาน/แก้ไข</div>
      <div class="status-row-note"><span class="note-chip note--ms">มส</span> มีเวลาเรียนไม่เพียงพอ (ต่ำกว่า 80%)</div>
      <div class="status-row-note"><span class="note-chip note--mp">มผ</span> ไม่ผ่านเกณฑ์การประเมิน</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { SubjectGrade } from '../../composables/useGradesData'
import { useGradesData } from '../../composables/useGradesData'
import { useStudentProfile } from '../../composables/useStudentProfile'

const { profile } = useStudentProfile()
const { selectedSemesterId, semesters, currentGrades, completedGrades, gpa, totalCredits, gradeColor } = useGradesData()

const selectedSubject = ref<SubjectGrade | null>(null)

const scaleItems = [
  { grade: '4', bg: '#dcfce7', color: '#16a34a', label: 'ดีเยี่ยม' },
  { grade: '3.5', bg: '#d1fae5', color: '#059669', label: 'ดีมาก' },
  { grade: '3', bg: '#dbeafe', color: '#2563eb', label: 'ดี' },
  { grade: '2.5', bg: '#ede9fe', color: '#7c3aed', label: 'ดีพอใช้' },
  { grade: '2', bg: '#fef9c3', color: '#ca8a04', label: 'พอใช้' },
  { grade: '1.5', bg: '#ffedd5', color: '#ea580c', label: 'อ่อน' },
  { grade: '1', bg: '#fee2e2', color: '#dc2626', label: 'อ่อนมาก' },
  { grade: '0', bg: '#fef2f2', color: '#b91c1c', label: 'ตก' },
]

function statusClass(status: string): string {
  if (status === 'ผ่าน') return 'grade-status grade-status--pass'
  if (status === 'ไม่ผ่าน') return 'grade-status grade-status--fail'
  if (status === 'รอผล') return 'grade-status grade-status--pending'
  return 'grade-status grade-status--special'
}
</script>

<style scoped>
.grades-page {
  padding: 16px 16px 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
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

/* Semester select */
.semester-select-wrap {
  position: relative;
}

.semester-select {
  width: 100%;
  height: 46px;
  padding: 0 16px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  font-weight: 600;
  color: #1e293b;
  background: #fff;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  cursor: pointer;
  outline: none;
}

.semester-select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37,99,235,.1);
}

/* GPA card */
.gpa-card {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  border-radius: 18px;
  padding: 20px 18px;
  display: flex;
  align-items: center;
  gap: 16px;
  color: #fff;
  box-shadow: 0 6px 24px rgba(37,99,235,.3);
}

.gpa-main { text-align: center; min-width: 70px; }

.gpa-value {
  font-size: 42px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -1px;
}

.gpa-label {
  font-size: 11px;
  opacity: 0.8;
  margin-top: 4px;
}

.gpa-divider {
  width: 1px;
  height: 60px;
  background: rgba(255,255,255,.25);
}

.gpa-stats {
  flex: 1;
  display: flex;
  justify-content: space-around;
}

.gpa-stat { text-align: center; }

.gpa-stat-val {
  font-size: 22px;
  font-weight: 800;
  line-height: 1;
}

.gpa-stat-lbl {
  font-size: 11px;
  opacity: 0.75;
  margin-top: 4px;
}

/* Scale */
.scale-card {
  background: #fff;
  border-radius: 14px;
  padding: 14px;
  box-shadow: 0 1px 6px rgba(0,0,0,.05);
}

.scale-title {
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.scale-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.scale-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.scale-chip {
  min-width: 32px;
  height: 22px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  padding: 0 4px;
}

.scale-desc {
  font-size: 10px;
  color: #94a3b8;
}

/* Subjects section */
.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 10px;
}

.subject-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.subject-card {
  background: #fff;
  border-radius: 14px;
  padding: 14px;
  box-shadow: 0 1px 6px rgba(0,0,0,.05);
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.subject-card:active { box-shadow: 0 2px 10px rgba(0,0,0,.1); }

.subject-card-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.subject-card-left { flex: 1; min-width: 0; }

.subject-name {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 3px;
}

.subject-meta {
  font-size: 11px;
  color: #64748b;
}

.subject-card-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
}

.grade-badge {
  min-width: 40px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 900;
}

.grade-status {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 6px;
}

.grade-status--pass { background: #dcfce7; color: #16a34a; }
.grade-status--fail { background: #fee2e2; color: #dc2626; }
.grade-status--pending { background: #f1f5f9; color: #64748b; }
.grade-status--special { background: #fef9c3; color: #b45309; }

/* Expand */
.subject-expand {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #e2e8f0;
}

.score-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 10px;
}

.score-item {
  background: #f8fafc;
  border-radius: 10px;
  padding: 8px 6px;
  text-align: center;
}

.score-label {
  font-size: 10px;
  color: #94a3b8;
  margin-bottom: 4px;
}

.score-val {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
}

.total-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #eff6ff;
  border-radius: 10px;
}

.total-label {
  font-size: 13px;
  font-weight: 600;
  color: #1d4ed8;
}

.total-val {
  font-size: 14px;
  font-weight: 800;
  color: #1d4ed8;
}

/* Expand transition */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 200px;
}

/* Status note */
.status-note {
  background: #fff;
  border-radius: 14px;
  padding: 14px;
  box-shadow: 0 1px 6px rgba(0,0,0,.05);
}

.status-note-title {
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-row-note {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #475569;
  margin-bottom: 6px;
}

.note-chip {
  min-width: 28px;
  height: 20px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  padding: 0 4px;
}

.note--r { background: #fef9c3; color: #b45309; }
.note--ms { background: #fee2e2; color: #dc2626; }
.note--mp { background: #fce7f3; color: #be185d; }
</style>
