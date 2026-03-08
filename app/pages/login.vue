<template>
  <div class="login-page">
    <div class="login-bg">
      <div class="bg-circle bg-circle--1" />
      <div class="bg-circle bg-circle--2" />
      <div class="bg-circle bg-circle--3" />
    </div>

    <div class="login-content">
      <!-- Logo -->
      <div class="logo-section">
        <div class="logo-icon">
          <svg width="36" height="36" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L3 6v8l7 4 7-4V6L10 2z" fill="#fff" fill-opacity=".95" />
          </svg>
        </div>
        <h1 class="logo-title">EduFlow</h1>
        <p class="logo-sub">ระบบสารสนเทศโรงเรียน</p>
      </div>

      <!-- Card -->
      <div class="login-card">
        <div class="card-header">
          <div class="role-badge">🎓 สำหรับนักเรียน</div>
          <h2 class="card-title">เข้าสู่ระบบ</h2>
          <p class="card-desc">กรอกรหัสนักเรียนและรหัสผ่านเพื่อเข้าใช้งาน</p>
        </div>

        <form class="login-form" @submit.prevent="handleLogin">
          <div class="field">
            <label class="field-label">รหัสนักเรียน</label>
            <div class="input-wrap">
              <span class="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="#94a3b8" stroke-width="1.8"/>
                  <path d="M4 20c0-4 4-7 8-7s8 3 8 7" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
              </span>
              <input
                v-model="form.studentId"
                type="text"
                class="input"
                placeholder="เช่น STD68-0001"
                autocomplete="username"
                inputmode="text"
              />
            </div>
          </div>

          <div class="field">
            <label class="field-label">รหัสผ่าน</label>
            <div class="input-wrap">
              <span class="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="#94a3b8" stroke-width="1.8"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
              </span>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="input"
                placeholder="รหัสผ่าน"
                autocomplete="current-password"
              />
              <button type="button" class="toggle-pw" @click="showPassword = !showPassword">
                <svg v-if="showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3l18 18M10.5 10.677A2 2 0 0 0 12 14a2 2 0 0 0 1.5-.677M6.362 6.363A9.31 9.31 0 0 0 3 12c1.667 4 5 7 9 7a9.13 9.13 0 0 0 5.638-1.863M9.73 4.327A9.3 9.3 0 0 1 12 4c4 0 7.333 3 9 7a9.36 9.36 0 0 1-1.362 2.273" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#94a3b8" stroke-width="1.8"/>
                  <circle cx="12" cy="12" r="3" stroke="#94a3b8" stroke-width="1.8"/>
                </svg>
              </button>
            </div>
          </div>

          <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>

          <button type="submit" class="btn-login" :disabled="loading">
            <span v-if="loading" class="loader" />
            <span v-else>เข้าสู่ระบบ</span>
          </button>
        </form>

        <p class="hint-text">ลืมรหัสผ่าน? ติดต่อฝ่ายทะเบียนของโรงเรียน</p>
      </div>

      <p class="footer-text">EduFlow © 2568 · โรงเรียนตัวอย่างวิทยา</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({ layout: 'default' })

const router = useRouter()
const authToken = useCookie<string | null>('edu_student_token')
const activeRole = useCookie<string | null>('edu_active_role')
const showPassword = ref(false)
const loading = ref(false)
const errorMsg = ref('')

const form = reactive({ studentId: '', password: '' })

if (authToken.value && activeRole.value === 'student') {
  await router.push('/home')
}

async function handleLogin() {
  errorMsg.value = ''
  if (!form.studentId.trim() || !form.password.trim()) {
    errorMsg.value = 'กรุณากรอกรหัสนักเรียนและรหัสผ่าน'
    return
  }
  loading.value = true
  await new Promise(r => setTimeout(r, 900))
  loading.value = false
  // mock: any credential -> success
  authToken.value = 'demo-student-token'
  activeRole.value = 'student'
  router.push('/home')
}
</script>

<style scoped>
.login-page {
  min-height: 100dvh;
  background: linear-gradient(160deg, #1e40af 0%, #2563eb 45%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 24px 16px;
}

.login-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,0.06);
}

.bg-circle--1 {
  width: 300px;
  height: 300px;
  top: -80px;
  right: -80px;
}

.bg-circle--2 {
  width: 200px;
  height: 200px;
  bottom: 40px;
  left: -60px;
}

.bg-circle--3 {
  width: 120px;
  height: 120px;
  top: 40%;
  right: 20px;
  background: rgba(255,255,255,0.04);
}

.login-content {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  position: relative;
  z-index: 1;
}

.logo-section {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  width: 64px;
  height: 64px;
  background: rgba(255,255,255,0.2);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
}

.logo-title {
  font-size: 28px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.5px;
}

.logo-sub {
  font-size: 13px;
  color: rgba(255,255,255,0.75);
}

.login-card {
  width: 100%;
  background: #fff;
  border-radius: 20px;
  padding: 28px 24px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}

.card-header {
  margin-bottom: 24px;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: #eff6ff;
  color: #2563eb;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 10px;
}

.card-title {
  font-size: 22px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 4px;
}

.card-desc {
  font-size: 13px;
  color: #64748b;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  display: flex;
  align-items: center;
  pointer-events: none;
}

.input {
  width: 100%;
  height: 48px;
  padding: 0 44px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 15px;
  font-family: inherit;
  color: #1e293b;
  background: #f8fafc;
  transition: border 0.2s, box-shadow 0.2s;
  outline: none;
}

.input:focus {
  border-color: #2563eb;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(37,99,235,.1);
}

.toggle-pw {
  position: absolute;
  right: 12px;
  display: flex;
  align-items: center;
  padding: 4px;
  color: #94a3b8;
}

.error-msg {
  padding: 10px 14px;
  background: #fff5f5;
  border: 1px solid #fecaca;
  border-radius: 8px;
  font-size: 13px;
  color: #dc2626;
}

.btn-login {
  height: 50px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #fff;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: opacity 0.2s, transform 0.1s;
  margin-top: 4px;
  box-shadow: 0 4px 16px rgba(37,99,235,.35);
}

.btn-login:active {
  transform: scale(0.98);
}

.btn-login:disabled {
  opacity: 0.7;
}

.loader {
  width: 20px;
  height: 20px;
  border: 2.5px solid rgba(255,255,255,0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.hint-text {
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
  margin-top: 16px;
}

.footer-text {
  font-size: 12px;
  color: rgba(255,255,255,0.55);
}
</style>
