import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Footer() {
  const { isStudentLoggedIn, isAdminLoggedIn } = useApp()

  return (
    <footer className="bg-[#0F2557] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center">
                <span className="text-white text-xs font-bold font-mono">S</span>
              </div>
              <span className="font-display font-700 text-lg tracking-tight">SPACIA</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Find a vacant classroom at K.R. Mangalam University in seconds.
            </p>
            <p className="text-white/40 text-xs mt-3">
              K.R. Mangalam University<br />
              Sohna Road, Gurugram, Haryana
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', to: '/' },
                {
                  label: 'Find Classroom',
                  to: isStudentLoggedIn ? '/dashboard' : '/login',
                },
                { label: 'Announcements', to: '/announcements' },
                { label: 'About SPACIA', to: '/about' },
              ].map(link => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-4">
              Access
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to={isStudentLoggedIn ? '/dashboard' : '/login'}
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  {isStudentLoggedIn ? 'Student Dashboard' : 'Student Portal'}
                </Link>
              </li>
              <li>
                <Link
                  to={isAdminLoggedIn ? '/admin/dashboard' : '/admin/login'}
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  {isAdminLoggedIn ? 'Admin Dashboard' : 'Admin Portal'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs">
            © 2026 SPACIA · K.R. Mangalam University · Schedule-based classroom availability
          </p>
          <p className="text-white/30 text-xs font-mono">v1.0.0</p>
        </div>
      </div>
    </footer>
  )
}
