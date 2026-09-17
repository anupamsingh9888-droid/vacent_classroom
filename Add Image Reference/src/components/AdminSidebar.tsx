import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Calendar, Bell, LogOut } from 'lucide-react'
import { useApp } from '../context/AppContext'

const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Timetable', to: '/admin/timetable', icon: Calendar },
  { label: 'Announcements', to: '/admin/announcements', icon: Bell },
]

export default function AdminSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logoutAdmin } = useApp()

  const handleLogout = () => {
    logoutAdmin()
    navigate('/admin/login')
  }

  return (
    <aside className="w-60 shrink-0 bg-[#0F2557] min-h-screen flex flex-col">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center">
            <span className="text-white text-xs font-bold font-mono">S</span>
          </div>
          <span className="font-display font-700 text-white text-lg tracking-tight">SPACIA</span>
        </div>
        <span className="text-white/40 text-xs font-medium uppercase tracking-widest">Admin Panel</span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ label, to, icon: Icon }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-white/15 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  )
}
