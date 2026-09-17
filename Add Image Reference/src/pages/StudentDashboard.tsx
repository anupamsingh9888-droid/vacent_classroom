import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, BookOpen, ChevronRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useApp } from '../context/AppContext'

const BLOCKS = ['Block A', 'Block B', 'Block C', 'Block D']
const TIMES = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '09:10 AM',
  '10:00 AM', '10:30 AM', '10:50 AM', '11:00 AM', '11:30 AM', '11:50 AM',
  '12:00 PM', '12:30 PM', '12:40 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
]

export default function StudentDashboard() {
  const [block, setBlock] = useState('Block B')
  const [date, setDate] = useState('2026-09-17')
  const [startTime, setStartTime] = useState('11:00 AM')
  const [endTime, setEndTime] = useState('11:50 AM')
  const navigate = useNavigate()
  const { announcements } = useApp()

  const unread = announcements.filter(a => !a.isRead)
  const recentAnnouncements = announcements.slice(0, 2)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/search?block=${encodeURIComponent(block)}&date=${date}&start=${encodeURIComponent(startTime)}&end=${encodeURIComponent(endTime)}`)
  }

  const priorityColor: Record<string, string> = {
    Normal: 'bg-[#E8EEFF] text-[#1A3A8F]',
    Important: 'bg-amber-50 text-amber-700',
    Urgent: 'bg-red-50 text-red-700',
  }

  return (
    <div className="min-h-screen bg-[#F4F7FF]">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-700 text-[#0F2557] mb-1">
            Hello, Student 👋
          </h1>
          <p className="text-[#6B7BA4]">Need a place to sit during your free period?</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-[#D4DEFF] p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#E8EEFF] flex items-center justify-center">
                  <Search size={18} className="text-[#2563EB]" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-600 text-[#0F2557]">Find a Vacant Classroom</h2>
                  <p className="text-[#6B7BA4] text-xs">Select your block, date and time window</p>
                </div>
              </div>

              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#0D1B3E] mb-1.5">Block</label>
                  <select
                    value={block}
                    onChange={e => setBlock(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#D4DEFF] bg-[#F4F7FF] text-[#0D1B3E] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition"
                  >
                    {BLOCKS.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0D1B3E] mb-1.5">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#D4DEFF] bg-[#F4F7FF] text-[#0D1B3E] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0D1B3E] mb-1.5">Start Time</label>
                    <select
                      value={startTime}
                      onChange={e => setStartTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#D4DEFF] bg-[#F4F7FF] text-[#0D1B3E] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition"
                    >
                      {TIMES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0D1B3E] mb-1.5">End Time</label>
                    <select
                      value={endTime}
                      onChange={e => setEndTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#D4DEFF] bg-[#F4F7FF] text-[#0D1B3E] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition"
                    >
                      {TIMES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-[#6B7BA4] mb-3 font-mono">
                    Example: Block B · 17 Sep 2026 · 11:00 AM – 11:50 AM
                  </p>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-[#2563EB]/25 group"
                  >
                    <Search size={16} />
                    Find Available Rooms
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Availability stat */}
            <div className="bg-white rounded-2xl border border-[#D4DEFF] p-6 shadow-sm">
              <p className="text-xs font-medium text-[#6B7BA4] uppercase tracking-wider mb-3">Today's Availability</p>
              <div className="flex items-end gap-2 mb-1">
                <span className="font-display text-5xl font-800 text-[#16A34A]">12</span>
                <span className="text-[#6B7BA4] text-sm mb-2">rooms available</span>
              </div>
              <div className="w-full bg-[#F4F7FF] rounded-full h-2 mt-3">
                <div className="bg-[#16A34A] h-2 rounded-full" style={{ width: '42%' }} />
              </div>
              <p className="text-xs text-[#6B7BA4] mt-2">12 of 28 classrooms in Block B free now</p>
            </div>

            {/* Unread notification */}
            {unread.length > 0 && (
              <div className="bg-[#E8EEFF] rounded-2xl border border-[#2563EB]/20 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Bell size={14} className="text-[#2563EB]" />
                  <span className="text-sm font-semibold text-[#0F2557]">
                    {unread.length} unread announcement{unread.length > 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-xs text-[#6B7BA4] ml-5">Check the Announcements page</p>
              </div>
            )}
          </div>
        </div>

        {/* Announcements Preview */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-600 text-[#0F2557] flex items-center gap-2">
              <BookOpen size={18} className="text-[#2563EB]" />
              Recent Announcements
            </h3>
            <a href="/announcements" className="text-sm text-[#2563EB] hover:underline flex items-center gap-1">
              View all <ChevronRight size={14} />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentAnnouncements.map(a => (
              <div
                key={a.id}
                className={`bg-white rounded-xl border p-5 relative ${a.isRead ? 'border-[#D4DEFF]' : 'border-[#2563EB]/30'}`}
              >
                {!a.isRead && (
                  <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#2563EB]" />
                )}
                <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full mb-3 ${priorityColor[a.priority]}`}>
                  {a.priority}
                </span>
                <h4 className="font-semibold text-[#0F2557] text-sm mb-1">{a.title}</h4>
                <p className="text-[#6B7BA4] text-xs leading-relaxed line-clamp-2">{a.message}</p>
                <p className="text-[#6B7BA4]/60 text-xs mt-3 font-mono">{a.publishDate}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
