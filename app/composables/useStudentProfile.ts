import { ref } from 'vue'

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
    studentId: 'STD68-0001',
    prefixTh: 'เด็กชาย',
    firstName: 'ณัฐพงศ์',
    lastName: 'สุขสวัสดิ์',
    nickName: 'เฟริส์ท',
    dob: '15/03/2554',
    gender: 'ชาย',
    bloodType: 'O',
    idCard: '1-1001-00001-01-1',
    religion: 'พุทธ',
    nationality: 'ไทย',
    email: 'nattapong.s@student.school.ac.th',
    phone: '081-000-1234',
    address: '99/1 ถ.ลาดพร้าว แขวงลาดพร้าว เขตลาดพร้าว กรุงเทพฯ 10230',
    grade: 'มัธยมศึกษาปีที่ 3',
    classroom: 'ม.3/2',
    classNumber: 7,
    academicYear: '2568',
    advisorName: 'นางสาวสมใจ รักษ์งาน',
    status: 'กำลังศึกษา',
    enrollDate: '15/05/2564',
    fatherName: 'นายวิชัย สุขสวัสดิ์',
    fatherPhone: '081-111-2222',
    motherName: 'นางสมใจ สุขสวัสดิ์',
    motherPhone: '081-333-4444',
    emergencyContact: 'นายวิชัย สุขสวัสดิ์ (บิดา)',
    emergencyPhone: '081-111-2222',
  })

  return { profile }
}
