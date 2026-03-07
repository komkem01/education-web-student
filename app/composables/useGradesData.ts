import { ref, computed } from 'vue'

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
  { id: '2568-1', academicYear: '2568', term: 1, label: 'ปีการศึกษา 2568 เทอม 1' },
  { id: '2567-2', academicYear: '2567', term: 2, label: 'ปีการศึกษา 2567 เทอม 2' },
  { id: '2567-1', academicYear: '2567', term: 1, label: 'ปีการศึกษา 2567 เทอม 1' },
]

const gradesBySemester: Record<string, SubjectGrade[]> = {
  '2568-1': [
    { id: '1', subjectCode: 'T101', subjectName: 'ภาษาไทย', credits: 1.5, hours: 60, midterm: 28, final: 32, attendance: 18, behavior: 10, total: 88, grade: 3.5, status: 'ผ่าน', teacher: 'อ.สมหญิง' },
    { id: '2', subjectCode: 'M101', subjectName: 'คณิตศาสตร์พื้นฐาน', credits: 1.5, hours: 60, midterm: 22, final: 25, attendance: 18, behavior: 10, total: 75, grade: 3, status: 'ผ่าน', teacher: 'อ.สมศักดิ์' },
    { id: '3', subjectCode: 'S101', subjectName: 'วิทยาศาสตร์', credits: 1.5, hours: 60, midterm: 18, final: 21, attendance: 16, behavior: 9, total: 64, grade: 2, status: 'ผ่าน', teacher: 'อ.สมชาย' },
    { id: '4', subjectCode: 'SS101', subjectName: 'สังคมศึกษา', credits: 1, hours: 40, midterm: 25, final: 29, attendance: 18, behavior: 10, total: 82, grade: 3.5, status: 'ผ่าน', teacher: 'อ.สมใจ' },
    { id: '5', subjectCode: 'E101', subjectName: 'ภาษาอังกฤษ', credits: 1.5, hours: 60, midterm: 30, final: 35, attendance: 18, behavior: 10, total: 93, grade: 4, status: 'ผ่าน', teacher: 'อ.สมัคร' },
    { id: '6', subjectCode: 'HI101', subjectName: 'ประวัติศาสตร์', credits: 0.5, hours: 20, midterm: 14, final: 15, attendance: 9, behavior: 5, total: 43, grade: 1.5, status: 'ผ่าน', teacher: 'อ.สมนึก' },
    { id: '7', subjectCode: 'PE101', subjectName: 'พลศึกษา', credits: 1, hours: 40, midterm: null, final: null, attendance: null, behavior: null, total: null, grade: '-', status: 'รอผล', teacher: 'อ.สมาน' },
    { id: '8', subjectCode: 'AR101', subjectName: 'ศิลปะ', credits: 0.5, hours: 20, midterm: null, final: null, attendance: null, behavior: null, total: null, grade: '-', status: 'รอผล', teacher: 'อ.สมศิลป์' },
    { id: '9', subjectCode: 'MU101', subjectName: 'ดนตรี-นาฏศิลป์', credits: 0.5, hours: 20, midterm: null, final: null, attendance: null, behavior: null, total: null, grade: '-', status: 'รอผล', teacher: 'อ.สมเสียง' },
    { id: '10', subjectCode: 'CA101', subjectName: 'การงานอาชีพ', credits: 1, hours: 40, midterm: null, final: null, attendance: null, behavior: null, total: null, grade: '-', status: 'รอผล', teacher: 'อ.สมหวัง' },
    { id: '11', subjectCode: 'COM101', subjectName: 'เทคโนโลยี (คอมพิวเตอร์)', credits: 0.5, hours: 20, midterm: null, final: null, attendance: null, behavior: null, total: null, grade: '-', status: 'รอผล', teacher: 'อ.สมคิด' },
    { id: '12', subjectCode: 'GD101', subjectName: 'แนะแนว', credits: 0, hours: 20, midterm: null, final: null, attendance: null, behavior: null, total: null, grade: '-', status: 'รอผล', teacher: 'อ.สมใจ' },
  ],
  '2567-2': [
    { id: '1', subjectCode: 'T102', subjectName: 'ภาษาไทย 2', credits: 1.5, hours: 60, midterm: 26, final: 30, attendance: 17, behavior: 10, total: 83, grade: 3.5, status: 'ผ่าน', teacher: 'อ.สมหญิง' },
    { id: '2', subjectCode: 'M102', subjectName: 'คณิตศาสตร์ 2', credits: 1.5, hours: 60, midterm: 20, final: 22, attendance: 16, behavior: 9, total: 67, grade: 2.5, status: 'ผ่าน', teacher: 'อ.สมศักดิ์' },
    { id: '3', subjectCode: 'S102', subjectName: 'วิทยาศาสตร์ 2', credits: 1.5, hours: 60, midterm: 15, final: 18, attendance: 15, behavior: 8, total: 56, grade: 1.5, status: 'ผ่าน', teacher: 'อ.สมชาย' },
    { id: '4', subjectCode: 'E102', subjectName: 'ภาษาอังกฤษ 2', credits: 1.5, hours: 60, midterm: 28, final: 32, attendance: 18, behavior: 10, total: 88, grade: 3.5, status: 'ผ่าน', teacher: 'อ.สมัคร' },
    { id: '5', subjectCode: 'SS102', subjectName: 'หน้าที่พลเมือง', credits: 0.5, hours: 20, midterm: 18, final: 20, attendance: 9, behavior: 5, total: 52, grade: 2, status: 'ผ่าน', teacher: 'อ.สมใจ' },
    { id: '6', subjectCode: 'GE101', subjectName: 'ภูมิศาสตร์', credits: 0.5, hours: 20, midterm: 8, final: 10, attendance: 8, behavior: 4, total: 30, grade: 1, status: 'ผ่าน', teacher: 'อ.สมศาสตร์' },
  ],
  '2567-1': [
    { id: '1', subjectCode: 'T201', subjectName: 'ภาษาไทย ม.2/1', credits: 1.5, hours: 60, midterm: 30, final: 35, attendance: 18, behavior: 10, total: 93, grade: 4, status: 'ผ่าน', teacher: 'อ.สมหญิง' },
    { id: '2', subjectCode: 'M201', subjectName: 'คณิตศาสตร์ ม.2/1', credits: 1.5, hours: 60, midterm: 24, final: 28, attendance: 17, behavior: 9, total: 78, grade: 3, status: 'ผ่าน', teacher: 'อ.สมศักดิ์' },
    { id: '3', subjectCode: 'E201', subjectName: 'ภาษาอังกฤษ ม.2/1', credits: 1.5, hours: 60, midterm: 32, final: 36, attendance: 18, behavior: 10, total: 96, grade: 4, status: 'ผ่าน', teacher: 'อ.สมัคร' },
    { id: '4', subjectCode: 'S201', subjectName: 'วิทยาศาสตร์ ม.2/1', credits: 1.5, hours: 60, midterm: 12, final: 14, attendance: 14, behavior: 7, total: 47, grade: 1, status: 'ผ่าน', teacher: 'อ.สมชาย' },
  ],
}

export function useGradesData() {
  const selectedSemesterId = ref('2568-1')

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

  return { selectedSemesterId, semesters, currentGrades, completedGrades, gpa, totalCredits, gradeColor }
}
