import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import LandingPage from './pages/LandingPage'
import StudentLogin from './pages/StudentLogin'
import StudentDashboard from './pages/StudentDashboard'
import SearchResults from './pages/SearchResults'
import RoomDetails from './pages/RoomDetails'
import Announcements from './pages/Announcements'
import About from './pages/About'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminTimetable from './pages/AdminTimetable'
import AdminAnnouncements from './pages/AdminAnnouncements'
import CreateAnnouncement from './pages/CreateAnnouncement'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<StudentLogin />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/room/:id" element={<RoomDetails />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/timetable" element={<AdminTimetable />} />
          <Route path="/admin/announcements" element={<AdminAnnouncements />} />
          <Route path="/admin/announcements/create" element={<CreateAnnouncement />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
