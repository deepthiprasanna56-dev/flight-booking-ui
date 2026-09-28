import { motion } from 'framer-motion'
import { Plane, Calendar, ShieldCheck, Ticket, Armchair } from 'lucide-react'
import { money } from '../data/flights'

export function BookingSummaryCard({
  flight,
  searchData,
  seat,
  total,
}) {
  const basePrice = flight?.price || 684
  const seatSurcharge = total - basePrice

  return (
    <aside className="summary-sidebar-panel">
      <div className="summary-card-header">
        <div className="summary-header-meta">
          <span className="summary-eyebrow">YOUR JOURNEY</span>
          <h3 className="summary-title">Booking Summary</h3>
        </div>
        <div className="summary-ticket-badge">
          <Ticket size={18} className="text-teal-700" />
        </div>
      </div>

      {/* Flight Route Visual */}
      <div className="summary-route-box">
        <div className="summary-airport-point">
          <b>{flight?.from || 'JFK'}</b>
          <small>{searchData.from || 'New York'}</small>
        </div>
        <div className="summary-flight-track">
          <span className="track-line" />
          <motion.div
            className="track-plane"
            animate={{ x: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          >
            <Plane size={15} className="transform rotate-90 text-teal-700" />
          </motion.div>
          <span className="track-line" />
        </div>
        <div className="summary-airport-point text-right">
          <b>{flight?.to || 'LHR'}</b>
          <small>{searchData.to || 'London'}</small>
        </div>
      </div>

      {/* Date & Cabin Class */}
      <div className="summary-meta-line">
        <div className="meta-line-item">
          <Calendar size={13} className="text-teal-700" />
          <span>{searchData.depart || 'Tomorrow'}</span>
        </div>
        <div className="meta-line-item">
          <span className="cabin-pill">{searchData.cabin || 'Economy'}</span>
        </div>
      </div>

      {/* Airline Banner */}
      <div className="summary-airline-banner">
        <span
          className="summary-airline-logo"
          style={{ backgroundColor: flight?.color || '#183b72' }}
        >
          {flight?.brand || 'SQ'}
        </span>
        <div className="summary-airline-meta">
          <b>{flight?.airline || 'Singapore Airlines'}</b>
          <small>{flight?.aircraft || 'Airbus A350-900'}</small>
        </div>
      </div>

      {/* Price breakdown */}
      <div className="summary-cost-breakdown">
        <div className="cost-row">
          <span>Flight Fare</span>
          <b>{money(basePrice)}</b>
        </div>
        <div className="cost-row">
          <span>Taxes & Carrier Surcharges</span>
          <span className="text-emerald-700 font-semibold">Included</span>
        </div>
        {seat && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="cost-row"
          >
            <span className="flex items-center gap-1">
              <Armchair size={13} className="text-teal-700" />
              Seat {seat} Surcharge
            </span>
            <b>{seatSurcharge > 0 ? money(seatSurcharge) : 'Free'}</b>
          </motion.div>
        )}
        <div className="cost-total-row">
          <span>Total Fare</span>
          <motion.b
            key={total}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="total-highlight"
          >
            {money(total)}
          </motion.b>
        </div>
      </div>

      {/* Guarantee Badge */}
      <div className="summary-guarantee-pill">
        <ShieldCheck size={16} className="text-teal-700 flex-shrink-0" />
        <div>
          <b>Best Price Guarantee</b>
          <p>Found a cheaper flight within 24 hours? We'll refund 100% of the difference.</p>
        </div>
      </div>
    </aside>
  )
}
