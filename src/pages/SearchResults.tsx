import { useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronLeft, MapPin, Clock, ArrowRight, AlertCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useApp } from '../context/AppContext'
import { calculateScheduleAvailability } from '../utils/timetableLogic'

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(`${dateStr}T12:00:00`)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function SearchResults() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { timetable } = useApp()

  const block = params.get('block') || 'Block B'
  const date = params.get('date') || '2026-09-17'
  const start = params.get('start') || '11:00 AM'
  const end = params.get('end') || '11:50 AM'

  // Deterministic timetable conflict calculation
  const { availableRooms } = calculateScheduleAvailability(timetable, block, date, start, end)

  return (
    <div className="min-h-screen bg-[#F4F7FF]">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Back */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-[#6B7BA4] hover:text-[#0F2557] text-sm mb-6 transition-colors group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </button>

        {/* Title + Summary */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-700 text-[#0F2557] mb-4">Available Classrooms</h1>

          <div className="inline-flex flex-wrap gap-2">
            {[block, formatDate(date), `${start} – ${end}`].map(tag => (
              <span
                key={tag}
                className="px-3.5 py-1.5 bg-white border border-[#D4DEFF] rounded-full text-sm font-medium text-[#0F2557]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <p className="text-[#6B7BA4] text-sm mb-6">
          {availableRooms.length} room{availableRooms.length !== 1 ? 's' : ''} available for the complete requested interval
        </p>

        {/* No Rooms Available State */}
        {availableRooms.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#D4DEFF] p-10 text-center max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={22} className="text-amber-600" />
            </div>
            <h3 className="font-display text-xl font-600 text-[#0F2557] mb-2">No Vacant Classrooms Found</h3>
            <p className="text-[#6B7BA4] text-sm leading-relaxed mb-6">
              All classrooms in {block} have scheduled classes overlapping {start} – {end}. Please try selecting a different time window or block.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2.5 bg-[#0F2557] hover:bg-[#1A3A8F] text-white text-sm font-semibold rounded-xl transition-all"
            >
              Modify Search
            </button>
          </div>
        ) : (
          /* Room Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {availableRooms.map(room => (
              <div
                key={room.id}
                className="bg-white rounded-2xl border border-[#D4DEFF] hover:border-[#16A34A]/40 hover:shadow-lg hover:shadow-[#16A34A]/5 transition-all p-6 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="font-mono text-xl font-600 text-[#0F2557]">{room.name}</span>
                    <div className="flex items-center gap-1 mt-0.5 text-xs text-[#6B7BA4]">
                      <MapPin size={11} />
                      {room.floor} · {room.seats} seats
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-[#16A34A] text-xs font-semibold rounded-full border border-green-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                    AVAILABLE
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={13} className="text-[#6B7BA4]" />
                    <span className="text-[#6B7BA4]">Free:</span>
                    <span className="font-mono font-medium text-[#0F2557]">
                      {room.freeFrom} – {room.freeTo}
                    </span>
                  </div>
                  <div className="text-xs text-[#6B7BA4]">
                    Next Class: <span className="text-[#0D1B3E] font-medium">{room.nextClass}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {room.features.map(f => (
                    <span
                      key={f}
                      className="text-xs px-2 py-0.5 bg-[#F4F7FF] text-[#6B7BA4] rounded border border-[#D4DEFF]"
                    >
                      {f}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() =>
                    navigate(
                      `/room/${room.id}?block=${encodeURIComponent(block)}&date=${date}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`,
                    )
                  }
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#F4F7FF] hover:bg-[#E8EEFF] text-[#0F2557] text-sm font-semibold rounded-xl border border-[#D4DEFF] hover:border-[#2563EB]/30 transition-all group-hover:bg-[#E8EEFF]"
                >
                  View Room
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
