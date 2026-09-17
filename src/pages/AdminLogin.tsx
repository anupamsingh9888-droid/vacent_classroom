import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { isAdminLoggedIn, loginAdmin } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAdminLoggedIn) {
      navigate('/admin/dashboard', { replace: true })
    }
  }, [isAdminLoggedIn, navigate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter your admin email and password.')
      return
    }
    setError('')
    setLoading(true)
    setTimeout(() => {
      loginAdmin()
      navigate('/admin/dashboard')
    }, 900)
  }

  return (
    <div className="min-h-screen bg-[#0F2557] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <ShieldCheck size={20} className="text-[#60A5FA]" />
            </div>
            <span className="font-display font-700 text-white text-2xl tracking-tight">SPACIA ADMIN</span>
          </div>
          <p className="text-white/50 text-sm">K.R. Mangalam University</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
          <div className="mb-7">
            <h1 className="font-display text-2xl font-700 text-white mb-1">Admin Login</h1>
            <p className="text-white/50 text-sm">Authorized university administrators only.</p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@krmu.edu.in"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB]/50 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB]/50 transition pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-white/5 rounded-xl p-3 border border-white/10">
              <ShieldCheck size={14} className="text-white/40 mt-0.5 shrink-0" />
              <p className="text-white/40 text-xs">
                This portal is restricted to authorized university administrators only. Unauthorized access attempts are logged.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 text-white font-semibold rounded-xl transition-all group"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying…
                </span>
              ) : (
                <>
                  Admin Login
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <Link to="/login" className="text-white/50 hover:text-white/80 text-sm transition-colors">
              Student Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
