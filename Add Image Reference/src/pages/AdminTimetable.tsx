import { useState } from 'react'
import { Upload, Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import AdminSidebar from '../components/AdminSidebar'
import { useApp, type TimetableEntry } from '../context/AppContext'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const BLOCKS = ['A', 'B', 'C', 'D']

function EntryRow({
  entry,
  onEdit,
  onDelete,
}: {
  entry: TimetableEntry
  onEdit: (e: TimetableEntry) => void
  onDelete: (id: string) => void
}) {
  return (
    <tr className="border-b border-[#F4F7FF] hover:bg-[#F8FAFF] transition-colors">
      <td className="px-4 py-3 font-mono text-sm font-600 text-[#0F2557]">{entry.room}</td>
      <td className="px-4 py-3 text-sm text-[#0D1B3E]">Block {entry.block}</td>
      <td className="px-4 py-3 text-sm text-[#6B7BA4]">{entry.day}</td>
      <td className="px-4 py-3 font-mono text-xs text-[#6B7BA4]">{entry.startTime}</td>
      <td className="px-4 py-3 font-mono text-xs text-[#6B7BA4]">{entry.endTime}</td>
      <td className="px-4 py-3 text-sm text-[#0D1B3E]">{entry.subject}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(entry)}
            className="p-1.5 rounded-lg text-[#6B7BA4] hover:text-[#2563EB] hover:bg-[#E8EEFF] transition-colors"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete(entry.id)}
            className="p-1.5 rounded-lg text-[#6B7BA4] hover:text-[#DC2626] hover:bg-red-50 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </tr>
  )
}

const emptyForm = { room: '', block: 'B', day: 'Monday', startTime: '09:00', endTime: '10:00', subject: '' }

export default function AdminTimetable() {
  const { timetable, addTimetableEntry, updateTimetableEntry, deleteTimetableEntry } = useApp()

  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'done'>('idle')
  const [dragging, setDragging] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [successMsg, setSuccessMsg] = useState('')

  const handleUpload = () => {
    setUploadState('uploading')
    setTimeout(() => {
      setUploadState('done')
      setTimeout(() => setUploadState('idle'), 3000)
    }, 1500)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    handleUpload()
  }

  const startEdit = (entry: TimetableEntry) => {
    setEditingId(entry.id)
    setForm({ room: entry.room, block: entry.block, day: entry.day, startTime: entry.startTime, endTime: entry.endTime, subject: entry.subject })
    setShowForm(true)
  }

  const handleSave = () => {
    if (!form.room || !form.subject) return
    if (editingId) {
      updateTimetableEntry({ ...form, id: editingId })
      setSuccessMsg('✓ Timetable updated successfully.')
    } else {
      addTimetableEntry(form)
      setSuccessMsg('✓ Schedule added successfully.')
    }
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  return (
    <div className="flex min-h-screen bg-[#F4F7FF]">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-700 text-[#0F2557]">Manage Timetable</h1>
              <p className="text-[#6B7BA4] text-sm mt-1">Upload or manually update university classroom schedules.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleUpload}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#0F2557] bg-white border border-[#D4DEFF] rounded-xl hover:border-[#2563EB]/40 transition-all"
              >
                <Upload size={14} />
                Upload Timetable
              </button>
              <button
                onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm) }}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#0F2557] rounded-xl hover:bg-[#1A3A8F] transition-all"
              >
                <Plus size={14} />
                Add Schedule
              </button>
            </div>
          </div>

          {successMsg && (
            <div className="mb-5 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2">
              <Check size={14} /> {successMsg}
            </div>
          )}

          {/* Upload Area */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`bg-white rounded-2xl border-2 border-dashed p-8 mb-6 text-center transition-all ${
              dragging ? 'border-[#2563EB] bg-[#E8EEFF]/50' : 'border-[#D4DEFF] hover:border-[#2563EB]/40'
            }`}
          >
            {uploadState === 'uploading' ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-[#2563EB]/30 border-t-[#2563EB] rounded-full animate-spin" />
                <p className="text-[#6B7BA4] text-sm">Processing timetable file…</p>
              </div>
            ) : uploadState === 'done' ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                  <Check size={18} className="text-[#16A34A]" />
                </div>
                <p className="text-[#16A34A] font-medium text-sm">✓ Timetable successfully processed.</p>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-[#E8EEFF] flex items-center justify-center mx-auto mb-4">
                  <Upload size={20} className="text-[#2563EB]" />
                </div>
                <p className="font-medium text-[#0F2557] mb-1">Upload University Timetable</p>
                <p className="text-[#6B7BA4] text-sm mb-3">Drag & drop timetable file here</p>
                <p className="text-xs text-[#6B7BA4]/70 mb-4">Supported: PDF · Excel · CSV</p>
                <button
                  onClick={handleUpload}
                  className="px-5 py-2 bg-[#E8EEFF] hover:bg-[#2563EB] hover:text-white text-[#2563EB] text-sm font-medium rounded-lg transition-all"
                >
                  Choose File
                </button>
              </>
            )}
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div className="bg-white rounded-2xl border border-[#D4DEFF] p-6 mb-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-lg font-600 text-[#0F2557]">
                  {editingId ? 'Edit Schedule' : 'Add New Schedule'}
                </h3>
                <button
                  onClick={() => { setShowForm(false); setEditingId(null) }}
                  className="p-1.5 rounded-lg text-[#6B7BA4] hover:text-[#0F2557] hover:bg-[#F4F7FF] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Room', field: 'room', type: 'text', placeholder: 'e.g. B-201' },
                  { label: 'Subject', field: 'subject', type: 'text', placeholder: 'e.g. Mathematics' },
                ].map(({ label, field, type, placeholder }) => (
                  <div key={field}>
                    <label className="block text-xs font-medium text-[#6B7BA4] mb-1">{label}</label>
                    <input
                      type={type}
                      value={form[field as keyof typeof form]}
                      onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#D4DEFF] bg-[#F4F7FF] text-[#0D1B3E] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-[#6B7BA4] mb-1">Block</label>
                  <select
                    value={form.block}
                    onChange={e => setForm(prev => ({ ...prev, block: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#D4DEFF] bg-[#F4F7FF] text-[#0D1B3E] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition"
                  >
                    {BLOCKS.map(b => <option key={b} value={b}>Block {b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6B7BA4] mb-1">Day</label>
                  <select
                    value={form.day}
                    onChange={e => setForm(prev => ({ ...prev, day: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#D4DEFF] bg-[#F4F7FF] text-[#0D1B3E] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition"
                  >
                    {DAYS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6B7BA4] mb-1">Start Time</label>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={e => setForm(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#D4DEFF] bg-[#F4F7FF] text-[#0D1B3E] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6B7BA4] mb-1">End Time</label>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={e => setForm(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#D4DEFF] bg-[#F4F7FF] text-[#0D1B3E] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={() => { setShowForm(false); setEditingId(null) }}
                  className="px-4 py-2.5 text-sm font-medium text-[#6B7BA4] hover:text-[#0F2557] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-[#0F2557] hover:bg-[#1A3A8F] rounded-xl transition-all"
                >
                  {editingId ? 'Update Schedule' : 'Add Schedule'}
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="bg-white rounded-2xl border border-[#D4DEFF] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F4F7FF] border-b border-[#D4DEFF]">
                    {['Room', 'Block', 'Day', 'Start', 'End', 'Subject', 'Action'].map(col => (
                      <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-[#6B7BA4] uppercase tracking-wider">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timetable.map(entry => (
                    <EntryRow
                      key={entry.id}
                      entry={entry}
                      onEdit={startEdit}
                      onDelete={deleteTimetableEntry}
                    />
                  ))}
                </tbody>
              </table>
              {timetable.length === 0 && (
                <div className="text-center py-12 text-[#6B7BA4] text-sm">
                  No schedules yet. Add one above or upload a timetable file.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
