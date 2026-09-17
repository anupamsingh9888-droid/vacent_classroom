import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Calendar, Bell, LogOut, Menu, X } from 'lucide-react'
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
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logoutAdmin()
    navigate('/admin/login')
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center">
              <span className="text-white text-xs font-bold font-mono">S</span>
            </div>
            <span className="font-display font-700 text-white text-lg tracking-tight">SPACIA</span>
          </div>
          <span className="text-white/40 text-xs font-medium uppercase tracking-widest">
            Admin Panel
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1 text-white/70 hover:text-white rounded-lg"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ label, to, icon: Icon }) => {
          const active = location.pathname === to || (to === '/admin/announcements' && location.pathname.startsWith('/admin/announcements'))
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
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
          className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#0F2557] px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center">
            <span className="text-white text-xs font-bold font-mono">S</span>
          </div>
          <span className="font-display font-700 text-white text-base">SPACIA Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 text-white/80 hover:text-white rounded-lg"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Backdrop & Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-64 bg-[#0F2557] h-full shadow-2xl z-10 flex flex-col">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 bg-[#0F2557] min-h-screen flex-col">
        {sidebarContent}
      </aside>
    </>
  )
}
