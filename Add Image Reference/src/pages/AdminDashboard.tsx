import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { BookOpen, Users, Clock, Bell } from 'lucide-react'
import AdminSidebar from '../components/AdminSidebar'
import { useApp } from '../context/AppContext'

const usageData = [
  { hour: '8 AM', occupied: 18, free: 102 },
  { hour: '9 AM', occupied: 45, free: 75 },
  { hour: '10 AM', occupied: 72, free: 48 },
  { hour: '11 AM', occupied: 58, free: 62 },
  { hour: '12 PM', occupied: 35, free: 85 },
  { hour: '1 PM', occupied: 28, free: 92 },
  { hour: '2 PM', occupied: 61, free: 59 },
  { hour: '3 PM', occupied: 44, free: 76 },
  { hour: '4 PM', occupied: 20, free: 100 },
]

const recentUpdates = [
  { room: 'B-201', action: 'Schedule updated', subject: 'Mathematics', time: '2 hours ago' },
  { room: 'B-203', action: 'New class added', subject: 'DBMS', time: '4 hours ago' },
  { room: 'A-101', action: 'Class removed', subject: 'Calculus', time: 'Yesterday' },
  { room: 'C-302', action: 'Schedule updated', subject: 'Chemistry', time: 'Yesterday' },
]

export default function AdminDashboard() {
  const { timetable, announcements } = useApp()

  const stats = [
    { label: 'Total Classrooms', value: '120', icon: BookOpen, color: 'text-[#2563EB]', bg: 'bg-[#E8EEFF]' },
    { label: 'Available Today', value: '42', icon: Clock, color: 'text-[#16A34A]', bg: 'bg-green-50' },
    { label: 'Scheduled Classes', value: `${timetable.length}`, icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Active Announcements', value: `${announcements.length}`, icon: Bell, color: 'text-[#0F2557]', bg: 'bg-[#F4F7FF]' },
  ]

  return (
    <div className="flex min-h-screen bg-[#F4F7FF]">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-10">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-700 text-[#0F2557]">Admin Dashboard</h1>
            <p className="text-[#6B7BA4] text-sm mt-1">
              Manage classroom schedules and university announcements.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="bg-white rounded-2xl border border-[#D4DEFF] p-5">
                <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon size={16} className={color} />
                </div>
                <div className="font-display text-3xl font-700 text-[#0F2557] mb-1">{value}</div>
                <div className="text-xs text-[#6B7BA4]">{label}</div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-white rounded-2xl border border-[#D4DEFF] p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-lg font-600 text-[#0F2557]">Classroom Usage Overview</h2>
                <p className="text-xs text-[#6B7BA4] mt-0.5">Occupied vs available classrooms by hour</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-[#6B7BA4]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-[#2563EB]" /> Occupied
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-[#DBEAFE]" /> Free
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={usageData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF2FF" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#6B7BA4' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7BA4' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid #D4DEFF', borderRadius: 10, fontSize: 12 }}
                  cursor={{ fill: '#F4F7FF' }}
                />
                <Bar dataKey="occupied" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="free" fill="#DBEAFE" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Updates */}
          <div className="bg-white rounded-2xl border border-[#D4DEFF] p-6">
            <h2 className="font-display text-lg font-600 text-[#0F2557] mb-5">Recent Timetable Updates</h2>
            <div className="space-y-0">
              {recentUpdates.map((u, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between py-3.5 ${
                    i < recentUpdates.length - 1 ? 'border-b border-[#F4F7FF]' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-600 text-[#0F2557] w-14">{u.room}</span>
                    <div>
                      <p className="text-sm text-[#0D1B3E]">{u.action}</p>
                      <p className="text-xs text-[#6B7BA4]">{u.subject}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[#6B7BA4] font-mono">{u.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
