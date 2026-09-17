export interface UniversityRoom {
  id: string
  name: string
  block: string
  floor: string
  seats: number
  features: string[]
}

export interface TimetableEntry {
  id: string
  room: string
  block: string
  day: string
  startTime: string
  endTime: string
  subject: string
}

export interface AvailableRoomResult {
  id: string
  name: string
  block: string
  floor: string
  seats: number
  features: string[]
  freeFrom: string
  freeTo: string
  nextClass: string
  nextTime: string
  status: 'AVAILABLE' | 'OCCUPIED'
}

export const UNIVERSITY_ROOMS: UniversityRoom[] = [
  {
    id: 'B-201',
    name: 'B-201',
    block: 'B',
    floor: '2nd Floor',
    seats: 60,
    features: ['AC', 'Projector'],
  },
  {
    id: 'B-203',
    name: 'B-203',
    block: 'B',
    floor: '2nd Floor',
    seats: 60,
    features: ['AC', 'Projector', 'Smart Board'],
  },
  {
    id: 'B-207',
    name: 'B-207',
    block: 'B',
    floor: '2nd Floor',
    seats: 40,
    features: ['AC', 'Projector'],
  },
  {
    id: 'B-112',
    name: 'B-112',
    block: 'B',
    floor: '1st Floor',
    seats: 50,
    features: ['AC'],
  },
  {
    id: 'B-202',
    name: 'B-202',
    block: 'B',
    floor: '2nd Floor',
    seats: 50,
    features: ['AC'],
  },
  {
    id: 'B-204',
    name: 'B-204',
    block: 'B',
    floor: '2nd Floor',
    seats: 60,
    features: ['AC', 'Smart Board'],
  },
  {
    id: 'A-101',
    name: 'A-101',
    block: 'A',
    floor: '1st Floor',
    seats: 60,
    features: ['AC', 'Projector'],
  },
  {
    id: 'A-102',
    name: 'A-102',
    block: 'A',
    floor: '1st Floor',
    seats: 55,
    features: ['AC', 'Projector'],
  },
  {
    id: 'C-301',
    name: 'C-301',
    block: 'C',
    floor: '3rd Floor',
    seats: 50,
    features: ['AC'],
  },
  {
    id: 'C-302',
    name: 'C-302',
    block: 'C',
    floor: '3rd Floor',
    seats: 50,
    features: ['AC', 'Projector'],
  },
  {
    id: 'D-401',
    name: 'D-401',
    block: 'D',
    floor: '4th Floor',
    seats: 60,
    features: ['AC'],
  },
  {
    id: 'D-402',
    name: 'D-402',
    block: 'D',
    floor: '4th Floor',
    seats: 60,
    features: ['AC', 'Projector'],
  },
]

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/**
 * Parses time strings like "09:10", "09:10 AM", "11:50 AM", "1:00 PM", "14:00"
 * into minutes from midnight (0 to 1439).
 */
export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0
  const clean = timeStr.trim()
  const ampmMatch = clean.match(/(am|pm)/i)

  if (ampmMatch) {
    const isPM = ampmMatch[1].toLowerCase() === 'pm'
    const withoutAmPm = clean.replace(/(am|pm)/i, '').trim()
    const parts = withoutAmPm.split(':')
    let hours = parseInt(parts[0], 10) || 0
    const minutes = parseInt(parts[1], 10) || 0
    if (isPM && hours < 12) hours += 12
    if (!isPM && hours === 12) hours = 0
    return hours * 60 + minutes
  }

  const parts = clean.split(':')
  const hours = parseInt(parts[0], 10) || 0
  const minutes = parseInt(parts[1], 10) || 0
  return hours * 60 + minutes
}

/**
 * Formats minutes from midnight to "hh:mm AM/PM"
 */
export function formatMinutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const period = h >= 12 ? 'PM' : 'AM'
  const displayH = h % 12 === 0 ? 12 : h % 12
  const paddedH = displayH.toString().padStart(2, '0')
  const paddedM = m.toString().padStart(2, '0')
  return `${paddedH}:${paddedM} ${period}`
}

/**
 * Formats minutes from midnight to "HH:mm" (24-hour)
 */
export function formatMinutesToHHMM(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

/**
 * Converts a YYYY-MM-DD date string to a day name (e.g. "Monday", "Thursday").
 */
export function getDayOfWeekFromDate(dateStr: string): string {
  if (!dateStr) return 'Thursday'
  // Append T12:00:00 to avoid timezone shift
  const d = new Date(`${dateStr}T12:00:00`)
  if (isNaN(d.getTime())) return 'Thursday'
  return d.toLocaleDateString('en-US', { weekday: 'long' })
}

/**
 * Deterministic schedule conflict check:
 * A room is available ONLY IF no timetable class overlaps ANY part of the requested interval.
 * Overlap condition:
 * Math.max(reqStart, classStart) < Math.min(reqEnd, classEnd)
 * equivalently: reqStart < classEnd && reqEnd > classStart
 */
export function isOverlapping(
  reqStartMin: number,
  reqEndMin: number,
  classStartMin: number,
  classEndMin: number,
): boolean {
  return reqStartMin < classEndMin && reqEndMin > classStartMin
}

/**
 * Normalizes block string to single letter, e.g. "Block B" -> "B", "B" -> "B"
 */
export function normalizeBlock(blockStr: string): string {
  if (!blockStr) return 'B'
  const match = blockStr.match(/[A-Za-z]/g)
  if (match && match.length > 0) {
    return match[match.length - 1].toUpperCase()
  }
  return blockStr.trim().toUpperCase()
}

/**
 * Initial fallback timetable covering all university mock data requirements.
 */
export const INITIAL_TIMETABLE_FALLBACK: TimetableEntry[] = [
  // Thursday schedule (matches 17 Sep 2026 default search)
  { id: 'th-1', room: 'B-201', block: 'B', day: 'Thursday', startTime: '09:10', endTime: '10:00', subject: 'Mathematics' },
  { id: 'th-2', room: 'B-201', block: 'B', day: 'Thursday', startTime: '10:00', endTime: '10:50', subject: 'Physics' },
  { id: 'th-3', room: 'B-201', block: 'B', day: 'Thursday', startTime: '11:50', endTime: '12:40', subject: 'DBMS' },
  { id: 'th-4', room: 'B-203', block: 'B', day: 'Thursday', startTime: '10:00', endTime: '11:00', subject: 'Computer Networks' },
  { id: 'th-5', room: 'B-203', block: 'B', day: 'Thursday', startTime: '12:40', endTime: '13:30', subject: 'Physics' },
  { id: 'th-6', room: 'B-207', block: 'B', day: 'Thursday', startTime: '10:00', endTime: '11:00', subject: 'Digital Electronics' },
  { id: 'th-7', room: 'B-207', block: 'B', day: 'Thursday', startTime: '12:40', endTime: '13:30', subject: 'Mathematics' },
  { id: 'th-8', room: 'B-112', block: 'B', day: 'Thursday', startTime: '09:00', endTime: '11:00', subject: 'Engineering Graphics' },
  { id: 'th-9', room: 'B-112', block: 'B', day: 'Thursday', startTime: '13:00', endTime: '14:00', subject: 'Chemistry' },
  { id: 'th-10', room: 'B-202', block: 'B', day: 'Thursday', startTime: '11:00', endTime: '11:50', subject: 'Chemistry' },
  { id: 'th-11', room: 'B-204', block: 'B', day: 'Thursday', startTime: '11:00', endTime: '12:40', subject: 'Data Structures' },
  
  // Monday schedule (original sample in brief)
  { id: 'mo-1', room: 'B-201', block: 'B', day: 'Monday', startTime: '09:10', endTime: '10:00', subject: 'Mathematics' },
  { id: 'mo-2', room: 'B-201', block: 'B', day: 'Monday', startTime: '10:00', endTime: '10:50', subject: 'Physics' },
  { id: 'mo-3', room: 'B-201', block: 'B', day: 'Monday', startTime: '11:50', endTime: '12:40', subject: 'DBMS' },
  { id: 'mo-4', room: 'B-203', block: 'B', day: 'Monday', startTime: '10:00', endTime: '11:00', subject: 'Discrete Mathematics' },
  { id: 'mo-5', room: 'B-203', block: 'B', day: 'Monday', startTime: '12:40', endTime: '13:30', subject: 'Physics' },
  { id: 'mo-6', room: 'B-207', block: 'B', day: 'Monday', startTime: '12:00', endTime: '12:50', subject: 'Mathematics' },
  { id: 'mo-7', room: 'B-202', block: 'B', day: 'Monday', startTime: '09:00', endTime: '09:50', subject: 'Chemistry' },
  { id: 'mo-8', room: 'B-204', block: 'B', day: 'Monday', startTime: '14:00', endTime: '14:50', subject: 'Data Structures' },
  { id: 'mo-9', room: 'A-101', block: 'A', day: 'Monday', startTime: '09:00', endTime: '10:00', subject: 'Calculus' },
  { id: 'mo-10', room: 'A-102', block: 'A', day: 'Monday', startTime: '10:00', endTime: '11:00', subject: 'English' },

  // Block A, C, D samples
  { id: 'a-1', room: 'A-101', block: 'A', day: 'Thursday', startTime: '09:00', endTime: '10:00', subject: 'Calculus' },
  { id: 'a-2', room: 'A-101', block: 'A', day: 'Thursday', startTime: '12:00', endTime: '13:00', subject: 'Linear Algebra' },
  { id: 'a-3', room: 'A-102', block: 'A', day: 'Thursday', startTime: '10:00', endTime: '11:00', subject: 'Professional Communication' },
  { id: 'c-1', room: 'C-301', block: 'C', day: 'Thursday', startTime: '09:00', endTime: '10:30', subject: 'Environmental Studies' },
  { id: 'c-2', room: 'C-302', block: 'C', day: 'Thursday', startTime: '11:00', endTime: '12:00', subject: 'Organic Chemistry' },
  { id: 'd-1', room: 'D-401', block: 'D', day: 'Thursday', startTime: '10:00', endTime: '11:30', subject: 'Microprocessors' },
  { id: 'd-2', room: 'D-402', block: 'D', day: 'Thursday', startTime: '13:00', endTime: '14:30', subject: 'Design Thinking' },
]

/**
 * Calculates schedule-based classroom availability strictly and deterministically.
 * AI does NOT decide availability.
 */
export function calculateScheduleAvailability(
  timetable: TimetableEntry[],
  blockQuery: string,
  dateQuery: string,
  startTimeQuery: string,
  endTimeQuery: string,
): { availableRooms: AvailableRoomResult[]; allRoomsInBlock: AvailableRoomResult[] } {
  const normalizedB = normalizeBlock(blockQuery)
  const dayOfWeek = getDayOfWeekFromDate(dateQuery)
  const reqStart = parseTimeToMinutes(startTimeQuery)
  const reqEnd = parseTimeToMinutes(endTimeQuery)

  // Filter university rooms matching the selected block
  const blockRooms = UNIVERSITY_ROOMS.filter(r => r.block === normalizedB)

  const results: AvailableRoomResult[] = []

  for (const room of blockRooms) {
    // Find all timetable classes for this room on this day of week
    const roomClasses = timetable.filter(
      entry =>
        entry.room.toUpperCase() === room.id.toUpperCase() &&
        entry.day.toLowerCase() === dayOfWeek.toLowerCase(),
    )

    // Sort classes chronologically by start time
    roomClasses.sort((a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime))

    // Check for any overlapping class
    const conflictingClass = roomClasses.find(c => {
      const cStart = parseTimeToMinutes(c.startTime)
      const cEnd = parseTimeToMinutes(c.endTime)
      return isOverlapping(reqStart, reqEnd, cStart, cEnd)
    })

    const isAvailable = !conflictingClass

    // Next scheduled class after requested interval
    const nextClassEntry = roomClasses.find(c => parseTimeToMinutes(c.startTime) >= reqEnd)

    // Calculate free window:
    // Starts from previous class end (or requested start / 08:00 AM)
    // Ends at next class start (or 05:00 PM)
    const priorClass = [...roomClasses].reverse().find(c => parseTimeToMinutes(c.endTime) <= reqStart)
    const freeStartMin = priorClass ? parseTimeToMinutes(priorClass.endTime) : reqStart
    const freeEndMin = nextClassEntry ? parseTimeToMinutes(nextClassEntry.startTime) : Math.max(reqEnd, 17 * 60)

    const freeFrom = formatMinutesToTime(Math.min(reqStart, freeStartMin))
    const freeTo = formatMinutesToTime(freeEndMin)

    const nextClass = nextClassEntry
      ? `${nextClassEntry.subject} at ${formatMinutesToTime(parseTimeToMinutes(nextClassEntry.startTime))}`
      : 'No further classes today'
    const nextTime = nextClassEntry ? formatMinutesToTime(parseTimeToMinutes(nextClassEntry.startTime)) : 'End of Day'

    results.push({
      id: room.id,
      name: room.name,
      block: `Block ${room.block}`,
      floor: room.floor,
      seats: room.seats,
      features: room.features,
      freeFrom,
      freeTo,
      nextClass,
      nextTime,
      status: isAvailable ? 'AVAILABLE' : 'OCCUPIED',
    })
  }

  const availableRooms = results.filter(r => r.status === 'AVAILABLE')
  return { availableRooms, allRoomsInBlock: results }
}

/**
 * Computes chronological timeline for a specific room on a given day.
 */
export function getRoomTimeline(
  roomId: string,
  timetable: TimetableEntry[],
  dayOfWeek: string,
  reqStartMin?: number,
  reqEndMin?: number,
): { time: string; label: string; type: 'class' | 'free' | 'next' }[] {
  const roomClasses = timetable.filter(
    entry =>
      entry.room.toUpperCase() === roomId.toUpperCase() &&
      entry.day.toLowerCase() === dayOfWeek.toLowerCase(),
  )

  roomClasses.sort((a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime))

  if (roomClasses.length === 0) {
    return [
      { time: '09:00 AM', label: 'FREE ALL DAY', type: 'free' },
      { time: '05:00 PM', label: 'Campus Closes', type: 'next' },
    ]
  }

  const timeline: { time: string; label: string; type: 'class' | 'free' | 'next' }[] = []
  let lastEnd = 8 * 60 // 08:00 AM start of campus day

  for (let i = 0; i < roomClasses.length; i++) {
    const c = roomClasses[i]
    const cStart = parseTimeToMinutes(c.startTime)
    const cEnd = parseTimeToMinutes(c.endTime)

    if (cStart > lastEnd) {
      timeline.push({
        time: formatMinutesToTime(lastEnd),
        label: 'FREE',
        type: 'free',
      })
    }

    const isAfterReq = reqEndMin !== undefined && cStart >= reqEndMin
    timeline.push({
      time: formatMinutesToTime(cStart),
      label: c.subject,
      type: isAfterReq && i === roomClasses.findIndex(x => parseTimeToMinutes(x.startTime) >= reqEndMin) ? 'next' : 'class',
    })

    lastEnd = cEnd
  }

  if (lastEnd < 17 * 60) {
    timeline.push({
      time: formatMinutesToTime(lastEnd),
      label: 'FREE',
      type: 'free',
    })
  }

  return timeline
}
