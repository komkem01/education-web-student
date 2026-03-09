import { ref } from 'vue'
import { ensureStudentSession } from './useStudentSession'

type BaseResponse<T> = { data: T }

type PrefixItem = {
  id: string
  name_th: string | null
}

type ClassroomItem = {
  id: string
  name: string
  grade_level: string | null
  room_no: string | null
}

type TeacherItem = {
  id: string
  first_name: string | null
  last_name: string | null
  teacher_code: string | null
}

type StudentParentItem = {
  relationship: string
  parent_first_name: string | null
  parent_last_name: string | null
  parent_phone: string | null
  is_main_guardian: boolean
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
  year: string
  term: string
}

function looksLikeUUID(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

export interface StudentProfile {
  studentId: string
  prefixTh: string
  firstName: string
  lastName: string
  nickName: string
  dob: string
  gender: string
  bloodType: string
  idCard: string
  religion: string
  nationality: string
  // contact
  email: string
  phone: string
  address: string
  // academic
  grade: string
  classroom: string
  classNumber: number
  academicYear: string
  advisorName: string
  status: string
  enrollDate: string
  // parent
  fatherName: string
  fatherPhone: string
  motherName: string
  motherPhone: string
  emergencyContact: string
  emergencyPhone: string
}

export function useStudentProfile() {
  const profile = ref<StudentProfile>({
    studentId: '-',
    prefixTh: '',
    firstName: '-',
    lastName: '',
    nickName: '-',
    dob: '-',
    gender: '-',
    bloodType: '-',
    idCard: '-',
    religion: '-',
    nationality: '-',
    email: '-',
    phone: '-',
    address: '-',
    grade: '-',
    classroom: '-',
    classNumber: 0,
    academicYear: String(new Date().getFullYear() + 543),
    advisorName: '-',
    status: 'กำลังศึกษา',
    enrollDate: '-',
    fatherName: '-',
    fatherPhone: '-',
    motherName: '-',
    motherPhone: '-',
    emergencyContact: '-',
    emergencyPhone: '-',
  })

  if (import.meta.client) {
    ensureStudentSession().then(async (session) => {
      if (!session || !session.student) return
      const student = session.student
      const token = useCookie<string | null>('edu_student_token')
      const config = useRuntimeConfig()

      const headers = token.value ? { Authorization: `Bearer ${token.value}` } : undefined

      let prefixTh = ''
      if (student.prefix_id && headers) {
        try {
          const prefixRes = await $fetch<BaseResponse<PrefixItem>>(`${config.public.apiBase}/students-meta/prefixes/${student.prefix_id}`, { headers })
          prefixTh = (prefixRes.data?.name_th || '').trim()
        }
        catch {
          prefixTh = ''
        }
      }

      let classroomLabel = '-'
      if (student.current_classroom_id && headers) {
        try {
          const classroomRes = await $fetch<BaseResponse<ClassroomItem>>(`${config.public.apiBase}/students-meta/classrooms/${student.current_classroom_id}`, { headers })
          const row = classroomRes.data
          classroomLabel = row.name || `${row.grade_level || ''} ${row.room_no || ''}`.trim() || '-'
        }
        catch {
          classroomLabel = '-'
        }
      }

      if (looksLikeUUID(classroomLabel)) classroomLabel = '-'

      let gradeLabel = '-'
      if (student.current_classroom_id && headers) {
        try {
          const classroomRes = await $fetch<BaseResponse<ClassroomItem>>(`${config.public.apiBase}/students-meta/classrooms/${student.current_classroom_id}`, { headers })
          if (classroomRes.data?.grade_level?.trim()) gradeLabel = classroomRes.data.grade_level.trim()
        }
        catch {
          gradeLabel = '-'
        }
      }

      let advisorName = '-'
      if (student.advisor_teacher_id && headers) {
        try {
          const teacherRes = await $fetch<BaseResponse<TeacherItem>>(`${config.public.apiBase}/students-meta/teachers/${student.advisor_teacher_id}`, { headers })
          advisorName = `${(teacherRes.data?.first_name || '').trim()} ${(teacherRes.data?.last_name || '').trim()}`.trim()
            || teacherRes.data?.teacher_code
            || '-'
        }
        catch {
          advisorName = '-'
        }
      }

      let fatherName = '-'
      let fatherPhone = '-'
      let motherName = '-'
      let motherPhone = '-'
      let emergencyContact = '-'
      let emergencyPhone = '-'

      if (headers) {
        try {
          const parentsRes = await $fetch<BaseResponse<StudentParentItem[]>>(`${config.public.apiBase}/students/${student.id}/parents`, { headers })
          const rows = parentsRes.data || []
          const father = rows.find(item => item.relationship === 'father')
          const mother = rows.find(item => item.relationship === 'mother')
          const guardian = rows.find(item => item.is_main_guardian) || rows.find(item => item.relationship === 'guardian') || father || mother

          if (father) {
            fatherName = `${(father.parent_first_name || '').trim()} ${(father.parent_last_name || '').trim()}`.trim() || '-'
            fatherPhone = father.parent_phone?.trim() || '-'
          }
          if (mother) {
            motherName = `${(mother.parent_first_name || '').trim()} ${(mother.parent_last_name || '').trim()}`.trim() || '-'
            motherPhone = mother.parent_phone?.trim() || '-'
          }
          if (guardian) {
            emergencyContact = `${(guardian.parent_first_name || '').trim()} ${(guardian.parent_last_name || '').trim()}`.trim() || '-'
            emergencyPhone = guardian.parent_phone?.trim() || '-'
          }
        }
        catch {
          // Keep parent fallback values when endpoint is unavailable.
        }
      }

      let academicYearLabel = String(new Date().getFullYear() + 543)
      if (headers) {
        try {
          const enrollmentRes = await $fetch<BaseResponse<EnrollmentItem[]>>(`${config.public.apiBase}/students/${student.id}/enrollments`, { headers })
          let assignmentID = (enrollmentRes.data || []).find(item => item.status !== 'dropped')?.subject_assignment_id || ''
          if (!assignmentID && student.current_classroom_id) {
            try {
              const byClassroomRes = await $fetch<BaseResponse<SubjectAssignmentItem[]>>(`${config.public.apiBase}/students-meta/subject-assignments?classroom_id=${student.current_classroom_id}&only_active=true`, { headers })
              assignmentID = (byClassroomRes.data || [])[0]?.id || ''
            }
            catch {
              assignmentID = ''
            }
          }

          if (assignmentID) {
            const assignmentRes = await $fetch<BaseResponse<SubjectAssignmentItem>>(`${config.public.apiBase}/students-meta/subject-assignments/${assignmentID}`, { headers })
            if (assignmentRes.data?.academic_year_id) {
              const yearRes = await $fetch<BaseResponse<AcademicYearItem>>(`${config.public.apiBase}/students-meta/academic-years/${assignmentRes.data.academic_year_id}`, { headers })
              if (yearRes.data?.year) academicYearLabel = yearRes.data.year
            }
          }
        }
        catch {
          // Keep current-year fallback when academic-year lookup is unavailable.
        }
      }

      profile.value = {
        ...profile.value,
        studentId: student.student_code?.trim() || student.id,
        prefixTh,
        firstName: student.first_name?.trim() || '-',
        lastName: student.last_name?.trim() || '',
        email: '-',
        phone: student.phone?.trim() || '-',
        idCard: student.citizen_id?.trim() || '-',
        grade: gradeLabel,
        classroom: classroomLabel,
        classNumber: student.default_student_no || 0,
        academicYear: academicYearLabel,
        advisorName,
        status: student.is_active ? 'กำลังศึกษา' : 'ไม่ใช้งาน',
        fatherName,
        fatherPhone,
        motherName,
        motherPhone,
        emergencyContact,
        emergencyPhone,
      }
    }).catch(() => {
      // Keep fallback values when API is unavailable.
    })
  }

  return { profile }
}
