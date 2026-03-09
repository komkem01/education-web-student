import { ref } from 'vue'
import { useCookie, useRuntimeConfig } from '#app'
import { $fetch } from 'ofetch'
import { ensureStudentSession } from './useStudentSession'

type BaseResponse<T> = { data: T }

type SchoolItem = {
  id: string
  name: string
}

type EnrollmentItem = {
  subject_assignment_id: string
  status: string
}

type SubjectAssignmentItem = {
  id: string
  classroom_id: string
  academic_year_id: string
  semester_no: number
}

type AcademicYearItem = {
  id: string
  year: string
  term: string
}

const schoolNameState = ref('โรงเรียนของฉัน')
const termLabelState = ref(`ปีการศึกษา ${new Date().getFullYear() + 543} เทอม 1`)
const isClient = typeof window !== 'undefined'
const loadingState = ref(isClient)

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items))
}

export function useStudentHeaderInfo() {
  if (isClient) {
    ensureStudentSession().then(async (session) => {
      if (!session?.student) {
        loadingState.value = false
        return
      }

      const token = useCookie<string | null>('edu_student_token')
      if (!token.value) {
        loadingState.value = false
        return
      }

      const config = useRuntimeConfig()
      const headers = { Authorization: `Bearer ${token.value}` }

      try {
        const schoolRes = await $fetch<BaseResponse<SchoolItem>>(
          `${config.public.apiBase}/students-meta/schools/${session.schoolId}`,
          { headers },
        )
        if (schoolRes.data?.name?.trim()) {
          schoolNameState.value = schoolRes.data.name.trim()
        }
      }
      catch {
        schoolNameState.value = 'โรงเรียนของฉัน'
      }

      try {
        const enrollmentRes = await $fetch<BaseResponse<EnrollmentItem[]>>(
          `${config.public.apiBase}/students/${session.student.id}/enrollments`,
          { headers },
        )

        const usable = (enrollmentRes.data || []).filter((row: EnrollmentItem) => row.status !== 'dropped')
        let assignmentIds = unique(usable.map((row: EnrollmentItem) => row.subject_assignment_id).filter(Boolean))

        if (assignmentIds.length === 0 && session.student.current_classroom_id) {
          try {
            const byClassroomRes = await $fetch<BaseResponse<SubjectAssignmentItem[]>>(
              `${config.public.apiBase}/students-meta/subject-assignments?classroom_id=${session.student.current_classroom_id}&only_active=true`,
              { headers },
            )
            assignmentIds = unique((byClassroomRes.data || []).map((row: SubjectAssignmentItem) => row.id).filter(Boolean))
          }
          catch {
            // Keep assignment list from enrollments when classroom lookup fails.
          }
        }

        if (assignmentIds.length === 0) {
          loadingState.value = false
          return
        }

        const assignmentRows = await Promise.all(
          assignmentIds.map(async (id) => {
            try {
              const res = await $fetch<BaseResponse<SubjectAssignmentItem>>(
                `${config.public.apiBase}/students-meta/subject-assignments/${id}`,
                { headers },
              )
              return res.data
            }
            catch {
              return null
            }
          }),
        )

        const first = assignmentRows.find(Boolean)
        if (!first) {
          loadingState.value = false
          return
        }

        let yearLabel = String(new Date().getFullYear() + 543)
        let termNo = first.semester_no || 1

        if (first.academic_year_id) {
          try {
            const ayRes = await $fetch<BaseResponse<AcademicYearItem>>(
              `${config.public.apiBase}/students-meta/academic-years/${first.academic_year_id}`,
              { headers },
            )
            if (ayRes.data?.year) yearLabel = ayRes.data.year
            if (ayRes.data?.term) {
              const parsedTerm = Number(ayRes.data.term)
              if (!Number.isNaN(parsedTerm) && parsedTerm > 0) termNo = parsedTerm
            }
          }
          catch {
            // Keep label from assignment/current year when academic-year endpoint is restricted.
          }
        }

        termLabelState.value = `ปีการศึกษา ${yearLabel} เทอม ${termNo}`
      }
      catch {
        // Keep default term label when data is unavailable.
      }
      finally {
        loadingState.value = false
      }
    }).catch(() => {
      loadingState.value = false
    })
  }

  return {
    schoolName: schoolNameState,
    termLabel: termLabelState,
    isLoading: loadingState,
  }
}
