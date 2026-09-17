import { Bell } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useApp } from '../context/AppContext'

const priorityConfig: Record<string, { label: string; className: string; dot: string }> = {
  Normal: { label: 'Normal', className: 'bg-[#E8EEFF] text-[#1A3A8F]', dot: 'bg-[#2563EB]' },
  Important: { label: 'Important', className: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  Urgent: { label: 'Urgent', className: 'bg-red-50 text-red-700', dot: 'bg-red-500' },
}

export default function Announcements() {
  const { announcements, markAnnouncementRead } = useApp()

  return (
    <div className="min-h-screen bg-[#F4F7FF] flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#E8EEFF] flex items-center justify-center">
              <Bell size={18} className="text-[#2563EB]" />
            </div>
            <h1 className="font-display text-3xl font-700 text-[#0F2557]">Announcements</h1>
          </div>
          <p className="text-[#6B7BA4] text-sm ml-13 pl-[52px]">
            {announcements.filter(a => !a.isRead).length} unread · {announcements.length} total
          </p>
        </div>

        <div className="space-y-4">
          {announcements.map(a => {
            const config = priorityConfig[a.priority] || priorityConfig.Normal
            return (
              <div
                key={a.id}
                onClick={() => markAnnouncementRead(a.id)}
                className={`bg-white rounded-2xl border p-6 cursor-pointer transition-all hover:shadow-md ${
                  a.isRead ? 'border-[#D4DEFF]' : 'border-[#2563EB]/30 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${config.className}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                        {config.label}
                      </span>
                      {!a.isRead && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#2563EB]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
                          New
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-[#0F2557] mb-2">{a.title}</h3>
                    <p className="text-[#6B7BA4] text-sm leading-relaxed">{a.message}</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F4F7FF]">
                  <p className="text-xs text-[#6B7BA4]/70 font-mono">Posted: {a.publishDate}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <Footer />
    </div>
  )
}
