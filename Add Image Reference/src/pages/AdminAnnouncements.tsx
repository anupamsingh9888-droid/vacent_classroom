import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import AdminSidebar from '../components/AdminSidebar'
import { useApp, type Announcement } from '../context/AppContext'

const priorityConfig: Record<string, { className: string }> = {
  Normal: { className: 'bg-[#E8EEFF] text-[#1A3A8F]' },
  Important: { className: 'bg-amber-50 text-amber-700' },
  Urgent: { className: 'bg-red-50 text-red-700' },
}

function EditModal({
  announcement,
  onSave,
  onClose,
}: {
  announcement: Announcement
  onSave: (a: Announcement) => void
  onClose: () => void
}) {
  const [form, setForm] = useState(announcement)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-[#D4DEFF] w-full max-w-lg p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-lg font-600 text-[#0F2557]">Edit Announcement</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#6B7BA4] hover:bg-[#F4F7FF] transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#6B7BA4] mb-1">Title</label>
            <input
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-[#D4DEFF] bg-[#F4F7FF] text-sm text-[#0D1B3E] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B7BA4] mb-1">Message</label>
            <textarea
              value={form.message}
              onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-[#D4DEFF] bg-[#F4F7FF] text-sm text-[#0D1B3E] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B7BA4] mb-1">Priority</label>
            <select
              value={form.priority}
              onChange={e => setForm(p => ({ ...p, priority: e.target.value as Announcement['priority'] }))}
              className="w-full px-3 py-2.5 rounded-xl border border-[#D4DEFF] bg-[#F4F7FF] text-sm text-[#0D1B3E] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition"
            >
              {['Normal', 'Important', 'Urgent'].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-[#6B7BA4] hover:text-[#0F2557] transition-colors">
            Cancel
          </button>
          <button
            onClick={() => { onSave(form); onClose() }}
            className="px-5 py-2.5 text-sm font-medium text-white bg-[#0F2557] hover:bg-[#1A3A8F] rounded-xl transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminAnnouncements() {
  const { announcements, updateAnnouncement, deleteAnnouncement } = useApp()
  const [editing, setEditing] = useState<Announcement | null>(null)
  const [deletedId, setDeletedId] = useState('')

  const handleDelete = (id: string) => {
    setDeletedId(id)
    setTimeout(() => {
      deleteAnnouncement(id)
      setDeletedId('')
    }, 300)
  }

  return (
    <div className="flex min-h-screen bg-[#F4F7FF]">
      <AdminSidebar />

      {editing && (
        <EditModal
          announcement={editing}
          onSave={updateAnnouncement}
          onClose={() => setEditing(null)}
        />
      )}

      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-10">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-700 text-[#0F2557]">Manage Announcements</h1>
              <p className="text-[#6B7BA4] text-sm mt-1">
                {announcements.length} announcement{announcements.length !== 1 ? 's' : ''} published
              </p>
            </div>
            <Link
              to="/admin/announcements/create"
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#0F2557] rounded-xl hover:bg-[#1A3A8F] transition-all"
            >
              <Plus size={14} />
              Create Announcement
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-[#D4DEFF] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F4F7FF] border-b border-[#D4DEFF]">
                    {['Title', 'Message', 'Priority', 'Published', 'Status', 'Actions'].map(col => (
                      <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-[#6B7BA4] uppercase tracking-wider">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {announcements.map(a => (
                    <tr
                      key={a.id}
                      className={`border-b border-[#F4F7FF] hover:bg-[#F8FAFF] transition-all ${
                        deletedId === a.id ? 'opacity-0 scale-95' : 'opacity-100'
                      }`}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-[#0F2557] max-w-[160px] truncate">{a.title}</td>
                      <td className="px-4 py-3 text-xs text-[#6B7BA4] max-w-[200px] truncate">{a.message}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${priorityConfig[a.priority]?.className}`}>
                          {a.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#6B7BA4] font-mono whitespace-nowrap">{a.publishDate}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                          a.isRead ? 'bg-[#F4F7FF] text-[#6B7BA4]' : 'bg-[#E8EEFF] text-[#2563EB]'
                        }`}>
                          {a.isRead ? <Check size={11} /> : <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />}
                          {a.isRead ? 'Read' : 'Unread'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditing(a)}
                            className="p-1.5 rounded-lg text-[#6B7BA4] hover:text-[#2563EB] hover:bg-[#E8EEFF] transition-colors"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(a.id)}
                            className="p-1.5 rounded-lg text-[#6B7BA4] hover:text-[#DC2626] hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {announcements.length === 0 && (
                <div className="text-center py-12 text-[#6B7BA4] text-sm">
                  No announcements yet.{' '}
                  <Link to="/admin/announcements/create" className="text-[#2563EB] hover:underline">
                    Create one.
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
