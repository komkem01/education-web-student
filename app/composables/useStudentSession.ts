import { ref } from 'vue'

type BaseResponse<T> = { data: T }

type MeResponse = {
  member_id: string
  school_id: string
  role: string
  roles: string[]
}

type StudentItem = {
  id: string
  member_id: string
  prefix_id: string | null
  student_code: string | null
  first_name: string | null
  last_name: string | null
  current_classroom_id: string | null
  default_student_no: number | null
  is_active: boolean
  advisor_teacher_id: string | null
  phone: string | null
  citizen_id: string | null
}

export type StudentSession = {
  memberId: string
  schoolId: string
  student: StudentItem | null
}

let sessionPromise: Promise<StudentSession | null> | null = null

function authHeaders() {
  const token = useCookie<string | null>('edu_student_token')
  if (!token.value) return undefined
  return { Authorization: `Bearer ${token.value}` }
}

async function apiFetch<T>(path: string, options?: Parameters<typeof $fetch<T>>[1]) {
  const config = useRuntimeConfig()
  return await $fetch<T>(`${config.public.apiBase}${path}`, options)
}

async function loadSession(): Promise<StudentSession | null> {
  const headers = authHeaders()
  if (!headers) return null

  const me = await apiFetch<BaseResponse<MeResponse>>('/auth/me', { headers })
  const memberId = me.data?.member_id
  const schoolId = me.data?.school_id
  if (!memberId || !schoolId) return null

  const studentRes = await apiFetch<BaseResponse<StudentItem[]>>(`/students?member_id=${encodeURIComponent(memberId)}&only_active=false`, { headers })
  const student = (studentRes.data || [])[0] || null

  return { memberId, schoolId, student }
}

export async function ensureStudentSession() {
  const state = useState<StudentSession | null>('student-session', () => null)
  if (state.value) return state.value

  if (!sessionPromise) {
    sessionPromise = loadSession()
      .then((value) => {
        state.value = value
        return value
      })
      .finally(() => {
        sessionPromise = null
      })
  }

  return await sessionPromise
}

export function useStudentSessionState() {
  return useState<StudentSession | null>('student-session', () => null)
}
