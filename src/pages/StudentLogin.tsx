import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, UserPlus, LogIn, CheckCircle2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import campusImg from '../assets/kr-mangalam-pic.png'

interface StudentLoginProps {
  initialMode?: 'login' | 'signup'
}

export default function StudentLogin({ initialMode }: StudentLoginProps) {
  const [searchParams] = useSearchParams()
  const modeParam = searchParams.get('mode')
  const defaultMode = modeParam === 'signup' || initialMode === 'signup' ? 'signup' : 'login'

  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode)

  // Login form state
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)

  // Signup form state
  const [fullName, setFullName] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(true)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [signupSuccess, setSignupSuccess] = useState(false)

  const { isStudentLoggedIn, loginStudent, signupStudent } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    if (isStudentLoggedIn) {
      navigate('/dashboard', { replace: true })
    }
  }, [isStudentLoggedIn, navigate])

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier.trim() || !password) {
      setError('Please enter your name or email and password.')
      return
    }
    setError('')
    setLoading(true)
    setTimeout(() => {
      loginStudent({
        name: identifier.includes('@') ? identifier.split('@')[0].replace('.', ' ') : identifier.trim(),
        email: identifier.includes('@') ? identifier.trim() : undefined,
      })
      navigate('/dashboard')
    }, 700)
  }

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim()) {
      setError('Please enter your full name.')
      return
    }
    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }
    if (signupPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify.')
      return
    }
    if (!agreeTerms) {
      setError('Please confirm classroom use guidelines.')
      return
    }

    setError('')
    setLoading(true)
    setTimeout(() => {
      signupStudent({
        name: fullName.trim(),
      })
      setSignupSuccess(true)
      setTimeout(() => {
        navigate('/dashboard')
      }, 500)
    }, 800)
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
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <span className="text-white text-xs font-bold font-mono">S</span>
            </div>
            <span className="font-display font-700 text-white text-xl tracking-tight">SPACIA</span>
          </Link>
        </div>

        <div className="relative z-10">
          <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-4">
            K.R. Mangalam University
          </p>
          <h2 className="font-display text-4xl font-700 text-white leading-tight mb-3">
            {mode === 'signup' ? 'Join SPACIA Campus.' : 'Your free period.\nYour space.'}
          </h2>
          <p className="text-white/60 text-base leading-relaxed max-w-sm">
            {mode === 'signup'
              ? 'Create your verified student account to explore real-time vacant classrooms and study spots across campus.'
              : 'Stop searching. SPACIA instantly shows you which classrooms are free for your exact time window.'}
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-[#F4F7FF]">
        <div className="w-full max-w-md my-auto">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between gap-2 mb-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0F2557] flex items-center justify-center">
                <span className="text-white text-xs font-bold font-mono">S</span>
              </div>
              <span className="font-display font-700 text-[#0F2557] text-xl tracking-tight">SPACIA</span>
            </Link>
            <span className="text-xs font-mono text-[#6B7BA4]">K.R. Mangalam University</span>
          </div>

          <div className="bg-white rounded-2xl border border-[#D4DEFF] p-6 sm:p-8 shadow-sm">
            {/* Mode Switcher Tabs */}
            <div className="flex p-1 bg-[#F4F7FF] rounded-xl border border-[#D4DEFF] mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode('login')
                  setError('')
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-[#0F2557] shadow-sm'
                    : 'text-[#6B7BA4] hover:text-[#0F2557]'
                }`}
              >
                <LogIn size={15} />
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup')
                  setError('')
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white text-[#0F2557] shadow-sm'
                    : 'text-[#6B7BA4] hover:text-[#0F2557]'
                }`}
              >
                <UserPlus size={15} />
                Sign Up
              </button>
            </div>

            {/* Header Text */}
            <div className="mb-6">
              <h1 className="font-display text-2xl sm:text-3xl font-700 text-[#0F2557] mb-1">
                {mode === 'login' ? 'Student Login' : 'Create Student Account'}
              </h1>
              <p className="text-[#6B7BA4] text-xs sm:text-sm">
                {mode === 'login'
                  ? 'K.R. Mangalam University · Student Portal'
                  : 'Register with your student details to find free classrooms'}
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Success message */}
            {signupSuccess && (
              <div className="mb-5 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>Account created successfully! Loading your dashboard…</span>
              </div>
            )}

            {/* SIGN IN FORM */}
            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#0D1B3E] mb-1.5">
                    Name or Email
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder="Enter your name or email"
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7BA4] hover:text-[#0F2557] transition-colors cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={e => setRemember(e.target.checked)}
                      className="w-4 h-4 rounded accent-[#2563EB]"
                    />
                    <span className="text-xs sm:text-sm text-[#6B7BA4]">Remember me</span>
                  </label>
                  <button type="button" className="text-xs sm:text-sm text-[#2563EB] hover:underline">
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0F2557] hover:bg-[#1A3A8F] disabled:opacity-60 text-white font-semibold rounded-xl transition-all group cursor-pointer mt-2"
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

                <div className="pt-2 text-center">
                  <span className="text-xs sm:text-sm text-[#6B7BA4]">
                    Don't have a student account?{' '}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup')
                      setError('')
                    }}
                    className="text-xs sm:text-sm text-[#2563EB] font-semibold hover:underline cursor-pointer"
                  >
                    Sign Up here
                  </button>
                </div>
              </form>
            ) : (
              /* SIGN UP FORM */
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#0D1B3E] mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl border border-[#D4DEFF] bg-[#F4F7FF] text-[#0D1B3E] text-sm placeholder:text-[#6B7BA4]/60 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0D1B3E] mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signupPassword}
                      onChange={e => setSignupPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full px-4 py-3 rounded-xl border border-[#D4DEFF] bg-[#F4F7FF] text-[#0D1B3E] text-sm placeholder:text-[#6B7BA4]/60 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7BA4] hover:text-[#0F2557] cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0D1B3E] mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-4 py-3 rounded-xl border border-[#D4DEFF] bg-[#F4F7FF] text-[#0D1B3E] text-sm placeholder:text-[#6B7BA4]/60 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition"
                  />
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={e => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded accent-[#2563EB] shrink-0"
                    />
                    <span className="text-xs text-[#6B7BA4] leading-snug">
                      I agree to use vacant classrooms respectfully according to university guidelines.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 text-white font-semibold rounded-xl transition-all group cursor-pointer mt-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Account…
                    </span>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      Create Student Account
                    </>
                  )}
                </button>

                <div className="pt-2 text-center">
                  <span className="text-xs sm:text-sm text-[#6B7BA4]">
                    Already have a student account?{' '}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login')
                      setError('')
                    }}
                    className="text-xs sm:text-sm text-[#2563EB] font-semibold hover:underline cursor-pointer"
                  >
                    Sign In here
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 pt-5 border-t border-[#D4DEFF] text-center">
              <p className="text-xs sm:text-sm text-[#6B7BA4]">
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
