import { ref, computed } from 'vue'
import { ensureStudentSession } from './useStudentSession'

export type GradeValue = 4 | 3.5 | 3 | 2.5 | 2 | 1.5 | 1 | 0 | 'ร' | 'มส' | 'มผ' | '-'

export interface SubjectGrade {
  id: string
  subjectCode: string
  subjectName: string
  credits: number
  hours: number
  midterm: number | null
  final: number | null
  attendance: number | null
  behavior: number | null
  total: number | null
  grade: GradeValue
  status: 'ผ่าน' | 'ไม่ผ่าน' | 'รอผล' | 'ร' | 'มส' | 'มผ'
  teacher: string
}

export interface Semester {
  id: string
  academicYear: string
  term: 1 | 2
  label: string
}

const semesters: Semester[] = [
  { id: 'current', academicYear: String(new Date().getFullYear() + 543), term: 1, label: `ปีการศึกษา ${new Date().getFullYear() + 543}` },
]

const gradesBySemester = ref<Record<string, SubjectGrade[]>>({ current: [] })

function toGrade(score: number | null): GradeValue {
  if (score === null) return '-'
  if (score >= 80) return 4
  if (score >= 75) return 3.5
  if (score >= 70) return 3
  if (score >= 65) return 2.5
  if (score >= 60) return 2
  if (score >= 55) return 1.5
  if (score >= 50) return 1
  return 0
}

export function useGradesData() {
  const selectedSemesterId = ref('current')
  const isLoading = ref(import.meta.client)
  const accessDenied = ref(false)
  const errorMessage = ref('')

  if (import.meta.client) {
    ensureStudentSession().then(async (session) => {
      if (!session?.student) {
        isLoading.value = false
        return
      }

      const token = useCookie<string | null>('edu_student_token')
      if (!token.value) {
        isLoading.value = false
        accessDenied.value = true
        errorMessage.value = 'ไม่มีสิทธิ์เข้าถึงข้อมูลผลการเรียน'
        return
      }
      const config = useRuntimeConfig()
      const headers = { Authorization: `Bearer ${token.value}` }

      try {
        const [gradeRecordsRes, gradeItemsRes] = await Promise.all([
          $fetch<{ data: Array<{ id: string; grade_item_id: string; score: number | null }> }>(`${config.public.apiBase}/students/${session.student.id}/grade-records`, { headers }),
          $fetch<{ data: Array<{ id: string; name: string | null; max_score: number | null }> }>(`${config.public.apiBase}/students/${session.student.id}/grade-items`, { headers }),
        ])

        const itemByID: Record<string, { name: string | null; max_score: number | null }> = {}
        for (const item of (gradeItemsRes.data || [])) {
          itemByID[item.id] = { name: item.name, max_score: item.max_score }
        }

        gradesBySemester.value.current = (gradeRecordsRes.data || []).map((record, idx) => {
          const gradeItem = itemByID[record.grade_item_id]
          const score = record.score
          const grade = toGrade(score)
          const pass = typeof grade === 'number' ? grade >= 1 : false

          return {
            id: record.id,
            subjectCode: `SUB-${idx + 1}`,
            subjectName: gradeItem?.name?.trim() || `รายวิชา ${idx + 1}`,
            credits: 1,
            hours: 0,
            midterm: null,
            final: null,
            attendance: null,
            behavior: null,
            total: score,
            grade,
            status: score === null ? 'รอผล' : (pass ? 'ผ่าน' : 'ไม่ผ่าน'),
            teacher: '-',
          }
        })
      }
      catch (err: any) {
        gradesBySemester.value.current = []
        const code = Number(err?.statusCode || err?.status || 0)
        if (code === 401 || code === 403) {
          accessDenied.value = true
          errorMessage.value = 'ไม่มีสิทธิ์เข้าถึงข้อมูลผลการเรียน'
        }
        else {
          errorMessage.value = 'ไม่สามารถโหลดข้อมูลผลการเรียนได้'
        }
      }
      finally {
        isLoading.value = false
      }
    }).catch(() => {
      gradesBySemester.value.current = []
      isLoading.value = false
      errorMessage.value = 'ไม่สามารถโหลดข้อมูลผลการเรียนได้'
    })
  }

  const currentGrades = computed(() => gradesBySemester[selectedSemesterId.value] ?? [])

  const completedGrades = computed(() =>
    currentGrades.value.filter(g => g.grade !== '-')
  )

  const gpa = computed(() => {
    const scored = completedGrades.value.filter(
      g => typeof g.grade === 'number' && g.credits > 0
    )
    if (scored.length === 0) return null
    const totalCreditsPoints = scored.reduce(
      (sum, g) => sum + (g.grade as number) * g.credits,
      0
    )
    const totalCredits = scored.reduce((sum, g) => sum + g.credits, 0)
    return totalCredits > 0 ? (totalCreditsPoints / totalCredits).toFixed(2) : null
  })

  const totalCredits = computed(() =>
    completedGrades.value
      .filter(g => typeof g.grade === 'number' && g.status === 'ผ่าน')
      .reduce((sum, g) => sum + g.credits, 0)
  )

  function gradeColor(grade: GradeValue): string {
    if (grade === '-') return '#94a3b8'
    if (grade === 'ร') return '#f59e0b'
    if (grade === 'มส' || grade === 'มผ') return '#ef4444'
    if (typeof grade === 'number') {
      if (grade >= 3.5) return '#16a34a'
      if (grade >= 2.5) return '#2563eb'
      if (grade >= 1.5) return '#f59e0b'
      if (grade >= 1) return '#ea580c'
      return '#dc2626'
    }
    return '#94a3b8'
  }

  return { selectedSemesterId, semesters, currentGrades, completedGrades, gpa, totalCredits, gradeColor, isLoading, accessDenied, errorMessage }
}
