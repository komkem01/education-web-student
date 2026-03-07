<template>
  <div class="profile-page">
    <!-- ID Card style header -->
    <div class="id-card">
      <div class="id-card-top">
        <div class="id-logo-row">
          <div class="id-logo">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L3 6v8l7 4 7-4V6L10 2z" fill="#fff" fill-opacity=".9" />
            </svg>
          </div>
          <div>
            <div class="id-school">โรงเรียนตัวอย่างวิทยา</div>
            <div class="id-year">ปีการศึกษา {{ profile.academicYear }}</div>
          </div>
        </div>
        <div class="id-badge-status">{{ profile.status }}</div>
      </div>

      <div class="id-card-body">
        <div class="id-photo">
          <span class="id-photo-initial">{{ profile.firstName.charAt(0) }}</span>
        </div>
        <div class="id-info">
          <div class="id-name">{{ profile.prefixTh }}{{ profile.firstName }} {{ profile.lastName }}</div>
          <div class="id-nickname">( {{ profile.nickName }} )</div>
          <div class="id-code">{{ profile.studentId }}</div>
          <div class="id-class-row">
            <span class="id-class">{{ profile.classroom }}</span>
            <span class="id-class-num">เลขที่ {{ profile.classNumber }}</span>
          </div>
        </div>
      </div>

      <div class="id-card-bottom">
        <div class="id-advisor">ครูที่ปรึกษา: {{ profile.advisorName }}</div>
        <div class="id-enroll">ลงทะเบียน {{ profile.enrollDate }}</div>
      </div>
    </div>

    <!-- Personal info -->
    <div class="info-card">
      <div class="info-card-title">
        <span class="info-card-icon">👤</span>
        ข้อมูลส่วนตัว
      </div>
      <div class="info-grid">
        <div class="info-row">
          <span class="info-label">ชื่อ-นามสกุล</span>
          <span class="info-value">{{ profile.prefixTh }}{{ profile.firstName }} {{ profile.lastName }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">ชื่อเล่น</span>
          <span class="info-value">{{ profile.nickName }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">วันเกิด</span>
          <span class="info-value">{{ profile.dob }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">เพศ</span>
          <span class="info-value">{{ profile.gender }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">กรุ๊ปเลือด</span>
          <span class="info-value">{{ profile.bloodType }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">ศาสนา</span>
          <span class="info-value">{{ profile.religion }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">สัญชาติ</span>
          <span class="info-value">{{ profile.nationality }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">เลขบัตรประชาชน</span>
          <span class="info-value">{{ maskedIdCard }}</span>
        </div>
      </div>
    </div>

    <!-- Contact info -->
    <div class="info-card">
      <div class="info-card-title">
        <span class="info-card-icon">📞</span>
        ข้อมูลติดต่อ
      </div>
      <div class="info-grid">
        <div class="info-row">
          <span class="info-label">อีเมล</span>
          <span class="info-value info-value--sm">{{ profile.email }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">เบอร์โทรศัพท์</span>
          <span class="info-value">{{ profile.phone }}</span>
        </div>
        <div class="info-row info-row--column">
          <span class="info-label">ที่อยู่</span>
          <span class="info-value info-value--address">{{ profile.address }}</span>
        </div>
      </div>
    </div>

    <!-- Parent/Guardian info -->
    <div class="info-card">
      <div class="info-card-title">
        <span class="info-card-icon">👨‍👩‍👦</span>
        ข้อมูลผู้ปกครอง
      </div>
      <div class="info-grid">
        <div class="info-row">
          <span class="info-label">บิดา</span>
          <span class="info-value">{{ profile.fatherName }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">เบอร์บิดา</span>
          <a :href="'tel:' + profile.fatherPhone" class="info-value info-value--phone">{{ profile.fatherPhone }}</a>
        </div>
        <div class="info-row">
          <span class="info-label">มารดา</span>
          <span class="info-value">{{ profile.motherName }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">เบอร์มารดา</span>
          <a :href="'tel:' + profile.motherPhone" class="info-value info-value--phone">{{ profile.motherPhone }}</a>
        </div>
        <div class="info-row">
          <span class="info-label">ติดต่อฉุกเฉิน</span>
          <span class="info-value">{{ profile.emergencyContact }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">เบอร์ฉุกเฉิน</span>
          <a :href="'tel:' + profile.emergencyPhone" class="info-value info-value--phone">{{ profile.emergencyPhone }}</a>
        </div>
      </div>
    </div>

    <!-- Academic summary -->
    <div class="info-card">
      <div class="info-card-title">
        <span class="info-card-icon">🎓</span>
        ข้อมูลการศึกษา
      </div>
      <div class="academic-stats">
        <div class="acad-stat">
          <div class="acad-stat-val" style="color:#2563eb">{{ gpa ?? '-' }}</div>
          <div class="acad-stat-label">GPA ล่าสุด</div>
        </div>
        <div class="acad-stat">
          <div class="acad-stat-val" style="color:#16a34a">{{ totalCredits }}</div>
          <div class="acad-stat-label">หน่วยกิตสะสม</div>
        </div>
        <div class="acad-stat">
          <div class="acad-stat-val" style="color:#f59e0b">{{ attendancePercent }}%</div>
          <div class="acad-stat-label">การเข้าเรียน</div>
        </div>
      </div>
      <div class="info-grid" style="margin-top:12px">
        <div class="info-row">
          <span class="info-label">ระดับชั้น</span>
          <span class="info-value">{{ profile.grade }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">ห้องเรียน</span>
          <span class="info-value">{{ profile.classroom }} · เลขที่ {{ profile.classNumber }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">ครูที่ปรึกษา</span>
          <span class="info-value">{{ profile.advisorName }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">วันที่ลงทะเบียน</span>
          <span class="info-value">{{ profile.enrollDate }}</span>
        </div>
      </div>
    </div>

    <!-- Remark -->
    <p class="remark-text">หากข้อมูลไม่ถูกต้อง กรุณาติดต่อฝ่ายทะเบียนของโรงเรียน</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStudentProfile } from '../../composables/useStudentProfile'
import { useGradesData } from '../../composables/useGradesData'
import { useAttendanceData } from '../../composables/useAttendanceData'

const { profile } = useStudentProfile()
const { gpa, totalCredits } = useGradesData()
const { attendancePercent } = useAttendanceData()

const maskedIdCard = computed(() => {
  const v = profile.value.idCard.replace(/-/g, '')
  return v.slice(0, 1) + '-XXXX-XXXXX-XX-' + v.slice(-1)
})
</script>

<style scoped>
.profile-page {
  padding: 16px 16px 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ID Card */
.id-card {
  background: linear-gradient(135deg, #1e40af 0%, #2563eb 60%, #3b82f6 100%);
  border-radius: 18px;
  padding: 18px 18px 14px;
  color: #fff;
  box-shadow: 0 6px 24px rgba(37,99,235,.3);
}

.id-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}

.id-logo-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.id-logo {
  width: 28px;
  height: 28px;
  background: rgba(255,255,255,.2);
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.id-school {
  font-size: 12px;
  font-weight: 700;
  line-height: 1.3;
}

.id-year {
  font-size: 10px;
  opacity: 0.75;
}

.id-badge-status {
  padding: 3px 10px;
  background: rgba(255,255,255,.2);
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}

.id-card-body {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 14px;
}

.id-photo {
  width: 64px;
  height: 64px;
  border-radius: 14px;
  background: rgba(255,255,255,.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px solid rgba(255,255,255,.3);
}

.id-photo-initial {
  font-size: 28px;
  font-weight: 800;
  color: #fff;
}

.id-name {
  font-size: 15px;
  font-weight: 800;
  margin-bottom: 2px;
}

.id-nickname {
  font-size: 12px;
  opacity: 0.75;
  margin-bottom: 4px;
}

.id-code {
  font-size: 12px;
  font-weight: 600;
  font-family: 'Courier New', monospace;
  background: rgba(255,255,255,.15);
  padding: 2px 8px;
  border-radius: 6px;
  display: inline-block;
  margin-bottom: 6px;
}

.id-class-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.id-class {
  font-size: 13px;
  font-weight: 700;
}

.id-class-num {
  font-size: 12px;
  opacity: 0.75;
}

.id-card-bottom {
  border-top: 1px solid rgba(255,255,255,.2);
  padding-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.id-advisor,
.id-enroll {
  font-size: 11px;
  opacity: 0.8;
}

/* Info cards */
.info-card {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 1px 6px rgba(0,0,0,.06);
}

.info-card-title {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-card-icon { font-size: 18px; }

.info-grid { display: flex; flex-direction: column; gap: 10px; }

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.info-row--column {
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.info-label {
  font-size: 12px;
  color: #64748b;
  flex-shrink: 0;
  min-width: 110px;
}

.info-value {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  text-align: right;
}

.info-value--sm { font-size: 12px; }

.info-value--address {
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  text-align: left;
  line-height: 1.5;
}

.info-value--phone {
  color: #2563eb;
  font-weight: 600;
  font-size: 13px;
  text-align: right;
}

/* Academic stats */
.academic-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  background: #f8fafc;
  border-radius: 12px;
  padding: 14px 10px;
}

.acad-stat {
  text-align: center;
}

.acad-stat-val {
  font-size: 22px;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 4px;
}

.acad-stat-label {
  font-size: 11px;
  color: #64748b;
}

/* Remark */
.remark-text {
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
  padding: 4px 0 12px;
}

@media (min-width: 768px) {
  .profile-page {
    padding: 24px;
    gap: 18px;
  }

  .id-card {
    padding: 22px 22px 16px;
  }

  .id-card-body {
    gap: 20px;
  }

  .id-photo {
    width: 72px;
    height: 72px;
  }

  .id-name {
    font-size: 18px;
  }

  .id-card-bottom {
    flex-wrap: wrap;
    gap: 6px 14px;
  }

  .info-card {
    padding: 18px;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px 22px;
  }

  .info-row,
  .info-row--column {
    align-items: flex-start;
    flex-direction: column;
    gap: 3px;
  }

  .info-row--column {
    grid-column: 1 / -1;
  }

  .info-value,
  .info-value--phone {
    text-align: left;
  }

  .academic-stats {
    gap: 14px;
    padding: 16px 14px;
  }
}
</style>
