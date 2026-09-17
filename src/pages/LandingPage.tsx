import { Link } from 'react-router-dom'
import { Calendar, Clock, Search, ArrowRight, ChevronRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import campusImg from '../assets/kr-mangalam-pic.png'
import { useApp } from '../context/AppContext'

const features = [
  {
    icon: Calendar,
    title: 'Schedule Timetable Analysis',
    desc: 'SPACIA processes structured university timetable data to determine accurate classroom availability — deterministically, without guesswork.',
  },
  {
    icon: Clock,
    title: 'Instant Room Availability',
    desc: 'Get a list of vacant rooms for your exact time window in seconds. No phone calls, no wandering.',
  },
  {
    icon: Search,
    title: 'Simple Student Search',
    desc: 'Just pick a block, date, and time. SPACIA handles the rest and shows you exactly where you can go.',
  },
]

export default function LandingPage() {
  const { isStudentLoggedIn } = useApp()

  return (
    <div className="min-h-screen bg-[#F4F7FF]">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${campusImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F2557]/92 via-[#0F2557]/75 to-[#0F2557]/40" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-medium mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] animate-pulse" />
              K.R. Mangalam University · Gurugram
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-800 text-white leading-tight tracking-tight mb-6">
              Find Your<br />
              <span className="text-[#60A5FA]">Space.</span>
            </h1>

            <p className="text-white/80 text-lg sm:text-xl leading-relaxed mb-4 max-w-lg">
              Find a vacant classroom at K.R. Mangalam University in seconds.
            </p>
            <p className="text-white/55 text-base mb-10">
              Stop wasting your free period searching for an empty room.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={isStudentLoggedIn ? '/dashboard' : '/login'}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-[#2563EB]/25 group"
              >
                Find Vacant Classroom
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to={isStudentLoggedIn ? '/dashboard' : '/login'}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all"
              >
                {isStudentLoggedIn ? 'Open Dashboard' : 'Student Login'}
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex gap-6">
          {['120+ Classrooms', 'Real Timetable Data', 'Instant Results'].map(label => (
            <div key={label} className="flex items-center gap-2 text-white/60 text-sm">
              <span className="w-1 h-1 rounded-full bg-[#60A5FA]" />
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl font-700 text-[#0F2557] mb-4">
            How SPACIA Works
          </h2>
          <p className="text-[#6B7BA4] text-lg max-w-xl mx-auto">
            Schedule-based classroom availability powered by university timetable data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-8 border border-[#D4DEFF] hover:border-[#2563EB]/40 hover:shadow-lg hover:shadow-[#2563EB]/5 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#E8EEFF] flex items-center justify-center mb-6 group-hover:bg-[#2563EB] transition-colors">
                <Icon size={22} className="text-[#2563EB] group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-display text-xl font-600 text-[#0F2557] mb-3">{title}</h3>
              <p className="text-[#6B7BA4] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Band */}
      <section className="bg-[#0F2557] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl font-700 text-white mb-4">
            Ready to find your space?
          </h2>
          <p className="text-white/60 text-lg mb-8">
            Login with your student credentials to search for available classrooms right now.
          </p>
          <Link
            to={isStudentLoggedIn ? '/dashboard' : '/login'}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl transition-all hover:shadow-xl hover:shadow-[#2563EB]/30"
          >
            Get Started
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
