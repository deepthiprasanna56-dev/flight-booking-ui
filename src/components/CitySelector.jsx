import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpDown, MapPin, Plane, Search, Globe2 } from 'lucide-react'
import { cities } from '../data/flights'
import { playClick, playSwoosh } from '../lib/sound'

const REGIONS = ['Popular', 'All', 'Europe', 'Americas', 'Asia', 'Middle East', 'Africa', 'Oceania']

export function CitySelector({
  fromCity,
  toCity,
  onChangeFrom,
  onChangeTo,
  onSwap,
  errorMessage,
}) {
  const [openFrom, setOpenFrom] = useState(false)
  const [openTo, setOpenTo] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)
  const [activeRegionFrom, setActiveRegionFrom] = useState('Popular')
  const [activeRegionTo, setActiveRegionTo] = useState('Popular')

  const fromRef = useRef(null)
  const toRef = useRef(null)

  // Filter matches for FROM
  const fromMatches = useMemo(() => {
    const q = (fromCity || '').trim().toLowerCase()
    return cities.filter((c) => {
      const matchText = `${c.city} ${c.code} ${c.airport} ${c.country}`.toLowerCase()
      const matchesSearch = !q || matchText.includes(q)
      if (!matchesSearch) return false

      if (q) return true // if user typed, search across all
      if (activeRegionFrom === 'Popular') return c.popular
      if (activeRegionFrom === 'All') return true
      return c.region === activeRegionFrom
    })
  }, [fromCity, activeRegionFrom])

  // Filter matches for TO
  const toMatches = useMemo(() => {
    const q = (toCity || '').trim().toLowerCase()
    return cities.filter((c) => {
      const matchText = `${c.city} ${c.code} ${c.airport} ${c.country}`.toLowerCase()
      const matchesSearch = !q || matchText.includes(q)
      if (!matchesSearch) return false

      if (q) return true // if user typed, search across all
      if (activeRegionTo === 'Popular') return c.popular
      if (activeRegionTo === 'All') return true
      return c.region === activeRegionTo
    })
  }, [toCity, activeRegionTo])

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (fromRef.current && !fromRef.current.contains(e.target)) {
        setOpenFrom(false)
      }
      if (toRef.current && !toRef.current.contains(e.target)) {
        setOpenTo(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSwap = () => {
    playSwoosh()
    setIsSwapping(true)
    setTimeout(() => setIsSwapping(false), 500)
    onSwap()
  }

  return (
    <div className="city-selector-container">
      {/* City Inputs Row with Cross Animation */}
      <div className="city-inputs-row">
        {/* FROM Field */}
        <motion.div
          ref={fromRef}
          className={`city-input-wrap ${
            errorMessage && errorMessage.toLowerCase().includes('departure')
              ? 'city-has-error'
              : ''
          }`}
          animate={isSwapping ? { x: [0, 24, -12, 0] } : {}}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="city-label-row">
            <span className="city-label">FROM</span>
            <span className="city-badge">ORIGIN</span>
          </div>
          <div className="city-field-inner">
            <MapPin size={16} className="city-icon" />
            <input
              type="text"
              value={fromCity}
              placeholder="Search city, country or code..."
              onFocus={() => {
                setOpenFrom(true)
                setOpenTo(false)
              }}
              onChange={(e) => {
                onChangeFrom(e.target.value)
                setOpenFrom(true)
              }}
              aria-label="Departure city"
            />
          </div>

          {/* Autocomplete Dropdown with All Countries & Regions */}
          <AnimatePresence>
            {openFrom && (
              <motion.div
                className="city-dropdown"
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.18 }}
              >
                {/* Region Selector Tabs */}
                <div className="dropdown-region-tabs">
                  {REGIONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      className={`region-tab-btn ${activeRegionFrom === r ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        playClick()
                        setActiveRegionFrom(r)
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>

                <div className="dropdown-heading">
                  <Globe2 size={13} className="text-teal-600 inline mr-1.5" />
                  {fromCity ? `MATCHING DESTINATIONS (${fromMatches.length})` : `${activeRegionFrom.toUpperCase()} AIRPORTS & COUNTRIES`}
                </div>

                <div className="dropdown-cities-list">
                  {fromMatches.slice(0, 10).map((c) => (
                    <button
                      key={`${c.code}-${c.city}`}
                      type="button"
                      className={`city-option ${fromCity === c.city ? 'selected-opt' : ''}`}
                      onClick={() => {
                        playClick()
                        onChangeFrom(c.city)
                        setOpenFrom(false)
                      }}
                    >
                      <span className="city-option-code">{c.code}</span>
                      <span className="city-option-text">
                        <b>
                          {c.city} <span className="city-flag">{c.flag}</span>
                        </b>
                        <small>{c.airport}</small>
                      </span>
                      <span className="city-option-country">{c.country}</span>
                    </button>
                  ))}

                  {fromMatches.length === 0 && (
                    <div className="city-no-match">
                      <Search size={16} className="text-slate-400 mx-auto mb-1.5" />
                      <span>No matching airport or country found for "{fromCity}"</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Animated Swap Button */}
        <motion.button
          type="button"
          className="swap-button"
          aria-label="Swap departure and arrival cities"
          onClick={handleSwap}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.88 }}
          animate={{ rotate: isSwapping ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 16 }}
        >
          <ArrowUpDown size={17} />
        </motion.button>

        {/* TO Field */}
        <motion.div
          ref={toRef}
          className={`city-input-wrap ${
            errorMessage && errorMessage.toLowerCase().includes('destination')
              ? 'city-has-error'
              : ''
          }`}
          animate={isSwapping ? { x: [0, -24, 12, 0] } : {}}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="city-label-row">
            <span className="city-label">TO</span>
            <span className="city-badge">DESTINATION</span>
          </div>
          <div className="city-field-inner">
            <Plane size={16} className="city-icon" />
            <input
              type="text"
              value={toCity}
              placeholder="Search destination, country or code..."
              onFocus={() => {
                setOpenTo(true)
                setOpenFrom(false)
              }}
              onChange={(e) => {
                onChangeTo(e.target.value)
                setOpenTo(true)
              }}
              aria-label="Arrival destination"
            />
          </div>

          {/* Autocomplete Dropdown with All Countries & Regions */}
          <AnimatePresence>
            {openTo && (
              <motion.div
                className="city-dropdown"
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.18 }}
              >
                {/* Region Selector Tabs */}
                <div className="dropdown-region-tabs">
                  {REGIONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      className={`region-tab-btn ${activeRegionTo === r ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        playClick()
                        setActiveRegionTo(r)
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>

                <div className="dropdown-heading">
                  <Globe2 size={13} className="text-teal-600 inline mr-1.5" />
                  {toCity ? `MATCHING DESTINATIONS (${toMatches.length})` : `${activeRegionTo.toUpperCase()} AIRPORTS & COUNTRIES`}
                </div>

                <div className="dropdown-cities-list">
                  {toMatches.slice(0, 10).map((c) => (
                    <button
                      key={`${c.code}-${c.city}`}
                      type="button"
                      className={`city-option ${toCity === c.city ? 'selected-opt' : ''}`}
                      onClick={() => {
                        playClick()
                        onChangeTo(c.city)
                        setOpenTo(false)
                      }}
                    >
                      <span className="city-option-code">{c.code}</span>
                      <span className="city-option-text">
                        <b>
                          {c.city} <span className="city-flag">{c.flag}</span>
                        </b>
                        <small>{c.airport}</small>
                      </span>
                      <span className="city-option-country">{c.country}</span>
                    </button>
                  ))}

                  {toMatches.length === 0 && (
                    <div className="city-no-match">
                      <Search size={16} className="text-slate-400 mx-auto mb-1.5" />
                      <span>No matching airport or country found for "{toCity}"</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
