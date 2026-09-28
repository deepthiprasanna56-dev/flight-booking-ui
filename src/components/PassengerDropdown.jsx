import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, ChevronDown, Plus, Minus, Check, Award, Sparkles, Coffee } from 'lucide-react'
import { playClick, playPop } from '../lib/sound'

const CABIN_CLASSES = [
  {
    id: 'Economy',
    label: 'Economy',
    icon: Users,
    perk: 'Standard comfort & entertainment',
    baggage: '1 carry-on included',
  },
  {
    id: 'Premium Economy',
    label: 'Premium',
    icon: Coffee,
    perk: 'Extra 6" legroom & premium dining',
    baggage: '2 checked bags included',
  },
  {
    id: 'Business',
    label: 'Business',
    icon: Award,
    perk: 'Lie-flat seats & lounge access',
    baggage: 'Priority baggage & check-in',
  },
  {
    id: 'First Class',
    label: 'First Class',
    icon: Sparkles,
    perk: 'Private suites & personal concierge',
    baggage: '3 checked bags & chauffeur',
  },
]

export function PassengerDropdown({ searchData, setSearch }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  const totalPassengers =
    (searchData.adults || 1) + (searchData.children || 0) + (searchData.infants || 0)

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const updateCount = (key, delta) => {
    playPop()
    const current = searchData[key] || 0
    const min = key === 'adults' ? 1 : 0
    const max = key === 'infants' ? (searchData.adults || 1) : 9
    const nextVal = Math.max(min, Math.min(max, current + delta))
    setSearch(key, nextVal)
  }

  const selectCabin = (cabin) => {
    playClick()
    setSearch('cabin', cabin)
  }

  return (
    <div ref={containerRef} className="passenger-dropdown-container">
      <div className="passenger-trigger-wrap">
        <span className="passenger-label">PASSENGERS & CABIN</span>
        <button
          type="button"
          className={`passenger-trigger-btn ${isOpen ? 'active-open' : ''}`}
          onClick={() => {
            playClick()
            setIsOpen(!isOpen)
          }}
          aria-expanded={isOpen}
        >
          <div className="trigger-text-group">
            <span className="trigger-main-text">
              <Users size={15} className="text-teal-700" />
              <b>
                {totalPassengers} Traveler{totalPassengers > 1 ? 's' : ''}
              </b>
            </span>
            <span className="trigger-sub-text">{searchData.cabin}</span>
          </div>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="chevron-icon"
          >
            <ChevronDown size={16} />
          </motion.span>
        </button>
      </div>

      {/* Animated Expanding Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="passenger-popover"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          >
            <div className="popover-header">
              <span>TRAVELERS</span>
              <small>Max 9 passengers total</small>
            </div>

            {/* Traveler Stepper Rows */}
            <div className="stepper-rows-group">
              {/* Adults */}
              <div className="passenger-stepper-row">
                <div className="stepper-meta">
                  <b>Adults</b>
                  <small>Age 12 and above</small>
                </div>
                <div className="stepper-controls">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    disabled={searchData.adults <= 1}
                    onClick={() => updateCount('adults', -1)}
                    aria-label="Decrease adults"
                  >
                    <Minus size={14} />
                  </motion.button>
                  <motion.span
                    key={searchData.adults}
                    initial={{ y: -6, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="stepper-count"
                  >
                    {searchData.adults}
                  </motion.span>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    disabled={searchData.adults >= 9}
                    onClick={() => updateCount('adults', 1)}
                    aria-label="Increase adults"
                  >
                    <Plus size={14} />
                  </motion.button>
                </div>
              </div>

              {/* Children */}
              <div className="passenger-stepper-row">
                <div className="stepper-meta">
                  <b>Children</b>
                  <small>Ages 2 – 11</small>
                </div>
                <div className="stepper-controls">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    disabled={searchData.children <= 0}
                    onClick={() => updateCount('children', -1)}
                    aria-label="Decrease children"
                  >
                    <Minus size={14} />
                  </motion.button>
                  <motion.span
                    key={searchData.children}
                    initial={{ y: -6, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="stepper-count"
                  >
                    {searchData.children}
                  </motion.span>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    disabled={searchData.children >= 8}
                    onClick={() => updateCount('children', 1)}
                    aria-label="Increase children"
                  >
                    <Plus size={14} />
                  </motion.button>
                </div>
              </div>

              {/* Infants */}
              <div className="passenger-stepper-row">
                <div className="stepper-meta">
                  <b>Infants</b>
                  <small>Under 2 (on lap)</small>
                </div>
                <div className="stepper-controls">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    disabled={searchData.infants <= 0}
                    onClick={() => updateCount('infants', -1)}
                    aria-label="Decrease infants"
                  >
                    <Minus size={14} />
                  </motion.button>
                  <motion.span
                    key={searchData.infants}
                    initial={{ y: -6, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="stepper-count"
                  >
                    {searchData.infants}
                  </motion.span>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    disabled={searchData.infants >= (searchData.adults || 1)}
                    onClick={() => updateCount('infants', 1)}
                    aria-label="Increase infants"
                  >
                    <Plus size={14} />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Cabin Class Selection */}
            <div className="popover-cabin-section">
              <div className="popover-header">
                <span>CABIN CLASS</span>
              </div>
              <div className="cabin-options-grid">
                {CABIN_CLASSES.map((cabin) => {
                  const isSelected = searchData.cabin === cabin.id
                  const Icon = cabin.icon
                  return (
                    <motion.button
                      key={cabin.id}
                      type="button"
                      className={`cabin-card-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => selectCabin(cabin.id)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="cabin-card-left">
                        <Icon size={16} className="cabin-card-icon" />
                        <div>
                          <div className="cabin-card-title">
                            {cabin.label}
                            {isSelected && <Check size={13} className="cabin-check" />}
                          </div>
                          <div className="cabin-card-perk">{cabin.perk}</div>
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Done CTA */}
            <div className="popover-footer">
              <button
                type="button"
                className="popover-done-btn"
                onClick={() => {
                  playClick()
                  setIsOpen(false)
                }}
              >
                Apply Travelers & Class
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
