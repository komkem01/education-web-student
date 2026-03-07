import { ref } from 'vue'

export type NotifType = 'grade' | 'attendance' | 'announcement' | 'system' | 'document'

export interface StudentNotification {
  id: string
  type: NotifType
  title: string
  body: string
  timestamp: string
  read: boolean
}

export function useNotificationsData() {
  const notifications = ref<StudentNotification[]>([
    { id: 'N001', type: 'grade', title: '📊 ผลการเรียนออกแล้ว', body: 'คะแนนวิชาภาษาอังกฤษ เทอม 1/2568 ออกแล้ว กด "ผลการเรียน" เพื่อดูรายละเอียด', timestamp: '08/03/2568 09:15', read: false },
    { id: 'N002', type: 'attendance', title: '⚠️ แจ้งเตือนการขาดเรียน', body: 'ระบบตรวจพบว่าคุณไม่มาเรียนวิชาวิทยาศาสตร์ เมื่อวันที่ 05/03/2568', timestamp: '05/03/2568 15:00', read: false },
    { id: 'N003', type: 'announcement', title: '📢 ประกาศสอบกลางภาค', body: 'กำหนดการสอบกลางภาคเทอม 1/2568 ระหว่างวันที่ 20-22 มีนาคม 2568', timestamp: '04/03/2568 10:00', read: false },
    { id: 'N004', type: 'system', title: '✅ ลงทะเบียนสำเร็จ', body: 'การลงทะเบียนเรียนภาคเรียนที่ 1/2568 เสร็จสมบูรณ์แล้ว', timestamp: '01/06/2567 08:00', read: true },
    { id: 'N005', type: 'grade', title: '📊 GPA เทอม 2/2567', body: 'เกรดเฉลี่ยสะสม (GPA) เทอม 2/2567 ของคุณคือ 3.12', timestamp: '28/02/2568 12:00', read: true },
    { id: 'N006', type: 'announcement', title: '📢 วันหยุดราชการ', body: 'โรงเรียนปิดเรียนวันที่ 14 เมษายน 2568 เนื่องในวันสงกรานต์', timestamp: '25/02/2568 09:00', read: true },
    { id: 'N007', type: 'document', title: '📄 เอกสารพร้อมรับแล้ว', body: 'ใบรับรองการเป็นนักเรียน (คำขอ DOC-001) พร้อมรับได้ที่ห้องทะเบียน', timestamp: '20/02/2568 13:30', read: true },
  ])

  function markRead(id: string) {
    const n = notifications.value.find(x => x.id === id)
    if (n) n.read = true
  }

  function markAllRead() {
    notifications.value.forEach(n => { n.read = true })
  }

  return { notifications, markRead, markAllRead }
}
