import { ref } from 'vue'
import { ensureStudentSession } from './useStudentSession'

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
    ensureStudentSession().then((session) => {
      if (!session || !session.student) return
      const student = session.student

      profile.value = {
        ...profile.value,
        studentId: student.student_code?.trim() || student.id,
        firstName: student.first_name?.trim() || '-',
        lastName: student.last_name?.trim() || '',
        email: `${session.memberId}@student.local`,
        phone: student.phone?.trim() || '-',
        idCard: student.citizen_id?.trim() || '-',
        classroom: student.current_classroom_id?.trim() || '-',
        classNumber: student.default_student_no || 0,
        status: student.is_active ? 'กำลังศึกษา' : 'ไม่ใช้งาน',
      }
    }).catch(() => {
      // Keep fallback values when API is unavailable.
    })
  }

  return { profile }
}
