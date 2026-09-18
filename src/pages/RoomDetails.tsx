import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  ChevronLeft,
  Bookmark,
  BookmarkCheck,
  MapPin,
  Users,
  Wind,
  Monitor,
  Presentation,
  Maximize2,
  X,
  Layers,
  Building2,
  CheckCircle2
} from 'lucide-react'
import Navbar from '../components/Navbar'
import campusImg from '../assets/kr-mangalam-pic.png'
import classroomRefSvg from '../assets/kr-mangalam-classroom.svg'
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

  // View mode: classroom reference (default) or building exterior
  const [viewMode, setViewMode] = useState<'classroom' | 'building'>('classroom')
  const [isZoomed, setIsZoomed] = useState(false)

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

        {/* Classroom & Campus Reference Visual Card */}
        <div className="relative rounded-2xl overflow-hidden mb-8 border border-[#D4DEFF] bg-[#0F2557] shadow-sm group">
          <div className="relative h-64 sm:h-84 md:h-96 w-full bg-[#0D1B3E] flex items-center justify-center overflow-hidden">
            {viewMode === 'classroom' ? (
              <img
                src={classroomRefSvg}
                alt={`Classroom ${catalogRoom.name} reference`}
                className="w-full h-full object-cover select-none transition-transform duration-500 group-hover:scale-[1.01]"
              />
            ) : (
              <img
                src={campusImg}
                alt="K.R. Mangalam University campus exterior"
                className="w-full h-full object-cover select-none transition-transform duration-500 group-hover:scale-[1.01]"
              />
            )}

            {/* Subtle Lighting Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F2557]/85 via-[#0F2557]/20 to-black/30 pointer-events-none" />

            {/* Top Bar: View Mode Switcher Pills */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <div className="flex bg-black/50 backdrop-blur-md p-1 rounded-xl border border-white/15">
                <button
                  type="button"
                  onClick={() => setViewMode('classroom')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === 'classroom'
                      ? 'bg-[#2563EB] text-white shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Layers size={13} />
                  Classroom View
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('building')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === 'building'
                      ? 'bg-[#2563EB] text-white shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Building2 size={13} />
                  Campus Block
                </button>
              </div>

              {/* Fullscreen Zoom */}
              <button
                type="button"
                onClick={() => setIsZoomed(true)}
                title="Inspect classroom in full resolution"
                className="p-2 rounded-xl bg-black/50 hover:bg-black/70 backdrop-blur-md text-white/90 hover:text-white border border-white/15 transition cursor-pointer"
              >
                <Maximize2 size={15} />
              </button>
            </div>

            {/* Top Left: Reference Label */}
            <div className="absolute top-4 left-4 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/50 backdrop-blur-md border border-white/15 text-white text-xs font-medium">
                <CheckCircle2 size={13} className="text-[#38BDF8]" />
                {viewMode === 'classroom' ? 'Classroom Reference' : 'Campus Building'}
              </span>
            </div>

            {/* Bottom Overlay: Room Info */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 z-10">
              <div className="text-white">
                <p className="text-xs font-mono text-white/75 tracking-wider uppercase mb-1">
                  K.R. Mangalam University · Block {catalogRoom.block}
                </p>
                <h2 className="font-display text-xl sm:text-2xl font-700 text-white leading-tight">
                  {catalogRoom.name} — {viewMode === 'classroom' ? 'Tiered Lecture Theatre' : 'Academic Wing'}
                </h2>
                <p className="text-xs text-white/80 mt-1 max-w-lg">
                  {viewMode === 'classroom'
                    ? 'Stepped wooden desks, natural daylight windows & smart presentation setup.'
                    : `Located in Block ${catalogRoom.block} · ${catalogRoom.floor}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Fullscreen Photo Inspection Modal */}
        {isZoomed && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-6"
            onClick={() => setIsZoomed(false)}
          >
            <div
              className="relative max-w-5xl w-full bg-[#0D1B3E] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0F2557]">
                <div>
                  <h3 className="font-display text-base font-600 text-white">
                    Classroom Reference: {catalogRoom.name}
                  </h3>
                  <p className="text-xs text-white/60">
                    K.R. Mangalam University · Tiered Lecture Hall Layout
                  </p>
                </div>
                <button
                  onClick={() => setIsZoomed(false)}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Image */}
              <div className="relative bg-black flex items-center justify-center max-h-[70vh] overflow-hidden">
                <img
                  src={viewMode === 'classroom' ? classroomRefSvg : campusImg}
                  alt={`Enlarged view of ${catalogRoom.name}`}
                  className="w-full h-full object-contain max-h-[70vh]"
                />
              </div>

              {/* Modal Footer Notes */}
              <div className="px-6 py-4 bg-[#0F2557] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-white/75">
                <div className="flex items-center gap-4">
                  <span>Capacity: <strong className="text-white">{catalogRoom.seats} Seats</strong></span>
                  <span>Layout: <strong className="text-white">Tiered Wooden Desks</strong></span>
                  <span>Lighting: <strong className="text-white">Daylight Windows</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsZoomed(false)}
                  className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

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
