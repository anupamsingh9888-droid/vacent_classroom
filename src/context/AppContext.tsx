import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { INITIAL_TIMETABLE_FALLBACK, type TimetableEntry } from '../utils/timetableLogic'

export type { TimetableEntry }

export interface StudentProfile {
  name: string
  email?: string
  studentId?: string
  program?: string
}

export interface Announcement {
  id: string
  title: string
  message: string
  priority: 'Normal' | 'Important' | 'Urgent'
  publishDate: string
  isRead: boolean
}

interface AppContextType {
  isStudentLoggedIn: boolean
  isAdminLoggedIn: boolean
  currentStudent: StudentProfile | null
  announcements: Announcement[]
  timetable: TimetableEntry[]
  savedRooms: string[]
  loginStudent: (profile?: StudentProfile) => void
  signupStudent: (profile: StudentProfile) => void
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
  toggleSaveRoom: (roomId: string) => void
  isRoomSaved: (roomId: string) => boolean
}

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

const STORAGE_KEYS = {
  TIMETABLE: 'spacia_timetable_data',
  ANNOUNCEMENTS: 'spacia_announcements_data',
  STUDENT_AUTH: 'spacia_student_auth',
  STUDENT_PROFILE: 'spacia_student_profile',
  ADMIN_AUTH: 'spacia_admin_auth',
  SAVED_ROOMS: 'spacia_saved_rooms',
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key)
    if (item) {
      return JSON.parse(item)
    }
  } catch (err) {
    console.warn(`Failed to read ${key} from localStorage:`, err)
  }
  return fallback
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.warn(`Failed to save ${key} to localStorage:`, err)
  }
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  // Separate student and admin authentication states with localStorage persistence
  const [isStudentLoggedIn, setIsStudentLoggedIn] = useState<boolean>(() => {
    return loadFromStorage<boolean>(STORAGE_KEYS.STUDENT_AUTH, false)
  })

  const [currentStudent, setCurrentStudent] = useState<StudentProfile | null>(() => {
    return loadFromStorage<StudentProfile | null>(STORAGE_KEYS.STUDENT_PROFILE, null)
  })

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return loadFromStorage<boolean>(STORAGE_KEYS.ADMIN_AUTH, false)
  })

  // Announcements state with persistence
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    return loadFromStorage<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, initialAnnouncements)
  })

  // Timetable state with persistence and initial mock fallback
  const [timetable, setTimetable] = useState<TimetableEntry[]>(() => {
    return loadFromStorage<TimetableEntry[]>(STORAGE_KEYS.TIMETABLE, INITIAL_TIMETABLE_FALLBACK)
  })

  // Saved rooms state with persistence
  const [savedRooms, setSavedRooms] = useState<string[]>(() => {
    return loadFromStorage<string[]>(STORAGE_KEYS.SAVED_ROOMS, [])
  })

  // Keep localStorage in sync whenever state changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.STUDENT_AUTH, isStudentLoggedIn)
  }, [isStudentLoggedIn])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.STUDENT_PROFILE, currentStudent)
  }, [currentStudent])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ADMIN_AUTH, isAdminLoggedIn)
  }, [isAdminLoggedIn])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ANNOUNCEMENTS, announcements)
  }, [announcements])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TIMETABLE, timetable)
  }, [timetable])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SAVED_ROOMS, savedRooms)
  }, [savedRooms])

  // Authentication handlers - Strictly separate student and admin
  const loginStudent = (profile?: StudentProfile) => {
    if (profile) {
      setCurrentStudent(profile)
    } else if (!currentStudent) {
      setCurrentStudent({
        name: 'KRMU Student',
        email: 'student@krmu.edu.in',
        studentId: '2023KRM001',
        program: 'B.Tech CSE',
      })
    }
    setIsStudentLoggedIn(true)
    setIsAdminLoggedIn(false)
  }

  const signupStudent = (profile: StudentProfile) => {
    setCurrentStudent(profile)
    setIsStudentLoggedIn(true)
    setIsAdminLoggedIn(false)
  }

  const logoutStudent = () => {
    setIsStudentLoggedIn(false)
  }

  const loginAdmin = () => {
    setIsAdminLoggedIn(true)
    setIsStudentLoggedIn(false)
  }

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false)
  }

  // Announcements CRUD
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

  // Timetable CRUD - Changes directly update deterministic availability across the app
  const addTimetableEntry = (e: Omit<TimetableEntry, 'id'>) => {
    setTimetable(prev => [...prev, { ...e, id: Date.now().toString() }])
  }

  const updateTimetableEntry = (e: TimetableEntry) => {
    setTimetable(prev => prev.map(x => (x.id === e.id ? e : x)))
  }

  const deleteTimetableEntry = (id: string) => {
    setTimetable(prev => prev.filter(x => x.id !== id))
  }

  // Bookmark / Save room
  const toggleSaveRoom = (roomId: string) => {
    setSavedRooms(prev =>
      prev.includes(roomId) ? prev.filter(id => id !== roomId) : [...prev, roomId],
    )
  }

  const isRoomSaved = (roomId: string) => savedRooms.includes(roomId)

  return (
    <AppContext.Provider
      value={{
        isStudentLoggedIn,
        isAdminLoggedIn,
        currentStudent,
        announcements,
        timetable,
        savedRooms,
        loginStudent,
        signupStudent,
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
        toggleSaveRoom,
        isRoomSaved,
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
