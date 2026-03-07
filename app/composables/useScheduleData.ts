import { ref } from 'vue'

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

export function useScheduleData() {
  const schedule = ref<DaySchedule[]>([
    {
      day: 'Mon', dayTh: 'จันทร์',
      periods: [
        { period: 1, startTime: '08:30', endTime: '09:20', subject: 'ภาษาไทย', subjectCode: 'T101', teacher: 'อ.สมหญิง', room: 'ห้อง 201', color: colorFor('ภาษาไทย') },
        { period: 2, startTime: '09:20', endTime: '10:10', subject: 'คณิตศาสตร์พื้นฐาน', subjectCode: 'M101', teacher: 'อ.สมศักดิ์', room: 'ห้อง 305', color: colorFor('คณิตศาสตร์') },
        { period: 3, startTime: '10:20', endTime: '11:10', subject: 'วิทยาศาสตร์', subjectCode: 'S101', teacher: 'อ.สมชาย', room: 'ห้องแล็บ L1', color: colorFor('วิทยาศาสตร์') },
        { period: 4, startTime: '11:10', endTime: '12:00', subject: 'สังคมศึกษา', subjectCode: 'SS101', teacher: 'อ.สมใจ', room: 'ห้อง 204', color: colorFor('สังคมศึกษา') },
        { period: 5, startTime: '13:00', endTime: '13:50', subject: 'ภาษาอังกฤษ', subjectCode: 'E101', teacher: 'อ.สมัคร', room: 'ห้อง 302', color: colorFor('ภาษาอังกฤษ') },
        { period: 6, startTime: '13:50', endTime: '14:40', subject: 'พลศึกษา', subjectCode: 'PE101', teacher: 'อ.สมาน', room: 'สนามกีฬา', color: colorFor('พลศึกษา') },
        { period: 7, startTime: '14:50', endTime: '15:30', subject: 'แนะแนว', subjectCode: 'GD101', teacher: 'อ.สมใจ', room: 'ห้อง 203', color: colorFor('แนะแนว') },
      ],
    },
    {
      day: 'Tue', dayTh: 'อังคาร',
      periods: [
        { period: 1, startTime: '08:30', endTime: '09:20', subject: 'คณิตศาสตร์พื้นฐาน', subjectCode: 'M101', teacher: 'อ.สมศักดิ์', room: 'ห้อง 305', color: colorFor('คณิตศาสตร์') },
        { period: 2, startTime: '09:20', endTime: '10:10', subject: 'ภาษาอังกฤษ', subjectCode: 'E101', teacher: 'อ.สมัคร', room: 'ห้อง 302', color: colorFor('ภาษาอังกฤษ') },
        { period: 3, startTime: '10:20', endTime: '11:10', subject: 'ประวัติศาสตร์', subjectCode: 'HI101', teacher: 'อ.สมนึก', room: 'ห้อง 204', color: colorFor('ประวัติศาสตร์') },
        { period: 4, startTime: '11:10', endTime: '12:00', subject: 'ศิลปะ', subjectCode: 'AR101', teacher: 'อ.สมศิลป์', room: 'ห้องศิลปะ', color: colorFor('ศิลปะ') },
        { period: 5, startTime: '13:00', endTime: '13:50', subject: 'คอมพิวเตอร์', subjectCode: 'COM101', teacher: 'อ.สมคิด', room: 'ห้องคอม 1', color: colorFor('คอมพิวเตอร์') },
        { period: 6, startTime: '13:50', endTime: '14:40', subject: 'การงานอาชีพ', subjectCode: 'CA101', teacher: 'อ.สมหวัง', room: 'ห้องปฏิบัติการ', color: colorFor('การงานอาชีพ') },
      ],
    },
    {
      day: 'Wed', dayTh: 'พุธ',
      periods: [
        { period: 1, startTime: '08:30', endTime: '09:20', subject: 'วิทยาศาสตร์', subjectCode: 'S101', teacher: 'อ.สมชาย', room: 'ห้องแล็บ L1', color: colorFor('วิทยาศาสตร์') },
        { period: 2, startTime: '09:20', endTime: '10:10', subject: 'ภาษาไทย', subjectCode: 'T101', teacher: 'อ.สมหญิง', room: 'ห้อง 201', color: colorFor('ภาษาไทย') },
        { period: 3, startTime: '10:20', endTime: '11:10', subject: 'ดนตรี', subjectCode: 'MU101', teacher: 'อ.สมเสียง', room: 'ห้องดนตรี', color: colorFor('ดนตรี') },
        { period: 4, startTime: '11:10', endTime: '12:00', subject: 'คณิตศาสตร์พื้นฐาน', subjectCode: 'M101', teacher: 'อ.สมศักดิ์', room: 'ห้อง 305', color: colorFor('คณิตศาสตร์') },
        { period: 5, startTime: '13:00', endTime: '13:50', subject: 'สังคมศึกษา', subjectCode: 'SS101', teacher: 'อ.สมใจ', room: 'ห้อง 204', color: colorFor('สังคมศึกษา') },
        { period: 6, startTime: '13:50', endTime: '15:30', subject: 'กิจกรรมชุมนุม', subjectCode: 'ACT', teacher: '', room: 'ตามที่เลือก', color: colorFor('กิจกรรมชุมนุม') },
      ],
    },
    {
      day: 'Thu', dayTh: 'พฤหัสบดี',
      periods: [
        { period: 1, startTime: '08:30', endTime: '09:20', subject: 'ภาษาอังกฤษ', subjectCode: 'E101', teacher: 'อ.สมัคร', room: 'ห้อง 302', color: colorFor('ภาษาอังกฤษ') },
        { period: 2, startTime: '09:20', endTime: '10:10', subject: 'วิทยาศาสตร์', subjectCode: 'S101', teacher: 'อ.สมชาย', room: 'ห้องแล็บ L2', color: colorFor('วิทยาศาสตร์') },
        { period: 3, startTime: '10:20', endTime: '11:10', subject: 'คณิตศาสตร์พื้นฐาน', subjectCode: 'M101', teacher: 'อ.สมศักดิ์', room: 'ห้อง 305', color: colorFor('คณิตศาสตร์') },
        { period: 4, startTime: '11:10', endTime: '12:00', subject: 'ภาษาไทย', subjectCode: 'T101', teacher: 'อ.สมหญิง', room: 'ห้อง 201', color: colorFor('ภาษาไทย') },
        { period: 5, startTime: '13:00', endTime: '13:50', subject: 'การงานอาชีพ', subjectCode: 'CA101', teacher: 'อ.สมหวัง', room: 'ห้องปฏิบัติการ', color: colorFor('การงานอาชีพ') },
        { period: 6, startTime: '13:50', endTime: '14:40', subject: 'ศิลปะ', subjectCode: 'AR101', teacher: 'อ.สมศิลป์', room: 'ห้องศิลปะ', color: colorFor('ศิลปะ') },
      ],
    },
    {
      day: 'Fri', dayTh: 'ศุกร์',
      periods: [
        { period: 1, startTime: '08:30', endTime: '09:20', subject: 'สังคมศึกษา', subjectCode: 'SS101', teacher: 'อ.สมใจ', room: 'ห้อง 204', color: colorFor('สังคมศึกษา') },
        { period: 2, startTime: '09:20', endTime: '10:10', subject: 'คอมพิวเตอร์', subjectCode: 'COM101', teacher: 'อ.สมคิด', room: 'ห้องคอม 1', color: colorFor('คอมพิวเตอร์') },
        { period: 3, startTime: '10:20', endTime: '11:10', subject: 'พลศึกษา', subjectCode: 'PE101', teacher: 'อ.สมาน', room: 'สนามกีฬา', color: colorFor('พลศึกษา') },
        { period: 4, startTime: '11:10', endTime: '12:00', subject: 'ภาษาอังกฤษ', subjectCode: 'E101', teacher: 'อ.สมัคร', room: 'ห้อง 302', color: colorFor('ภาษาอังกฤษ') },
        { period: 5, startTime: '13:00', endTime: '14:40', subject: 'ประวัติศาสตร์', subjectCode: 'HI101', teacher: 'อ.สมนึก', room: 'ห้อง 204', color: colorFor('ประวัติศาสตร์') },
      ],
    },
  ])

  return { schedule }
}
