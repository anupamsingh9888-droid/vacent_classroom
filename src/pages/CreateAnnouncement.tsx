import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronLeft } from 'lucide-react'
import AdminSidebar from '../components/AdminSidebar'
import { useApp } from '../context/AppContext'

export default function CreateAnnouncement() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [priority, setPriority] = useState<'Normal' | 'Important' | 'Urgent'>('Normal')
  const [publishDate, setPublishDate] = useState('2026-09-17')
  const [published, setPublished] = useState(false)
  const { addAnnouncement } = useApp()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !message) return
    const d = new Date(publishDate)
    const formatted = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    addAnnouncement({ title, message, priority, publishDate: formatted })
    setPublished(true)
    setTimeout(() => navigate('/admin/announcements'), 1800)
  }

  const priorityColors: Record<string, string> = {
    Normal: 'border-[#2563EB] bg-[#E8EEFF] text-[#1A3A8F]',
    Important: 'border-amber-400 bg-amber-50 text-amber-700',
    Urgent: 'border-red-400 bg-red-50 text-red-700',
  }

  return (
    <div className="flex min-h-screen bg-[#F4F7FF]">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto px-6 lg:px-10 py-10">
          <button
            onClick={() => navigate('/admin/announcements')}
            className="flex items-center gap-2 text-[#6B7BA4] hover:text-[#0F2557] text-sm mb-6 transition-colors group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Announcements
          </button>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-700 text-[#0F2557]">Create Announcement</h1>
            <p className="text-[#6B7BA4] text-sm mt-1">Publish an announcement to the student portal.</p>
          </div>

          {published && (
            <div className="mb-6 px-5 py-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <Check size={16} className="text-[#16A34A]" />
              </div>
              <div>
                <p className="font-medium text-sm">✓ Announcement published successfully.</p>
                <p className="text-xs text-green-600 mt-0.5">Redirecting to announcements…</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-[#D4DEFF] p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#0D1B3E] mb-1.5">
                  Announcement Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Block B Revised Schedule"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#D4DEFF] bg-[#F4F7FF] text-[#0D1B3E] text-sm placeholder:text-[#6B7BA4]/60 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0D1B3E] mb-1.5">
                  Announcement Message
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Write the full announcement message here…"
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-[#D4DEFF] bg-[#F4F7FF] text-[#0D1B3E] text-sm placeholder:text-[#6B7BA4]/60 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0D1B3E] mb-2">Priority</label>
                <div className="flex gap-3">
                  {(['Normal', 'Important', 'Urgent'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                        priority === p
                          ? priorityColors[p]
                          : 'border-[#D4DEFF] bg-white text-[#6B7BA4] hover:border-[#D4DEFF]/70'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0D1B3E] mb-1.5">Publish Date</label>
                <input
                  type="date"
                  value={publishDate}
                  onChange={e => setPublishDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#D4DEFF] bg-[#F4F7FF] text-[#0D1B3E] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={published || !title || !message}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0F2557] hover:bg-[#1A3A8F] disabled:opacity-50 text-white font-semibold rounded-xl transition-all"
                >
                  {published ? (
                    <><Check size={16} /> Published</>
                  ) : (
                    'Publish Announcement'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
