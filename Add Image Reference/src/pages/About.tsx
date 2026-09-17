import { Link } from 'react-router-dom'
import { Search, Database, ShieldCheck, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import campusImg from '../assets/kr-mangalam-pic.png'

const cards = [
  {
    icon: Search,
    title: 'Student Search',
    desc: 'Students enter their desired block, date and time. SPACIA instantly shows which classrooms are free for the complete requested interval.',
  },
  {
    icon: Database,
    title: 'Smart Timetable',
    desc: 'SPACIA processes structured timetable information to determine availability — deterministically, not with guesswork or AI approximations.',
  },
  {
    icon: ShieldCheck,
    title: 'Admin Management',
    desc: 'Authorized administrators manage timetable data and announcements. Only admins can update classroom schedules.',
  },
]

export default function About() {
  return (
    <div className="min-h-screen bg-[#F4F7FF] flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${campusImg})` }}
        />
        <div className="absolute inset-0 bg-[#0F2557]/85" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <span className="inline-block text-xs font-mono text-white/50 uppercase tracking-widest mb-4">
            About
          </span>
          <h1 className="font-display text-5xl font-800 text-white mb-6">About SPACIA</h1>
          <p className="text-white/70 text-xl leading-relaxed max-w-2xl mx-auto">
            SPACIA helps K.R. Mangalam University students quickly find vacant classrooms using university timetable data.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="flex-1 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {cards.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl border border-[#D4DEFF] p-8 hover:border-[#2563EB]/30 hover:shadow-lg hover:shadow-[#2563EB]/5 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#E8EEFF] flex items-center justify-center mb-5">
                  <Icon size={20} className="text-[#2563EB]" />
                </div>
                <h3 className="font-display text-xl font-600 text-[#0F2557] mb-3">{title}</h3>
                <p className="text-[#6B7BA4] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Mission statement */}
          <div className="bg-white rounded-2xl border border-[#D4DEFF] p-10 text-center mb-16">
            <p className="text-xs font-mono text-[#6B7BA4] uppercase tracking-widest mb-4">Our Focus</p>
            <p className="font-display text-2xl font-600 text-[#0F2557] leading-relaxed max-w-2xl mx-auto">
              "Students find vacant classrooms quickly.<br />
              Admins keep timetable data updated."
            </p>
          </div>

          {/* Exclusions note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
            <div className="bg-[#E8EEFF] rounded-2xl p-6 border border-[#2563EB]/20">
              <h4 className="font-semibold text-[#0F2557] mb-2">What SPACIA Does</h4>
              <ul className="space-y-2 text-sm text-[#6B7BA4]">
                {[
                  'Schedule-based classroom availability',
                  'Search by block, date and time interval',
                  'Room details and timeline view',
                  'Admin timetable management',
                  'University announcements',
                ].map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#F4F7FF] rounded-2xl p-6 border border-[#D4DEFF]">
              <h4 className="font-semibold text-[#0F2557] mb-2">What SPACIA Doesn't Do</h4>
              <ul className="space-y-2 text-sm text-[#6B7BA4]">
                {[
                  'Real-time IoT occupancy sensing',
                  'Campus map navigation',
                  'Building directory browsing',
                  'AI-guessed availability',
                  'Student timetable uploads',
                ].map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0F2557] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl font-700 text-white mb-4">Find Your Space.</h2>
          <p className="text-white/60 mb-8">Start using SPACIA to find vacant classrooms at K.R. Mangalam University.</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl transition-all"
          >
            Student Login
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
