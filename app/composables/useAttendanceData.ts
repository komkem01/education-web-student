import { ref, computed } from 'vue'

export type AttendanceStatus = 'มา' | 'ขาด' | 'สาย' | 'ลา' | 'ป่วย'

export interface AttendanceRecord {
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
  const records = ref<AttendanceRecord[]>([
    ...buildMonth(2025, 5), // May 2568
    ...buildMonth(2025, 6), // Jun
    ...buildMonth(2025, 7), // Jul
    ...buildMonth(2025, 8), // Aug
    ...buildMonth(2025, 9), // Sep
  ])

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
