import { ref } from 'vue'
import { ensureStudentSession } from './useStudentSession'

export interface SchedulePeriod {
  period: number
  startTime: string
  endTime: string
  subject: string
  subjectCode: string
  teacher: string
  room: string
  color: string
}

export interface DaySchedule {
  day: string
  dayTh: string
  periods: SchedulePeriod[]
}

type BaseResponse<T> = { data: T }

type EnrollmentItem = {
  id: string
  subject_assignment_id: string
  status: string
}

type SubjectAssignmentItem = {
  id: string
  subject_id: string
  teacher_id: string
  classroom_id: string
  academic_year_id: string
  semester_no: number
  is_active: boolean
}

type ScheduleItem = {
  id: string
  subject_assignment_id: string
  day_of_week: string
  period_no: number | null
  start_time: string | null
  end_time: string | null
  is_active: boolean
}

type SubjectItem = {
  id: string
  subject_code: string | null
  name: string
}

type TeacherItem = {
  id: string
  first_name: string | null
  last_name: string | null
  teacher_code: string | null
}

type ClassroomItem = {
  id: string
  name: string
  grade_level: string | null
  room_no: string | null
}

type FetchResult<T> = {
  data: T | null
  denied: boolean
}

const COLOR_MAP: Record<string, string> = {
  คณิตศาสตร์: '#dbeafe',
  วิทยาศาสตร์: '#dcfce7',
  ภาษาไทย: '#fef9c3',
  ภาษาอังกฤษ: '#ffe4e6',
  สังคมศึกษา: '#fce7f3',
  ประวัติศาสตร์: '#fce7f3',
  พลศึกษา: '#d1fae5',
  ศิลปะ: '#f3e8ff',
  ดนตรี: '#f3e8ff',
  การงานอาชีพ: '#fed7aa',
  คอมพิวเตอร์: '#e0e7ff',
  แนะแนว: '#f1f5f9',
  กิจกรรมชุมนุม: '#f1f5f9',
}

function colorFor(subject: string): string {
  for (const key of Object.keys(COLOR_MAP)) {
    if (subject.includes(key)) return COLOR_MAP[key]
  }
  return '#f1f5f9'
}

const DAY_ORDER: Array<{ key: string; th: string; api: string }> = [
  { key: 'Mon', th: 'จันทร์', api: 'monday' },
  { key: 'Tue', th: 'อังคาร', api: 'tuesday' },
  { key: 'Wed', th: 'พุธ', api: 'wednesday' },
  { key: 'Thu', th: 'พฤหัสบดี', api: 'thursday' },
  { key: 'Fri', th: 'ศุกร์', api: 'friday' },
]

function defaultWeek(): DaySchedule[] {
  return DAY_ORDER.map(day => ({ day: day.key, dayTh: day.th, periods: [] }))
}

function toHM(raw: string | null | undefined): string {
  if (!raw) return '--:--'
  return raw.slice(0, 5)
}

function mapApiDayToKey(value: string): string | null {
  const found = DAY_ORDER.find(day => day.api === value)
  return found ? found.key : null
}

async function safeFetch<T>(url: string, headers: Record<string, string>): Promise<FetchResult<T>> {
  try {
    const data = await $fetch<T>(url, { headers })
    return { data, denied: false }
  }
  catch (err: any) {
    const code = Number(err?.statusCode || err?.status || 0)
    return { data: null, denied: code === 401 || code === 403 }
  }
}

export function useScheduleData() {
  const schedule = ref<DaySchedule[]>(defaultWeek())
  const isLoading = ref(import.meta.client)
  const accessDenied = ref(false)
  const errorMessage = ref('')

  if (import.meta.client) {
    ensureStudentSession().then(async (session) => {
      if (!session?.student) {
        schedule.value = defaultWeek()
        isLoading.value = false
        return
      }

      const token = useCookie<string | null>('edu_student_token')
      if (!token.value) {
        schedule.value = defaultWeek()
        isLoading.value = false
        accessDenied.value = true
        errorMessage.value = 'ไม่มีสิทธิ์เข้าถึงข้อมูลตารางเรียน'
        return
      }

      const config = useRuntimeConfig()
      const headers = { Authorization: `Bearer ${token.value}` }
      let deniedDetected = false

      const enrollmentsRes = await safeFetch<BaseResponse<EnrollmentItem[]>>(
        `${config.public.apiBase}/students/${session.student.id}/enrollments`,
        headers,
      )
      deniedDetected = deniedDetected || enrollmentsRes.denied
      const usableEnrollments = (enrollmentsRes.data?.data || []).filter(item => item.status !== 'dropped')
      let assignmentIDs = Array.from(new Set(usableEnrollments.map(item => item.subject_assignment_id).filter(Boolean)))

      // Fallback for schools that assign schedules by classroom before creating student enrollments.
      if (assignmentIDs.length === 0 && session.student.current_classroom_id) {
        const byClassroomRes = await safeFetch<BaseResponse<SubjectAssignmentItem[]>>(
          `${config.public.apiBase}/students-meta/subject-assignments?classroom_id=${session.student.current_classroom_id}&only_active=true`,
          headers,
        )
        deniedDetected = deniedDetected || byClassroomRes.denied
        assignmentIDs = Array.from(new Set((byClassroomRes.data?.data || []).map(item => item.id).filter(Boolean)))
      }

      if (assignmentIDs.length === 0) {
        schedule.value = defaultWeek()
        isLoading.value = false
        if (deniedDetected) {
          accessDenied.value = true
          errorMessage.value = 'ไม่มีสิทธิ์เข้าถึงข้อมูลตารางเรียน'
        }
        return
      }

      const assignmentResponses = await Promise.all(
        assignmentIDs.map(id =>
          safeFetch<BaseResponse<SubjectAssignmentItem>>(`${config.public.apiBase}/students-meta/subject-assignments/${id}`, headers),
        ),
      )

      const assignmentByID = new Map<string, SubjectAssignmentItem>()
      for (const item of assignmentResponses) {
        deniedDetected = deniedDetected || item.denied
        if (item.data?.data?.id && item.data.data.is_active) assignmentByID.set(item.data.data.id, item.data.data)
      }

      const subjectIDs = Array.from(new Set(Array.from(assignmentByID.values()).map(item => item.subject_id).filter(Boolean)))
      const teacherIDs = Array.from(new Set(Array.from(assignmentByID.values()).map(item => item.teacher_id).filter(Boolean)))
      const classroomIDs = Array.from(new Set(Array.from(assignmentByID.values()).map(item => item.classroom_id).filter(Boolean)))

      const [subjectResponses, teacherResponses, classroomResponses, scheduleResponses] = await Promise.all([
        Promise.all(subjectIDs.map(id => safeFetch<BaseResponse<SubjectItem>>(`${config.public.apiBase}/students-meta/subjects/${id}`, headers))),
        Promise.all(teacherIDs.map(id => safeFetch<BaseResponse<TeacherItem>>(`${config.public.apiBase}/students-meta/teachers/${id}`, headers))),
        Promise.all(classroomIDs.map(id => safeFetch<BaseResponse<ClassroomItem>>(`${config.public.apiBase}/students-meta/classrooms/${id}`, headers))),
        Promise.all(assignmentIDs.map(id => safeFetch<BaseResponse<ScheduleItem[]>>(`${config.public.apiBase}/students-meta/schedules?subject_assignment_id=${id}&only_active=true`, headers))),
      ])

      const subjectByID = new Map<string, SubjectItem>()
      for (const item of subjectResponses) {
        deniedDetected = deniedDetected || item.denied
        if (item.data?.data?.id) subjectByID.set(item.data.data.id, item.data.data)
      }

      const teacherByID = new Map<string, TeacherItem>()
      for (const item of teacherResponses) {
        deniedDetected = deniedDetected || item.denied
        if (item.data?.data?.id) teacherByID.set(item.data.data.id, item.data.data)
      }

      const classroomByID = new Map<string, ClassroomItem>()
      for (const item of classroomResponses) {
        deniedDetected = deniedDetected || item.denied
        if (item.data?.data?.id) classroomByID.set(item.data.data.id, item.data.data)
      }

      const periodsByDay = new Map<string, SchedulePeriod[]>()
      for (const day of DAY_ORDER) periodsByDay.set(day.key, [])

      for (const response of scheduleResponses) {
        deniedDetected = deniedDetected || response.denied
        const items = response.data?.data || []
        for (const item of items) {
          if (!item.is_active || item.period_no === null) continue
          const dayKey = mapApiDayToKey(item.day_of_week)
          if (!dayKey) continue

          const assignment = assignmentByID.get(item.subject_assignment_id)
          const subject = assignment ? subjectByID.get(assignment.subject_id) : null
          const teacher = assignment ? teacherByID.get(assignment.teacher_id) : null
          const classroom = assignment ? classroomByID.get(assignment.classroom_id) : null

          const teacherName = teacher
            ? `${(teacher.first_name || '').trim()} ${(teacher.last_name || '').trim()}`.trim() || teacher.teacher_code || '-'
            : '-'

          const roomLabel = classroom
            ? (classroom.name || `${classroom.grade_level || ''} ${classroom.room_no || ''}`.trim() || '-')
            : '-'

          const subjectName = subject?.name?.trim() || 'ไม่ระบุรายวิชา'
          const subjectCode = (subject?.subject_code || '').trim() || '-'

          periodsByDay.get(dayKey)?.push({
            period: item.period_no,
            startTime: toHM(item.start_time),
            endTime: toHM(item.end_time),
            subject: subjectName,
            subjectCode,
            teacher: teacherName,
            room: roomLabel,
            color: colorFor(subjectName),
          })
        }
      }

      schedule.value = DAY_ORDER.map(day => ({
        day: day.key,
        dayTh: day.th,
        periods: (periodsByDay.get(day.key) || []).sort((a, b) => a.period - b.period),
      }))

      if (deniedDetected && schedule.value.every(day => day.periods.length === 0)) {
        accessDenied.value = true
        errorMessage.value = 'ไม่มีสิทธิ์เข้าถึงข้อมูลตารางเรียน'
      }

      isLoading.value = false
    }).catch(() => {
      schedule.value = defaultWeek()
      isLoading.value = false
      errorMessage.value = 'ไม่สามารถโหลดข้อมูลตารางเรียนได้'
    })
  }

  return { schedule, isLoading, accessDenied, errorMessage }
}
