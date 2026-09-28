import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Plane, Luggage, Tv, ShieldCheck, ChevronDown,
  Leaf, Clock, ArrowRight, CheckCircle2, AlertCircle, Wind
} from 'lucide-react'
import { money } from '../data/flights'
import { playClick, playPop } from '../lib/sound'

export function FlightDetailsModal({ flight, onClose, onSelect }) {
  const [activeSection, setActiveSection] = useState('itinerary')

  if (!flight) return null

  const toggleSection = (id) => {
    playClick()
    setActiveSection((prev) => (prev === id ? '' : id))
  }

  return (
    <div className="details-backdrop" onClick={onClose}>
      <motion.div
        className="details-drawer"
        initial={{ x: '100%', opacity: 0.7 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-header-left">
            <span className="drawer-eyebrow">FLIGHT DETAILS & AMENITIES</span>
            <h2 className="drawer-title">
              {flight.from} <ArrowRight size={18} className="inline mx-1 text-teal-600" /> {flight.to}
            </h2>
            <div className="drawer-flight-sub">
              <span>{flight.airline}</span>
              <span className="dot-sep">·</span>
              <span>Flight {flight.flightNumber || flight.id.toUpperCase()}</span>
              <span className="dot-sep">·</span>
              <span className="font-semibold text-teal-700">{flight.tag}</span>
            </div>
          </div>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close details">
            <X size={18} />
          </button>
        </div>

        <div className="drawer-content-scroll">
          {/* Visual Route Timeline */}
          <div className="route-timeline-card">
            <div className="timeline-segment">
              <div className="timeline-point-start">
                <div className="time-badge">{flight.depart}</div>
                <div className="airport-meta">
                  <b>{flight.from} Airport</b>
                  <small>Terminal 4 · Check-in Opens 3h prior</small>
                </div>
              </div>

              <div className="timeline-flight-path">
                <div className="path-line">
                  <div className="path-dash" />
                  <motion.div
                    className="path-plane"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  >
                    <Plane size={15} />
                  </motion.div>
                </div>
                <div className="path-details">
                  <span className="duration-pill">
                    <Clock size={12} /> {flight.duration}
                  </span>
                  <span className="stops-pill">
                    {flight.stops === 0 ? 'Nonstop flight' : `${flight.stops} stop (${flight.layover || 'Layover'})`}
                  </span>
                </div>
              </div>

              <div className="timeline-point-end">
                <div className="time-badge">{flight.arrive}</div>
                <div className="airport-meta">
                  <b>{flight.to} Airport</b>
                  <small>Terminal 5 · Baggage claim Hall B</small>
                </div>
              </div>
            </div>

            {/* Aircraft specs bar */}
            <div className="aircraft-specs-bar">
              <div className="spec-item">
                <Wind size={14} className="text-teal-600" />
                <span><b>Aircraft:</b> {flight.aircraft}</span>
              </div>
              <div className="spec-item">
                <Leaf size={14} className="text-emerald-600" />
                <span><b>Eco Rating:</b> {flight.carbonCo2 || 'Standard emissions'}</span>
              </div>
            </div>
          </div>

          {/* Expandable Accordions */}
          <div className="drawer-accordions">
            {/* 1. In-flight Experience & Amenities */}
            <div className="accordion-block">
              <button
                type="button"
                className={`accordion-trigger ${activeSection === 'amenities' ? 'expanded' : ''}`}
                onClick={() => toggleSection('amenities')}
              >
                <div className="accordion-label-left">
                  <Tv size={16} className="text-teal-700" />
                  <span>Onboard Comfort & In-flight Services</span>
                </div>
                <motion.span
                  animate={{ rotate: activeSection === 'amenities' ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={17} />
                </motion.span>
              </button>
              <AnimatePresence>
                {activeSection === 'amenities' && (
                  <motion.div
                    className="accordion-body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="amenities-grid">
                      {(flight.amenities || ['Fast Wi-Fi', 'In-seat AC & USB Power', 'Gourmet meal and drinks', 'Seatback entertainment screen']).map((a, i) => (
                        <div key={i} className="amenity-item">
                          <CheckCircle2 size={14} className="text-teal-600" />
                          <span>{a}</span>
                        </div>
                      ))}
                    </div>
                    <p className="amenity-footnote">
                      {flight.pitch || '33" seat pitch'} with multi-way adjustable leather headrest, ergonomic lumbar support, and personal reading light.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. Baggage Allowance */}
            <div className="accordion-block">
              <button
                type="button"
                className={`accordion-trigger ${activeSection === 'baggage' ? 'expanded' : ''}`}
                onClick={() => toggleSection('baggage')}
              >
                <div className="accordion-label-left">
                  <Luggage size={16} className="text-teal-700" />
                  <span>Baggage Policy & Cabin Allowances</span>
                </div>
                <motion.span
                  animate={{ rotate: activeSection === 'baggage' ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={17} />
                </motion.span>
              </button>
              <AnimatePresence>
                {activeSection === 'baggage' && (
                  <motion.div
                    className="accordion-body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="baggage-cards-row">
                      <div className="baggage-card">
                        <b>Personal Item</b>
                        <small>Fits under seat in front of you (purse, backpack, laptop bag)</small>
                        <span className="badge-included">Included free</span>
                      </div>
                      <div className="baggage-card">
                        <b>Cabin Carry-on</b>
                        <small>Standard overhead trolley (up to 10kg / 22lbs)</small>
                        <span className="badge-included">Included free</span>
                      </div>
                      <div className="baggage-card">
                        <b>Checked Baggage</b>
                        <small>{flight.baggage || '1 standard bag up to 23kg'}</small>
                        <span className="badge-included">Included free</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. Fare Rules & Flexibility */}
            <div className="accordion-block">
              <button
                type="button"
                className={`accordion-trigger ${activeSection === 'rules' ? 'expanded' : ''}`}
                onClick={() => toggleSection('rules')}
              >
                <div className="accordion-label-left">
                  <ShieldCheck size={16} className="text-teal-700" />
                  <span>Cancellation & Change Protection</span>
                </div>
                <motion.span
                  animate={{ rotate: activeSection === 'rules' ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={17} />
                </motion.span>
              </button>
              <AnimatePresence>
                {activeSection === 'rules' && (
                  <motion.div
                    className="accordion-body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="rules-list">
                      <div className="rule-row">
                        <CheckCircle2 size={14} className="text-emerald-600" />
                        <div>
                          <b>Free Changes within 24 Hours:</b>
                          <span>Cancel or rebook without penalty within 24 hours of booking.</span>
                        </div>
                      </div>
                      <div className="rule-row">
                        <CheckCircle2 size={14} className="text-emerald-600" />
                        <div>
                          <b>Flight Delay Guarantee:</b>
                          <span>Automatic credit and lounge access voucher if delayed over 2 hours.</span>
                        </div>
                      </div>
                      <div className="rule-row">
                        <AlertCircle size={14} className="text-amber-600" />
                        <div>
                          <b>Non-refundable after 24h:</b>
                          <span>Fare difference applies for rebooking; credit stored for 12 months.</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Footer sticky bar */}
        <div className="drawer-footer">
          <div className="drawer-fare-box">
            <span className="fare-label">TOTAL FARE</span>
            <div className="fare-amount">
              <b>{money(flight.price)}</b>
              <small>all taxes included</small>
            </div>
          </div>
          <motion.button
            type="button"
            className="drawer-select-btn"
            onClick={() => {
              playPop()
              onSelect()
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Select this Flight</span>
            <ArrowRight size={16} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
