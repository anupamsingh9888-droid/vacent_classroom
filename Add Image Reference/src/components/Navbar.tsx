import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, LogOut } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isStudentLoggedIn, logoutStudent } = useApp()
  const navigate = useNavigate()
  const location = useLocation()

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Find Classroom', to: isStudentLoggedIn ? '/dashboard' : '/login' },
    { label: 'Announcements', to: '/announcements' },
    { label: 'About', to: '/about' },
  ]

  const isActive = (to: string) => location.pathname === to

  const handleLogout = () => {
    logoutStudent()
    navigate('/')
  }

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#D4DEFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#0F2557] flex items-center justify-center">
              <span className="text-white text-xs font-bold font-mono tracking-tight">S</span>
            </div>
            <span className="text-[#0F2557] font-display font-700 text-xl tracking-tight">SPACIA</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'bg-[#E8EEFF] text-[#0F2557]'
                    : 'text-[#6B7BA4] hover:text-[#0F2557] hover:bg-[#F4F7FF]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isStudentLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#6B7BA4] hover:text-[#DC2626] transition-colors"
              >
                <LogOut size={15} />
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-[#0F2557] hover:text-[#2563EB] transition-colors"
                >
                  Student Login
                </Link>
                <Link
                  to="/admin/login"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#0F2557] rounded-lg hover:bg-[#1A3A8F] transition-colors"
                >
                  Admin Login
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-[#0F2557] hover:bg-[#F4F7FF] transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-[#D4DEFF] px-4 py-4 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? 'bg-[#E8EEFF] text-[#0F2557]'
                  : 'text-[#6B7BA4] hover:text-[#0F2557] hover:bg-[#F4F7FF]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-[#D4DEFF] space-y-2">
            {isStudentLoggedIn ? (
              <button
                onClick={() => { handleLogout(); setMobileOpen(false) }}
                className="w-full px-4 py-3 text-sm font-medium text-[#DC2626] text-left"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-[#0F2557] hover:bg-[#F4F7FF] rounded-lg"
                >
                  Student Login
                </Link>
                <Link
                  to="/admin/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-white bg-[#0F2557] rounded-lg text-center"
                >
                  Admin Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
