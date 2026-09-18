import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
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

function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAdminLoggedIn } = useApp()
  const location = useLocation()

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<StudentLogin />} />
          <Route path="/signup" element={<StudentLogin initialMode="signup" />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/room/:id" element={<RoomDetails />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/about" element={<About />} />
          
          {/* Admin routes: strictly guarded, only authenticated admins can access */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/timetable"
            element={
              <AdminProtectedRoute>
                <AdminTimetable />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/announcements"
            element={
              <AdminProtectedRoute>
                <AdminAnnouncements />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/announcements/create"
            element={
              <AdminProtectedRoute>
                <CreateAnnouncement />
              </AdminProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
