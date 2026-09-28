import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarDays, Search, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react'
import { CitySelector } from './CitySelector'
import { DatePickerModal } from './DatePickerModal'
import { PassengerDropdown } from './PassengerDropdown'
import { playClick, playPop } from '../lib/sound'

const TRIP_TYPES = ['Round trip', 'One way', 'Multi-city']

export function FlightSearchSection({
  searchData,
  setSearch,
  onSearchFlights,
}) {
  const [activeCalendarField, setActiveCalendarField] = useState(null) // 'depart', 'return', or null
  const [validationError, setValidationError] = useState('')

  const handleTripTypeChange = (type) => {
    playClick()
    setSearch('type', type)
    setValidationError('')
  }

  const handleSwapCities = () => {
    const temp = searchData.from
    setSearch('from', searchData.to)
    setSearch('to', temp)
    setValidationError('')
  }

  const handleDateSelect = (dateStr, field) => {
    setSearch(field, dateStr)
    setValidationError('')
    // If selecting depart date in round trip and return is not set or earlier, advance return date
    if (field === 'depart' && searchData.type === 'Round trip') {
      if (!searchData.return || searchData.return <= dateStr) {
        const nextDay = new Date(new Date(dateStr).getTime() + 7 * 86400000).toISOString().slice(0, 10)
        setSearch('return', nextDay)
      }
    }
    setActiveCalendarField(null)
  }

  const validateAndSearch = () => {
    if (!searchData.from || !searchData.from.trim()) {
      setValidationError('Please specify your departure city or airport.')
      return
    }
    if (!searchData.to || !searchData.to.trim()) {
      setValidationError('Please specify your destination city or airport.')
      return
    }
    if (searchData.from.trim().toLowerCase() === searchData.to.trim().toLowerCase()) {
      setValidationError('Origin and destination cannot be the same city.')
      return
    }
    if (!searchData.depart) {
      setValidationError('Please select a departure date.')
      return
    }
    if (searchData.type === 'Round trip' && !searchData.return) {
      setValidationError('Please select a return date for round trip travel.')
      return
    }
    if (searchData.type === 'Round trip' && searchData.return && searchData.return < searchData.depart) {
      setValidationError('Return date cannot be earlier than departure date.')
      return
    }

    setValidationError('')
    playPop()
    onSearchFlights()
  }

  return (
    <section id="search-card" className="search-wrap">
      <div className="search-card-main">
        {/* Top bar with Trip Types tabs and Guarantee */}
        <div className="search-top-bar">
          <div className="trip-tabs-container">
            {TRIP_TYPES.map((type) => {
              const isSelected = searchData.type === type
              return (
                <button
                  key={type}
                  type="button"
                  className={`trip-type-btn ${isSelected ? 'active-trip' : ''}`}
                  onClick={() => handleTripTypeChange(type)}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="tripTypeActivePill"
                      className="trip-pill-background"
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    />
                  )}
                  <span className="relative z-10">{type}</span>
                </button>
              )
            })}
          </div>

          <div className="search-guarantee-badge">
            <ShieldCheck size={16} className="text-teal-600" />
            <span>Best Fare Guarantee · Instant Confirmation</span>
          </div>
        </div>

        {/* Search Fields Grid */}
        <div className="search-grid-layout">
          {/* 1. From & To City Selector with Swap Animation */}
          <CitySelector
            fromCity={searchData.from}
            toCity={searchData.to}
            onChangeFrom={(v) => {
              setSearch('from', v)
              setValidationError('')
            }}
            onChangeTo={(v) => {
              setSearch('to', v)
              setValidationError('')
            }}
            onSwap={handleSwapCities}
            errorMessage={validationError}
          />

          {/* 2. Departure Date Picker Trigger Button */}
          <div className="date-picker-trigger-block">
            <span className="picker-label">DEPARTURE</span>
            <button
              type="button"
              className="date-trigger-btn"
              onClick={() => {
                playClick()
                setActiveCalendarField('depart')
              }}
            >
              <CalendarDays size={16} className="text-teal-700" />
              <div className="date-text-group">
                <b>{searchData.depart || 'Select Date'}</b>
                <small>Outbound Flight</small>
              </div>
            </button>
          </div>

          {/* 3. Return Date Picker Trigger Button */}
          <div
            className={`date-picker-trigger-block ${
              searchData.type === 'One way' ? 'opacity-40 pointer-events-none' : ''
            }`}
          >
            <span className="picker-label">RETURN</span>
            <button
              type="button"
              disabled={searchData.type === 'One way'}
              className="date-trigger-btn"
              onClick={() => {
                playClick()
                setActiveCalendarField('return')
              }}
            >
              <CalendarDays size={16} className="text-teal-700" />
              <div className="date-text-group">
                <b>
                  {searchData.type === 'One way'
                    ? 'No Return (One way)'
                    : searchData.return || 'Select Date'}
                </b>
                <small>Inbound Flight</small>
              </div>
            </button>
          </div>

          {/* 4. Passenger and Class Dropdown */}
          <PassengerDropdown searchData={searchData} setSearch={setSearch} />
        </div>

        {/* Animated Validation Error Message with Shake */}
        <AnimatePresence>
          {validationError && (
            <motion.div
              className="global-search-error-bar"
              initial={{ opacity: 0, y: -6 }}
              animate={{
                opacity: 1,
                y: 0,
                x: [-6, 6, -4, 4, -2, 2, 0],
              }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.35 }}
              role="alert"
            >
              <AlertCircle size={16} />
              <span>{validationError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Bottom Strip */}
        <div className="search-bottom-row">
          <div className="fare-insight-hint">
            <span className="pulsing-radar-dot" />
            <span>
              Explore curated round-trip flights from <b>$428</b> this week
            </span>
          </div>

          <motion.button
            type="button"
            className="search-submit-btn"
            onClick={validateAndSearch}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Search size={17} />
            <span>Search Flights</span>
            <ArrowRight size={16} />
          </motion.button>
        </div>
      </div>

      {/* Date Picker Modal with smooth calendar transitions */}
      <AnimatePresence>
        {activeCalendarField && (
          <DatePickerModal
            isOpen={Boolean(activeCalendarField)}
            onClose={() => setActiveCalendarField(null)}
            departDate={searchData.depart}
            returnDate={searchData.return}
            isRoundTrip={searchData.type === 'Round trip'}
            activeField={activeCalendarField}
            onSelectDate={handleDateSelect}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
