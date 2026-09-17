import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ChevronLeft, Bookmark, BookmarkCheck, MapPin, Users, Wind, Monitor, Presentation } from 'lucide-react'
import Navbar from '../components/Navbar'
import campusImg from '../assets/kr-mangalam-pic.png'
import { useApp } from '../context/AppContext'
import {
  UNIVERSITY_ROOMS,
  calculateScheduleAvailability,
  getRoomTimeline,
  getDayOfWeekFromDate,
  parseTimeToMinutes,
} from '../utils/timetableLogic'

const featureIcons: Record<string, React.FC<{ size: number; className?: string }>> = {
  AC: Wind,
  Projector: Monitor,
  'Smart Board': Presentation,
}

export default function RoomDetails() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { timetable, isRoomSaved, toggleSaveRoom } = useApp()

  const currentRoomId = id || 'B-203'
  const saved = isRoomSaved(currentRoomId)

  // Find room in university catalog or fallback
  const catalogRoom = UNIVERSITY_ROOMS.find(r => r.id.toUpperCase() === currentRoomId.toUpperCase()) || {
    id: currentRoomId,
    name: currentRoomId,
    block: currentRoomId.split('-')[0] || 'B',
    floor: '2nd Floor',
    seats: 60,
    features: ['AC', 'Projector'],
  }

  // Get requested search parameters
  const blockParam = searchParams.get('block') || `Block ${catalogRoom.block}`
  const dateParam = searchParams.get('date') || '2026-09-17'
  const startParam = searchParams.get('start') || '11:00 AM'
  const endParam = searchParams.get('end') || '11:50 AM'

  // Calculate schedule-based availability deterministically
  const { allRoomsInBlock } = calculateScheduleAvailability(
    timetable,
    blockParam,
    dateParam,
    startParam,
    endParam,
  )

  const evaluatedRoom = allRoomsInBlock.find(r => r.id.toUpperCase() === currentRoomId.toUpperCase())

  const status: 'AVAILABLE' | 'OCCUPIED' = evaluatedRoom ? evaluatedRoom.status : 'AVAILABLE'
  const freeFrom = evaluatedRoom ? evaluatedRoom.freeFrom : '11:00 AM'
  const freeTo = evaluatedRoom ? evaluatedRoom.freeTo : '12:40 PM'
  const nextClass = evaluatedRoom ? evaluatedRoom.nextClass : 'Physics at 12:40 PM'
  const nextTime = evaluatedRoom ? evaluatedRoom.nextTime : '12:40 PM'

  // Compute chronological room timeline
  const dayOfWeek = getDayOfWeekFromDate(dateParam)
  const reqStartMin = parseTimeToMinutes(startParam)
  const reqEndMin = parseTimeToMinutes(endParam)
  const timeline = getRoomTimeline(currentRoomId, timetable, dayOfWeek, reqStartMin, reqEndMin)

  return (
    <div className="min-h-screen bg-[#F4F7FF]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#6B7BA4] hover:text-[#0F2557] text-sm mb-6 transition-colors group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Results
        </button>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-4xl font-700 text-[#0F2557]">{catalogRoom.name}</span>
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border ${
                  status === 'AVAILABLE'
                    ? 'bg-green-50 text-[#16A34A] border-green-200'
                    : 'bg-red-50 text-[#DC2626] border-red-200'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    status === 'AVAILABLE' ? 'bg-[#16A34A]' : 'bg-[#DC2626]'
                  }`}
                />
                {status}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#6B7BA4] text-sm">
              <MapPin size={13} />
              Block {catalogRoom.block} · {catalogRoom.floor}
            </div>
          </div>

          <button
            onClick={() => toggleSaveRoom(currentRoomId)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
              saved
                ? 'bg-[#E8EEFF] border-[#2563EB]/30 text-[#2563EB]'
                : 'bg-white border-[#D4DEFF] text-[#6B7BA4] hover:border-[#2563EB]/30 hover:text-[#2563EB]'
            }`}
          >
            {saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
            {saved ? 'Saved' : 'Save Room'}
          </button>
        </div>

        {/* Campus Image */}
        <div className="relative rounded-2xl overflow-hidden h-56 sm:h-72 mb-8 bg-[#0F2557]">
          <img
            src={campusImg}
            alt="K.R. Mangalam University campus"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F2557]/60 to-transparent" />
          <div className="absolute bottom-4 left-5 text-white">
            <p className="text-xs font-mono opacity-60">K.R. Mangalam University</p>
            <p className="font-display text-lg font-600">
              Block {catalogRoom.block} · {catalogRoom.floor}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-3 space-y-5">
            {/* Availability */}
            <div className="bg-white rounded-2xl border border-[#D4DEFF] p-6">
              <h3 className="font-display text-base font-600 text-[#0F2557] mb-4">Availability</h3>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`rounded-xl p-4 border ${
                    status === 'AVAILABLE'
                      ? 'bg-green-50 border-green-100'
                      : 'bg-red-50 border-red-100'
                  }`}
                >
                  <p className="text-xs text-[#6B7BA4] mb-1">
                    {status === 'AVAILABLE' ? 'Available' : 'Status'}
                  </p>
                  <p
                    className={`font-mono font-600 text-sm ${
                      status === 'AVAILABLE' ? 'text-[#16A34A]' : 'text-[#DC2626]'
                    }`}
                  >
                    {status === 'AVAILABLE' ? `${freeFrom} – ${freeTo}` : 'Occupied'}
                  </p>
                </div>
                <div className="bg-[#F4F7FF] rounded-xl p-4 border border-[#D4DEFF]">
                  <p className="text-xs text-[#6B7BA4] mb-1">Next Class</p>
                  <p className="font-semibold text-[#0F2557] text-sm truncate">{nextClass}</p>
                  <p className="font-mono text-xs text-[#6B7BA4]">{nextTime}</p>
                </div>
              </div>
            </div>

            {/* Room Info */}
            <div className="bg-white rounded-2xl border border-[#D4DEFF] p-6">
              <h3 className="font-display text-base font-600 text-[#0F2557] mb-4">Room Information</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { icon: MapPin, label: 'Block', value: `Block ${catalogRoom.block}` },
                  { icon: MapPin, label: 'Floor', value: catalogRoom.floor },
                  { icon: Users, label: 'Seats', value: `${catalogRoom.seats} seats` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-[#F4F7FF] rounded-xl p-3 border border-[#D4DEFF]">
                    <Icon size={13} className="text-[#6B7BA4] mb-1" />
                    <p className="text-xs text-[#6B7BA4]">{label}</p>
                    <p className="text-sm font-medium text-[#0F2557] mt-0.5">{value}</p>
                  </div>
                ))}
                {catalogRoom.features.map(f => {
                  const Icon = featureIcons[f] || Wind
                  return (
                    <div key={f} className="bg-[#F4F7FF] rounded-xl p-3 border border-[#D4DEFF]">
                      <Icon size={13} className="text-[#6B7BA4] mb-1" />
                      <p className="text-xs text-[#6B7BA4]">Facility</p>
                      <p className="text-sm font-medium text-[#0F2557] mt-0.5">{f}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-[#D4DEFF] p-6 h-full">
              <h3 className="font-display text-base font-600 text-[#0F2557] mb-5">Today's Timeline</h3>
              <div className="space-y-0">
                {timeline.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full border-2 mt-0.5 shrink-0 ${
                          item.type === 'free'
                            ? 'border-[#16A34A] bg-[#16A34A]'
                            : item.type === 'next'
                            ? 'border-amber-400 bg-amber-400'
                            : 'border-[#D4DEFF] bg-white'
                        }`}
                      />
                      {i < timeline.length - 1 && <div className="w-px h-10 bg-[#D4DEFF] my-1" />}
                    </div>
                    <div className="pb-6 min-h-[3rem]">
                      <p className="font-mono text-xs text-[#6B7BA4]">{item.time}</p>
                      <p
                        className={`text-sm font-semibold mt-0.5 ${
                          item.type === 'free'
                            ? 'text-[#16A34A]'
                            : item.type === 'next'
                            ? 'text-amber-600'
                            : 'text-[#0F2557]'
                        }`}
                      >
                        {item.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-3 bg-white border border-[#D4DEFF] hover:border-[#2563EB]/30 text-[#0F2557] font-medium rounded-xl text-sm transition-all"
          >
            Back to Results
          </button>
          <button
            onClick={() => toggleSaveRoom(currentRoomId)}
            className="flex-1 py-3 bg-[#0F2557] hover:bg-[#1A3A8F] text-white font-medium rounded-xl text-sm transition-all"
          >
            {saved ? 'Room Saved ✓' : 'Save Room'}
          </button>
        </div>
      </div>
    </div>
  )
}
