import { createContext, useContext, useState, type ReactNode } from 'react'

export interface Announcement {
  id: string
  title: string
  message: string
  priority: 'Normal' | 'Important' | 'Urgent'
  publishDate: string
  isRead: boolean
}

export interface TimetableEntry {
  id: string
  room: string
  block: string
  day: string
  startTime: string
  endTime: string
  subject: string
}

interface AppContextType {
  isStudentLoggedIn: boolean
  isAdminLoggedIn: boolean
  announcements: Announcement[]
  timetable: TimetableEntry[]
  loginStudent: () => void
  logoutStudent: () => void
  loginAdmin: () => void
  logoutAdmin: () => void
  addAnnouncement: (a: Omit<Announcement, 'id' | 'isRead'>) => void
  updateAnnouncement: (a: Announcement) => void
  deleteAnnouncement: (id: string) => void
  markAnnouncementRead: (id: string) => void
  addTimetableEntry: (e: Omit<TimetableEntry, 'id'>) => void
  updateTimetableEntry: (e: TimetableEntry) => void
  deleteTimetableEntry: (id: string) => void
}

const initialTimetable: TimetableEntry[] = [
  { id: '1', room: 'B-201', block: 'B', day: 'Monday', startTime: '09:10', endTime: '10:00', subject: 'Mathematics' },
  { id: '2', room: 'B-201', block: 'B', day: 'Monday', startTime: '10:00', endTime: '10:50', subject: 'Physics' },
  { id: '3', room: 'B-203', block: 'B', day: 'Monday', startTime: '11:00', endTime: '11:50', subject: 'DBMS' },
  { id: '4', room: 'B-207', block: 'B', day: 'Monday', startTime: '12:00', endTime: '12:50', subject: 'Mathematics' },
  { id: '5', room: 'B-202', block: 'B', day: 'Monday', startTime: '09:00', endTime: '09:50', subject: 'Chemistry' },
  { id: '6', room: 'B-204', block: 'B', day: 'Monday', startTime: '14:00', endTime: '14:50', subject: 'Data Structures' },
  { id: '7', room: 'A-101', block: 'A', day: 'Monday', startTime: '09:00', endTime: '10:00', subject: 'Calculus' },
  { id: '8', room: 'A-102', block: 'A', day: 'Monday', startTime: '10:00', endTime: '11:00', subject: 'English' },
]

const initialAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Important Notice',
    message: 'Block B classrooms will have revised schedules today. Please check the updated timetable before booking a room.',
    priority: 'Important',
    publishDate: '17 Sep 2026',
    isRead: false,
  },
  {
    id: '2',
    title: 'Room Unavailability',
    message: 'Room B-203 will be unavailable from 2:00 PM today due to maintenance work. Please use alternative rooms.',
    priority: 'Normal',
    publishDate: '17 Sep 2026',
    isRead: false,
  },
  {
    id: '3',
    title: 'Semester Timetable Updated',
    message: 'The timetable for the current semester has been updated. All blocks now reflect the latest schedule.',
    priority: 'Normal',
    publishDate: '15 Sep 2026',
    isRead: true,
  },
  {
    id: '4',
    title: 'Urgent: Exam Hall Allocation',
    message: 'Mid-semester examination halls have been allocated. Block C will be reserved exclusively for exams from 20–25 Sep 2026.',
    priority: 'Urgent',
    publishDate: '14 Sep 2026',
    isRead: true,
  },
]

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [isStudentLoggedIn, setIsStudentLoggedIn] = useState(false)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements)
  const [timetable, setTimetable] = useState<TimetableEntry[]>(initialTimetable)

  const loginStudent = () => setIsStudentLoggedIn(true)
  const logoutStudent = () => setIsStudentLoggedIn(false)
  const loginAdmin = () => setIsAdminLoggedIn(true)
  const logoutAdmin = () => setIsAdminLoggedIn(false)

  const addAnnouncement = (a: Omit<Announcement, 'id' | 'isRead'>) => {
    setAnnouncements(prev => [{ ...a, id: Date.now().toString(), isRead: false }, ...prev])
  }

  const updateAnnouncement = (a: Announcement) => {
    setAnnouncements(prev => prev.map(x => (x.id === a.id ? a : x)))
  }

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(x => x.id !== id))
  }

  const markAnnouncementRead = (id: string) => {
    setAnnouncements(prev => prev.map(x => (x.id === id ? { ...x, isRead: true } : x)))
  }

  const addTimetableEntry = (e: Omit<TimetableEntry, 'id'>) => {
    setTimetable(prev => [...prev, { ...e, id: Date.now().toString() }])
  }

  const updateTimetableEntry = (e: TimetableEntry) => {
    setTimetable(prev => prev.map(x => (x.id === e.id ? e : x)))
  }

  const deleteTimetableEntry = (id: string) => {
    setTimetable(prev => prev.filter(x => x.id !== id))
  }

  return (
    <AppContext.Provider
      value={{
        isStudentLoggedIn,
        isAdminLoggedIn,
        announcements,
        timetable,
        loginStudent,
        logoutStudent,
        loginAdmin,
        logoutAdmin,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        markAnnouncementRead,
        addTimetableEntry,
        updateTimetableEntry,
        deleteTimetableEntry,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
