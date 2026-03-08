import { ref } from 'vue'
import { ensureStudentSession } from './useStudentSession'

export type NotifType = 'grade' | 'attendance' | 'announcement' | 'system' | 'document'

export interface StudentNotification {
  id: string
  type: NotifType
  title: string
  body: string
  timestamp: string
  rawTimestamp: string
  read: boolean
}

export function useNotificationsData() {
  const notifications = ref<StudentNotification[]>([])

  function toTimestamp(value: string) {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '-'
    return date.toLocaleString('th-TH', { hour12: false })
  }

  if (import.meta.client) {
    ensureStudentSession().then(async (session) => {
      if (!session?.student) return
      const token = useCookie<string | null>('edu_student_token')
      if (!token.value) return
      const config = useRuntimeConfig()
      const headers = { Authorization: `Bearer ${token.value}` }

      const [annRes, gradeRes, attendanceRes] = await Promise.all([
        $fetch<{ data: Array<{ id: string; title: string | null; content: string | null; created_at: string }> }>(
          `${config.public.apiBase}/students/${session.student.id}/announcements?target_role=student&page=1&size=20`,
          { headers },
        ).catch(() => ({ data: [] })),
        $fetch<{ data: Array<{ id: string; score: number | null; updated_at: string }> }>(
          `${config.public.apiBase}/students/${session.student.id}/grade-records`,
          { headers },
        ).catch(() => ({ data: [] })),
        $fetch<{ data: Array<{ id: string; status: string; created_at: string }> }>(
          `${config.public.apiBase}/students/${session.student.id}/attendance-logs`,
          { headers },
        ).catch(() => ({ data: [] })),
      ])

      const fromAnnouncements: StudentNotification[] = (annRes.data || []).map((item) => ({
        id: `ann-${item.id}`,
        type: 'announcement',
        title: item.title?.trim() || 'ประกาศจากโรงเรียน',
        body: item.content?.trim() || '-',
        timestamp: toTimestamp(item.created_at),
        rawTimestamp: item.created_at,
        read: false,
      }))

      const fromGrades: StudentNotification[] = (gradeRes.data || [])
        .filter(item => item.score !== null)
        .slice(0, 8)
        .map(item => ({
          id: `grade-${item.id}`,
          type: 'grade',
          title: '📊 อัปเดตผลการเรียน',
          body: `มีการอัปเดตคะแนนล่าสุด (${item.score})`,
          timestamp: toTimestamp(item.updated_at),
          rawTimestamp: item.updated_at,
          read: false,
        }))

      const fromAttendance: StudentNotification[] = (attendanceRes.data || [])
        .filter(item => item.status === 'absent' || item.status === 'late')
        .slice(0, 8)
        .map(item => ({
          id: `att-${item.id}`,
          type: 'attendance',
          title: item.status === 'absent' ? '⚠️ แจ้งเตือนการขาดเรียน' : '⏰ แจ้งเตือนมาสาย',
          body: item.status === 'absent' ? 'ระบบพบประวัติการขาดเรียนล่าสุด' : 'ระบบพบประวัติการมาเรียนสายล่าสุด',
          timestamp: toTimestamp(item.created_at),
          rawTimestamp: item.created_at,
          read: false,
        }))

      notifications.value = [...fromAnnouncements, ...fromGrades, ...fromAttendance]
        .sort((a, b) => {
          const aDate = Date.parse(a.rawTimestamp)
          const bDate = Date.parse(b.rawTimestamp)
          if (Number.isNaN(aDate) || Number.isNaN(bDate)) return 0
          return bDate - aDate
        })
        .slice(0, 30)
    }).catch(() => {
      notifications.value = []
    })
  }

  function markRead(id: string) {
    const n = notifications.value.find(x => x.id === id)
    if (n) n.read = true
  }

  function markAllRead() {
    notifications.value.forEach(n => { n.read = true })
  }

  return { notifications, markRead, markAllRead }
}
