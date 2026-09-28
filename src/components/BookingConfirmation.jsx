import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check, Plane, Download, Share2,
  ArrowRight, ShieldCheck, ChevronDown, Sparkles
} from 'lucide-react'
import { money, formatDate } from '../data/flights'
import { playSuccessChime, playClick } from '../lib/sound'

// Lightweight canvas confetti engine
function ConfettiCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const colors = ['#168c91', '#e98768', '#f3be88', '#36a77c', '#153754', '#ffffff']
    const particles = []
    const particleCount = 100

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: width * 0.5 + (Math.random() - 0.5) * 200,
        y: height * 0.35 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 10 - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.22,
        opacity: 1,
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.vy += p.gravity
        p.rotation += p.rotationSpeed
        p.opacity = Math.max(0, p.opacity - 0.0035)

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
        ctx.restore()
      })

      if (particles.some((p) => p.opacity > 0)) {
        animationFrameId = requestAnimationFrame(render)
      }
    }

    render()

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="confetti-canvas-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 999,
      }}
    />
  )
}

export function BookingConfirmation({ booking, onHome }) {
  const [showFareBreakdown, setShowFareBreakdown] = useState(false)
  const [sharedToast, setSharedToast] = useState('')

  useEffect(() => {
    // Play celebratory success chime
    playSuccessChime()
  }, [])

  if (!booking) {
    return (
      <div className="no-booking-view">
        <p>No active booking found.</p>
        <button type="button" className="btn-primary" onClick={onHome}>
          Search Flights
        </button>
      </div>
    )
  }

  const { passenger, flight, seat, total, ref } = booking
  const passengerFullName = `${passenger?.title || 'Ms'}. ${passenger?.first || 'Sophia'} ${passenger?.last || 'Chen'}`
  const departureDateFormatted = formatDate(booking.date)

  const handleShare = () => {
    playClick()
    if (navigator.share) {
      navigator.share({
        title: `SkyVoyage Booking ${ref}`,
        text: `I'm flying from ${flight.from} to ${flight.to} with SkyVoyage!`,
        url: window.location.href,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(`SkyVoyage Booking Ref: ${ref} (${flight.from} -> ${flight.to})`)
      setSharedToast('Booking reference copied to clipboard!')
      setTimeout(() => setSharedToast(''), 3000)
    }
  }

  return (
    <div className="confirmation-page-container">
      {/* Dynamic Celebration Confetti */}
      <ConfettiCanvas />

      {/* Celebration Header */}
      <div className="celebration-hero-block">
        {/* Animated Checkmark and Pulse Wave Rings */}
        <div className="celebration-mark-wrap">
          <motion.div
            className="pulse-ring-outer"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.4, 1.6], opacity: [0.8, 0.4, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut' }}
          />
          <motion.div
            className="pulse-ring-inner"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.25, 1.4], opacity: [0.9, 0.5, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, delay: 0.3, ease: 'easeOut' }}
          />
          <motion.div
            className="celebration-check-circle"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 15 }}
          >
            <Check size={36} strokeWidth={3} className="text-white" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="celebration-badge">BOOKING CONFIRMED & ISSUED</span>
          <h1 className="celebration-heading">Ready for Takeoff!</h1>
          <p className="celebration-caption">
            Your flight has been successfully booked. Confirmation and e-tickets have been sent to{' '}
            <b>{passenger?.email || 'your email'}</b>.
          </p>

          <div className="reference-code-box">
            <span>BOOKING REFERENCE NUMBER</span>
            <b className="ref-number">{ref}</b>
            <small>Show this PNR or your e-ticket at the airport kiosk.</small>
          </div>
        </motion.div>
      </div>

      {/* Ticket Summary Boarding Pass with Subtle Entry Animation */}
      <motion.div
        className="ticket-summary-card"
        initial={{ opacity: 0, y: 35, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Ticket Header */}
        <div className="ticket-top-banner">
          <div className="ticket-brand-meta">
            <span className="brand-circle">
              <Plane size={15} />
            </span>
            <div className="brand-names">
              <b>skyvoyage.</b>
              <small>BOARDING PASS</small>
            </div>
          </div>
          <div className="ticket-status-pill">
            <Sparkles size={12} />
            <span>CONFIRMED & ISSUED</span>
          </div>
        </div>

        {/* Passenger & Flight Info Row */}
        <div className="ticket-passenger-row">
          <div className="ticket-info-unit">
            <small>PASSENGER NAME</small>
            <b>{passengerFullName}</b>
          </div>
          <div className="ticket-info-unit">
            <small>CARRIER / FLIGHT</small>
            <b>{flight.airline} · {flight.flightNumber || flight.id.toUpperCase()}</b>
          </div>
          <div className="ticket-info-unit">
            <small>CABIN CLASS</small>
            <b>{booking.cabin || 'Economy'}</b>
          </div>
        </div>

        {/* Route Details Segment */}
        <div className="ticket-route-segment">
          {/* Depart */}
          <div className="route-terminal-block text-left">
            <span className="terminal-time">{flight.depart}</span>
            <b className="terminal-code">{flight.from}</b>
            <span className="terminal-city">
              {flight.fromCity || 'Origin'} {flight.fromFlag || ''}
            </span>
            <small className="terminal-date">{departureDateFormatted}</small>
          </div>

          {/* Route Flight Path Visual */}
          <div className="route-flight-graphic">
            <small className="flight-duration-tag">{flight.duration}</small>
            <div className="flight-path-bar">
              <span className="path-dash" />
              <div className="plane-center-icon">
                <Plane size={18} className="transform rotate-90 text-teal-700" />
              </div>
              <span className="path-dash" />
            </div>
            <span className="flight-stops-tag">
              {flight.stops === 0 ? 'Nonstop flight' : `${flight.stops} stop`}
            </span>
          </div>

          {/* Arrive */}
          <div className="route-terminal-block text-right">
            <span className="terminal-time">{flight.arrive}</span>
            <b className="terminal-code">{flight.to}</b>
            <span className="terminal-city">
              {flight.toCity || 'Destination'} {flight.toFlag || ''}
            </span>
            <small className="terminal-date">Arrival Terminal</small>
          </div>
        </div>

        {/* Perforated Tear Notch Line */}
        <div className="ticket-perforated-strip">
          <div className="notch-left" />
          <div className="dashed-cut-line" />
          <div className="notch-right" />
        </div>

        {/* Ticket Bottom Stubs: Gate, Seat, Boarding Time & Barcode */}
        <div className="ticket-bottom-stub">
          <div className="stub-unit">
            <small>SEAT</small>
            <b className="text-teal-700 font-extrabold">{seat || '12B'}</b>
          </div>
          <div className="stub-unit">
            <small>GATE</small>
            <b>B12</b>
          </div>
          <div className="stub-unit">
            <small>BOARDING TIME</small>
            <b>07:45 AM</b>
          </div>
          <div className="stub-unit">
            <small>GROUP</small>
            <b>Group 2</b>
          </div>
          <div className="stub-barcode-block">
            <div className="simulated-barcode">
              ||||| | |||| ||| || |||||| | |||||||| || ||| ||||
            </div>
            <small className="ticket-eticket-num">E-TKT 016-9284719284</small>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons: Print, Download, Share, Home */}
      <div className="confirmation-action-buttons">
        <motion.button
          type="button"
          className="btn-print-ticket"
          onClick={() => window.print()}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Download size={16} />
          <span>Print / Save PDF</span>
        </motion.button>

        <motion.button
          type="button"
          className="btn-share-ticket"
          onClick={handleShare}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Share2 size={16} />
          <span>Share Itinerary</span>
        </motion.button>

        <button
          type="button"
          className="btn-fare-breakdown-toggle"
          onClick={() => setShowFareBreakdown(!showFareBreakdown)}
        >
          <span>{showFareBreakdown ? 'Hide Fare Details' : 'View Fare Breakdown'}</span>
          <ChevronDown
            size={15}
            className={`transition-transform duration-200 ${showFareBreakdown ? 'transform rotate-180' : ''}`}
          />
        </button>

        <button type="button" className="btn-book-another" onClick={onHome}>
          <span>Book Another Flight</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {sharedToast && (
          <motion.div
            className="floating-toast"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Sparkles size={14} className="text-teal-600" />
            <span>{sharedToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expandable Fare Breakdown with Smooth Height Transition */}
      <AnimatePresence>
        {showFareBreakdown && (
          <motion.div
            className="fare-breakdown-card"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="fare-breakdown-inner">
              <div className="breakdown-row">
                <span>Base Flight Fare ({booking.flight.airline})</span>
                <b>{money(booking.flight.price)}</b>
              </div>
              <div className="breakdown-row">
                <span>Selected Seat ({seat || 'Standard'})</span>
                <b>{total - booking.flight.price > 0 ? money(total - booking.flight.price) : 'Free'}</b>
              </div>
              <div className="breakdown-row">
                <span>Airport Taxes & Security Fees</span>
                <span className="text-emerald-700 font-semibold">Included</span>
              </div>
              <div className="breakdown-row breakdown-total-row">
                <span>Total Paid</span>
                <b className="total-paid-val">{money(total)}</b>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="trip-guarantee-footer">
        <ShieldCheck size={16} className="text-teal-700" />
        <span>SkyVoyage 24/7 Dedicated Concierge Support · Travel with complete confidence</span>
      </div>
    </div>
  )
}
