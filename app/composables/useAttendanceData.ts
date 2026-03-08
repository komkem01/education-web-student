import { ref, computed } from 'vue'
import { ensureStudentSession } from './useStudentSession'

export type AttendanceStatus = 'มา' | 'ขาด' | 'สาย' | 'ลา' | 'ป่วย'

export interface AttendanceRecord {
  id?: string
  date: string
  dayTh: string
  status: AttendanceStatus
  period?: string
  note?: string
}

function buildMonth(year: number, month: number): AttendanceRecord[] {
  const days: AttendanceRecord[] = []
  const dayNames = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์']
  const daysInMonth = new Date(year, month, 0).getDate()
  const statuses: AttendanceStatus[] = ['มา', 'มา', 'มา', 'มา', 'มา', 'มา', 'มา', 'มา', 'มา', 'มา', 'สาย', 'มา', 'มา', 'ลา', 'มา']
  let si = 0
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month - 1, d)
    const dow = dateObj.getDay()
    if (dow === 0 || dow === 6) continue // skip weekends
    const status = statuses[si % statuses.length]
    si++
    days.push({
      date: `${d.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year + 543}`,
      dayTh: dayNames[dow],
      status,
    })
  }
  return days
}

export function useAttendanceData() {
  const records = ref<AttendanceRecord[]>([])

  const dayNames = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์']

  function toThaiDate(value: Date) {
    const d = String(value.getDate()).padStart(2, '0')
    const m = String(value.getMonth() + 1).padStart(2, '0')
    const y = String(value.getFullYear() + 543)
    return `${d}/${m}/${y}`
  }

  function toThaiStatus(status: string): AttendanceStatus {
    if (status === 'absent') return 'ขาด'
    if (status === 'late') return 'สาย'
    if (status === 'sick') return 'ป่วย'
    if (status === 'business') return 'ลา'
    return 'มา'
  }

  if (import.meta.client) {
    ensureStudentSession().then(async (session) => {
      if (!session?.student) return
      const token = useCookie<string | null>('edu_student_token')
      if (!token.value) return
      const config = useRuntimeConfig()

      const res = await $fetch<{ data: Array<{ id: string; check_date: string | null; created_at: string; status: string; note: string | null }> }>(
        `${config.public.apiBase}/students/${session.student.id}/attendance-logs`,
        { headers: { Authorization: `Bearer ${token.value}` } },
      )

      records.value = (res.data || []).map((item) => {
        const baseDate = item.check_date ? new Date(item.check_date) : new Date(item.created_at)
        return {
          id: item.id,
          date: toThaiDate(baseDate),
          dayTh: dayNames[baseDate.getDay()] || '-',
          status: toThaiStatus(item.status),
          note: item.note || undefined,
        }
      })
    }).catch(() => {
      records.value = [
        ...buildMonth(2025, 5),
        ...buildMonth(2025, 6),
      ]
    })
  }

  const totalDays = computed(() => records.value.length)
  const presentDays = computed(() => records.value.filter(r => r.status === 'มา').length)
  const lateDays = computed(() => records.value.filter(r => r.status === 'สาย').length)
  const absentDays = computed(() => records.value.filter(r => r.status === 'ขาด').length)
  const leaveDays = computed(() => records.value.filter(r => r.status === 'ลา' || r.status === 'ป่วย').length)
  const attendancePercent = computed(() =>
    totalDays.value > 0 ? Math.round(((presentDays.value + lateDays.value) / totalDays.value) * 100) : 0
  )

  function statusColor(s: AttendanceStatus): string {
    if (s === 'มา') return '#16a34a'
    if (s === 'สาย') return '#f59e0b'
    if (s === 'ขาด') return '#dc2626'
    if (s === 'ลา') return '#2563eb'
    if (s === 'ป่วย') return '#8b5cf6'
    return '#94a3b8'
  }

  function statusBg(s: AttendanceStatus): string {
    if (s === 'มา') return '#dcfce7'
    if (s === 'สาย') return '#fef9c3'
    if (s === 'ขาด') return '#fee2e2'
    if (s === 'ลา') return '#dbeafe'
    if (s === 'ป่วย') return '#f3e8ff'
    return '#f1f5f9'
  }

  return { records, totalDays, presentDays, lateDays, absentDays, leaveDays, attendancePercent, statusColor, statusBg }
}
