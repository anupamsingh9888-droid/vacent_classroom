import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useApp } from '../context/AppContext'
import campusImg from '../assets/kr-mangalam-pic.png'

export default function StudentLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { isStudentLoggedIn, loginStudent } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    if (isStudentLoggedIn) {
      navigate('/dashboard', { replace: true })
    }
  }, [isStudentLoggedIn, navigate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter your email/ID and password.')
      return
    }
    setError('')
    setLoading(true)
    setTimeout(() => {
      loginStudent()
      navigate('/dashboard')
    }, 900)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${campusImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F2557]/90 via-[#1A3A8F]/80 to-[#0F2557]/70" />

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <span className="text-white text-xs font-bold font-mono">S</span>
            </div>
            <span className="font-display font-700 text-white text-xl tracking-tight">SPACIA</span>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-4">
            K.R. Mangalam University
          </p>
          <h2 className="font-display text-4xl font-700 text-white leading-tight mb-3">
            Your free period.<br />Your space.
          </h2>
          <p className="text-white/60 text-base leading-relaxed max-w-sm">
            Stop searching. SPACIA instantly shows you which classrooms are free for your exact time window.
          </p>
        </div>

        <div className="relative z-10 flex gap-6">
          {[['120+', 'Classrooms'], ['4', 'Blocks'], ['100%', 'Schedule-Based']].map(([val, label]) => (
            <div key={label}>
              <div className="text-2xl font-display font-700 text-white">{val}</div>
              <div className="text-white/50 text-xs">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-[#F4F7FF]">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-[#0F2557] flex items-center justify-center">
              <span className="text-white text-xs font-bold font-mono">S</span>
            </div>
            <span className="font-display font-700 text-[#0F2557] text-xl tracking-tight">SPACIA</span>
          </div>

          <div className="bg-white rounded-2xl border border-[#D4DEFF] p-8 shadow-sm">
            <div className="mb-8">
              <h1 className="font-display text-3xl font-700 text-[#0F2557] mb-1">Student Login</h1>
              <p className="text-[#6B7BA4] text-sm">K.R. Mangalam University</p>
            </div>

            {error && (
              <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#0D1B3E] mb-1.5">
                  Student Email / Student ID
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. 2023KRM001 or name@krmu.edu.in"
                  className="w-full px-4 py-3 rounded-xl border border-[#D4DEFF] bg-[#F4F7FF] text-[#0D1B3E] text-sm placeholder:text-[#6B7BA4]/60 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0D1B3E] mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 rounded-xl border border-[#D4DEFF] bg-[#F4F7FF] text-[#0D1B3E] text-sm placeholder:text-[#6B7BA4]/60 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7BA4] hover:text-[#0F2557] transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#2563EB]"
                  />
                  <span className="text-sm text-[#6B7BA4]">Remember me</span>
                </label>
                <button type="button" className="text-sm text-[#2563EB] hover:underline">
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0F2557] hover:bg-[#1A3A8F] disabled:opacity-60 text-white font-semibold rounded-xl transition-all group"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  <>
                    Login
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#D4DEFF] text-center">
              <p className="text-sm text-[#6B7BA4]">
                Are you an admin?{' '}
                <Link to="/admin/login" className="text-[#2563EB] font-medium hover:underline">
                  Admin Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
