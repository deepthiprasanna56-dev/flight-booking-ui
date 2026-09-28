import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles, X } from 'lucide-react'
import { playClick, playPop } from '../lib/sound'

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

// Sample low fare calendar pricing data
const SAMPLE_FARES = {
  3: 428,
  7: 512,
  12: 468,
  15: 399,
  18: 485,
  22: 440,
  25: 530,
  28: 410,
}

export function DatePickerModal({
  isOpen,
  onClose,
  departDate,
  returnDate,
  isRoundTrip,
  activeField, // 'depart' or 'return'
  onSelectDate,
}) {
  const baseDate = (activeField === 'return' && returnDate) ? new Date(`${returnDate}T12:00:00`) : (departDate ? new Date(`${departDate}T12:00:00`) : new Date())
  const [currentYear, setCurrentYear] = useState(baseDate.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(baseDate.getMonth())
  const [direction, setDirection] = useState(1) // 1 = next, -1 = prev

  if (!isOpen) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const handlePrevMonth = () => {
    playClick()
    setDirection(-1)
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((y) => y - 1)
    } else {
      setCurrentMonth((m) => m - 1)
    }
  }

  const handleNextMonth = () => {
    playClick()
    setDirection(1)
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((y) => y + 1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
  }

  // Calculate calendar days
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate()

  const handleDayClick = (day) => {
    const formatted = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    playPop()
    onSelectDate(formatted, activeField)
  }

  const applyPreset = (daysFromNow) => {
    playPop()
    const target = new Date(Date.now() + daysFromNow * 86400000)
    const formatted = target.toISOString().slice(0, 10)
    onSelectDate(formatted, activeField)
  }

  // Animation variants for smooth sliding calendar transition
  const calendarVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
    },
    exit: (dir) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0,
      transition: { duration: 0.18, ease: 'easeIn' },
    }),
  }

  return (
    <div className="calendar-backdrop" onClick={onClose}>
      <motion.div
        className="calendar-modal"
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="calendar-header-bar">
          <div className="calendar-title-wrap">
            <span className="cal-icon-wrap">
              <CalendarIcon size={16} />
            </span>
            <div>
              <span className="cal-eyebrow">
                {activeField === 'return' ? 'SELECT RETURN DATE' : 'SELECT DEPARTURE DATE'}
              </span>
              <h3 className="cal-heading">
                {activeField === 'return' ? 'When do you want to return?' : 'When are you flying out?'}
              </h3>
            </div>
          </div>
          <button className="cal-close-btn" onClick={onClose} aria-label="Close calendar">
            <X size={16} />
          </button>
        </div>

        {/* Quick Date Presets */}
        <div className="cal-presets">
          <button type="button" onClick={() => applyPreset(1)}>
            Tomorrow
          </button>
          <button type="button" onClick={() => applyPreset(3)}>
            In 3 Days
          </button>
          <button type="button" onClick={() => applyPreset(7)}>
            In a Week
          </button>
          <button type="button" onClick={() => applyPreset(14)}>
            In 2 Weeks
          </button>
        </div>

        {/* Month Navigation */}
        <div className="cal-nav-row">
          <button
            type="button"
            className="cal-nav-btn"
            onClick={handlePrevMonth}
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="cal-month-title">
            {MONTHS[currentMonth]} <b>{currentYear}</b>
          </span>
          <button
            type="button"
            className="cal-nav-btn"
            onClick={handleNextMonth}
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Days of Week Header */}
        <div className="cal-weekdays">
          {DAYS.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        {/* Animated Calendar Grid */}
        <div className="cal-grid-viewport">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`${currentYear}-${currentMonth}`}
              custom={direction}
              variants={calendarVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="cal-days-grid"
            >
              {/* Previous month trailing days */}
              {Array.from({ length: firstDayIndex }, (_, i) => {
                const dayNum = daysInPrevMonth - firstDayIndex + i + 1
                return (
                  <span key={`prev-${i}`} className="cal-day cal-day-muted">
                    {dayNum}
                  </span>
                )
              })}

              {/* Current month days */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1
                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const thisDate = new Date(`${dateStr}T12:00:00`)
                const isPast = thisDate < today
                const isDepart = dateStr === departDate
                const isReturn = dateStr === returnDate
                const isInRange =
                  isRoundTrip &&
                  departDate &&
                  returnDate &&
                  dateStr > departDate &&
                  dateStr < returnDate
                const fare = SAMPLE_FARES[day]

                return (
                  <button
                    key={`curr-${day}`}
                    type="button"
                    disabled={isPast}
                    onClick={() => handleDayClick(day)}
                    className={`cal-day ${isPast ? 'cal-day-disabled' : ''} ${
                      isDepart ? 'cal-day-depart' : ''
                    } ${isReturn ? 'cal-day-return' : ''} ${
                      isInRange ? 'cal-day-in-range' : ''
                    }`}
                  >
                    <span className="cal-day-num">{day}</span>
                    {!isPast && fare && !isDepart && !isReturn && (
                      <span className="cal-fare-badge">${fare}</span>
                    )}
                    {isDepart && <span className="cal-label-badge">Depart</span>}
                    {isReturn && <span className="cal-label-badge">Return</span>}
                  </button>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Hint */}
        <div className="cal-footer">
          <div className="cal-hint-left">
            <Sparkles size={13} className="text-teal-600" />
            <span>Green dots indicate lowest predicted fares this season</span>
          </div>
          <button type="button" className="cal-done-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </motion.div>
    </div>
  )
}
