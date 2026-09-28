import { motion } from 'framer-motion'
import { ArrowLeft, Check } from 'lucide-react'
import { playClick } from '../lib/sound'

const STEPS = [
  { id: 'passenger', label: 'Passenger Details' },
  { id: 'seats', label: 'Seat Selection' },
  { id: 'payment', label: 'Payment' },
]

export function BookingProgressHeader({ currentStep, onBackToResults }) {
  const activeIndex = STEPS.findIndex((s) => s.id === currentStep)

  return (
    <div className="booking-top-nav-bar">
      <button
        type="button"
        className="booking-back-btn"
        onClick={() => {
          playClick()
          onBackToResults()
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Flights</span>
      </button>

      {/* Progress Track */}
      <div className="booking-stepper-track">
        {STEPS.map((s, idx) => {
          const isCompleted = idx < activeIndex
          const isCurrent = idx === activeIndex

          return (
            <div
              key={s.id}
              className={`stepper-node ${isCurrent ? 'is-current' : ''} ${
                isCompleted ? 'is-completed' : ''
              }`}
            >
              <div className="node-icon-circle">
                {isCompleted ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Check size={13} strokeWidth={3} />
                  </motion.span>
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span className="node-label-text">{s.label}</span>

              {/* Connecting line between steps */}
              {idx < STEPS.length - 1 && (
                <div className="node-connector-line">
                  <div
                    className="connector-fill"
                    style={{ width: idx < activeIndex ? '100%' : '0%' }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
