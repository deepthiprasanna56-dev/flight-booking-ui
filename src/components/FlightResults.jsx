import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SlidersHorizontal, Heart, ArrowRight, Plane, Luggage,
  Sun, Sunrise, Sunset, Moon, Sparkles, Filter, X, Check,
  Wifi, RotateCcw
} from 'lucide-react'
import { flights as allFlights, money, findDestination, getFlightsForRoute } from '../data/flights'
import { FlightDetailsModal } from './FlightDetailsModal'
import { playClick, playPop } from '../lib/sound'

const TIME_FILTERS = [
  { id: 'Any time', label: 'Any', icon: Sparkles, desc: 'All hours' },
  { id: 'Dawn', label: 'Dawn', icon: Moon, desc: '00:00 - 06:00' },
  { id: 'Morning', label: 'Morning', icon: Sunrise, desc: '06:00 - 12:00' },
  { id: 'Afternoon', label: 'Afternoon', icon: Sun, desc: '12:00 - 18:00' },
  { id: 'Evening', label: 'Evening', icon: Sunset, desc: '18:00 - 24:00' },
]

const SORT_OPTIONS = [
  { id: 'Recommended', label: 'Recommended' },
  { id: 'Cheapest', label: 'Cheapest First' },
  { id: 'Fastest', label: 'Fastest Route' },
  { id: 'Earliest', label: 'Earliest Takeoff' },
]

export function FlightResults({
  searchData,
  onSelectFlight,
  onEditSearch,
  savedFlights,
  onToggleSaveFlight,
}) {
  const searchKey = `${searchData.from}-${searchData.to}-${searchData.depart}`
  const [loadedKeys, setLoadedKeys] = useState({})
  const loaded = Boolean(loadedKeys[searchKey])

  const [sort, setSort] = useState('Recommended')
  const [maxPrice, setMaxPrice] = useState(2500)
  const [stops, setStops] = useState('Any stops')
  const [timeFilter, setTimeFilter] = useState('Any time')
  const [selectedAirlines, setSelectedAirlines] = useState([])
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [detailsFlight, setDetailsFlight] = useState(null)
  const [hoveredCardId, setHoveredCardId] = useState(null)

  // Simulate smooth loading transition when filters or search changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadedKeys((prev) => ({ ...prev, [searchKey]: true }))
    }, 600)
    return () => clearTimeout(timer)
  }, [searchKey])

  const fromCity = findDestination(searchData.from)
  const toCity = findDestination(searchData.to)

  // Distinct airlines
  const availableAirlines = useMemo(() => {
    const map = new Map()
    allFlights.forEach((f) => {
      map.set(f.airline, (map.get(f.airline) || 0) + 1)
    })
    return Array.from(map.entries()).map(([airline, count]) => ({ airline, count }))
  }, [])

  // Filtered & Sorted Flights
  const filteredFlights = useMemo(() => {
    let result = getFlightsForRoute(searchData.from, searchData.to, searchData.cabin)

    // Price filter
    result = result.filter((f) => f.price <= maxPrice)

    // Stops filter
    if (stops === 'Nonstop') {
      result = result.filter((f) => f.stops === 0)
    } else if (stops === '1 stop') {
      result = result.filter((f) => f.stops === 1)
    }

    // Departure time filter
    if (timeFilter !== 'Any time') {
      result = result.filter((f) => {
        const hour = parseInt(f.depart.split(':')[0], 10)
        if (timeFilter === 'Dawn') return hour >= 0 && hour < 6
        if (timeFilter === 'Morning') return hour >= 6 && hour < 12
        if (timeFilter === 'Afternoon') return hour >= 12 && hour < 18
        if (timeFilter === 'Evening') return hour >= 18 && hour < 24
        return true
      })
    }

    // Airlines filter
    if (selectedAirlines.length > 0) {
      result = result.filter((f) => selectedAirlines.includes(f.airline))
    }

    // Sorting with transition effects
    if (sort === 'Cheapest') {
      result.sort((a, b) => a.price - b.price)
    } else if (sort === 'Fastest') {
      result.sort((a, b) => (a.durationMinutes || 465) - (b.durationMinutes || 465))
    } else if (sort === 'Earliest') {
      result.sort((a, b) => a.depart.localeCompare(b.depart))
    } else if (sort === 'Recommended') {
      result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
    }

    return result
  }, [maxPrice, stops, timeFilter, selectedAirlines, sort, searchData.cabin, searchData.from, searchData.to])

  const resetFilters = () => {
    playClick()
    setMaxPrice(2500)
    setStops('Any stops')
    setTimeFilter('Any time')
    setSelectedAirlines([])
  }

  const toggleAirline = (airline) => {
    playPop()
    setSelectedAirlines((prev) =>
      prev.includes(airline) ? prev.filter((a) => a !== airline) : [...prev, airline]
    )
  }

  return (
    <div className="results-wrapper">
      {/* Top Banner / Search Summary */}
      <div className="results-hero-strip">
        <div className="results-strip-content">
          <div className="route-header-box">
            <span className="results-eyebrow">SELECT YOUR OUTBOUND FLIGHT</span>
            <h1 className="results-route-title">
              <span>{fromCity.city}</span> <span className="route-flag">{fromCity.flag}</span> <span className="route-code">({fromCity.code})</span>
              <span className="route-arrow-icon">✈</span>
              <span>{toCity.city}</span> <span className="route-flag">{toCity.flag}</span> <span className="route-code">({toCity.code})</span>
            </h1>
            <p className="results-trip-meta">
              <span>{searchData.depart}</span>
              <span className="bullet">·</span>
              <span>{searchData.cabin}</span>
              <span className="bullet">·</span>
              <span>
                {(searchData.adults || 1) + (searchData.children || 0) + (searchData.infants || 0)} Traveler(s)
              </span>
            </p>
          </div>

          <motion.button
            type="button"
            className="edit-search-action-btn"
            onClick={onEditSearch}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <SlidersHorizontal size={15} />
            <span>Modify Search</span>
          </motion.button>
        </div>
      </div>

      {/* Main Container */}
      <div className="results-layout-container">
        {/* Results Toolbar with animated sort pills */}
        <div className="results-action-bar">
          <div className="results-count-badge">
            <b>{filteredFlights.length} Flights Found</b>
            <small>Prices include all taxes and mandatory fees</small>
          </div>

          {/* Desktop Sort Selector */}
          <div className="sort-pills-wrap">
            <span className="sort-by-label">Sort by:</span>
            <div className="sort-pills-group">
              {SORT_OPTIONS.map((opt) => {
                const isActive = sort === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`sort-pill ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      playClick()
                      setSort(opt.id)
                    }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeSortIndicator"
                        className="sort-pill-indicator"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{opt.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            type="button"
            className="mobile-filter-btn"
            onClick={() => setMobileFilterOpen(true)}
          >
            <Filter size={15} />
            <span>Filters</span>
          </button>
        </div>

        {/* 2-Column Content Layout: Filter Sidebar + Flight Cards List */}
        <div className="results-grid">
          {/* Filter Sidebar */}
          <aside className={`results-filters-sidebar ${mobileFilterOpen ? 'sidebar-open' : ''}`}>
            <div className="filter-header-row">
              <h3>
                <Filter size={16} className="text-teal-700" />
                <span>Filters</span>
              </h3>
              <div className="filter-header-actions">
                <button type="button" className="clear-filters-btn" onClick={resetFilters}>
                  <RotateCcw size={12} /> Clear all
                </button>
                <button
                  type="button"
                  className="mobile-close-filter"
                  onClick={() => setMobileFilterOpen(false)}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* 1. Price Filter with dynamic slider */}
            <div className="filter-card">
              <div className="filter-title-row">
                <span>Maximum Fare</span>
                <b className="filter-price-highlight">{money(maxPrice)}</b>
              </div>
              <input
                type="range"
                min="300"
                max="2500"
                step="25"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="custom-range-slider"
                aria-label="Filter maximum price"
              />
              <div className="range-range-labels">
                <span>$300</span>
                <span>$1,400</span>
                <span>$2,500</span>
              </div>
            </div>

            {/* 2. Departure Time Filters */}
            <div className="filter-card">
              <div className="filter-title-row">
                <span>Departure Time</span>
              </div>
              <div className="time-filter-cards-grid">
                {TIME_FILTERS.map((t) => {
                  const Icon = t.icon
                  const isSelected = timeFilter === t.id
                  return (
                    <button
                      key={t.id}
                      type="button"
                      className={`time-filter-chip ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        playClick()
                        setTimeFilter(t.id)
                      }}
                    >
                      <Icon size={14} className="time-chip-icon" />
                      <div className="time-chip-meta">
                        <b>{t.label}</b>
                        <small>{t.desc}</small>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 3. Stops Filter */}
            <div className="filter-card">
              <div className="filter-title-row">
                <span>Stops</span>
              </div>
              <div className="stops-pills-row">
                {['Any stops', 'Nonstop', '1 stop'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`stop-pill ${stops === s ? 'selected' : ''}`}
                    onClick={() => {
                      playClick()
                      setStops(s)
                    }}
                  >
                    {stops === s && <Check size={12} className="inline mr-1" />}
                    <span>{s}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Airlines Filter */}
            <div className="filter-card">
              <div className="filter-title-row">
                <span>Airlines</span>
                <small>{availableAirlines.length} carriers</small>
              </div>
              <div className="airlines-checkbox-list">
                {availableAirlines.map(({ airline, count }) => {
                  const isChecked = selectedAirlines.includes(airline)
                  return (
                    <label key={airline} className="airline-checkbox-label">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleAirline(airline)}
                      />
                      <span className="custom-check-box">
                        {isChecked && <Check size={11} />}
                      </span>
                      <span className="airline-name-text">{airline}</span>
                      <span className="airline-count-badge">{count}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {mobileFilterOpen && (
              <button
                type="button"
                className="mobile-apply-filter-btn"
                onClick={() => setMobileFilterOpen(false)}
              >
                Apply Filters ({filteredFlights.length} Flights)
              </button>
            )}
          </aside>

          {/* Flight Cards List */}
          <main className="results-cards-column">
            {!loaded ? (
              /* Loading Skeletons with Shimmer effect */
              <div className="skeletons-list">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flight-card-skeleton">
                    <div className="skeleton-row-top">
                      <div className="skeleton-circle" />
                      <div className="skeleton-lines">
                        <div className="skeleton-line skeleton-short" />
                        <div className="skeleton-line skeleton-thin" />
                      </div>
                      <div className="skeleton-badge" />
                    </div>
                    <div className="skeleton-row-mid">
                      <div className="skeleton-block" />
                      <div className="skeleton-line-path" />
                      <div className="skeleton-block" />
                      <div className="skeleton-price-block" />
                    </div>
                    <div className="skeleton-row-bot" />
                  </div>
                ))}
              </div>
            ) : filteredFlights.length > 0 ? (
              /* Animated Flight Cards with layout transition */
              <motion.div layout className="flight-cards-animated-container">
                <AnimatePresence>
                  {filteredFlights.map((flight, idx) => {
                    const isSaved = savedFlights.includes(flight.id)
                    const isHovered = hoveredCardId === flight.id

                    return (
                      <motion.article
                        key={flight.id}
                        layout
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.3, delay: idx * 0.04 }}
                        className={`flight-result-card ${isHovered ? 'card-hovered' : ''}`}
                        onMouseEnter={() => setHoveredCardId(flight.id)}
                        onMouseLeave={() => setHoveredCardId(null)}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      >
                        {/* Card Header */}
                        <div className="card-top-row">
                          <div className="carrier-identity">
                            <span
                              className="carrier-logo-badge"
                              style={{ backgroundColor: flight.color }}
                            >
                              {flight.brand}
                            </span>
                            <div className="carrier-names">
                              <b>{flight.airline}</b>
                              <small>
                                {flight.flightNumber || flight.id.toUpperCase()} · {flight.aircraft}
                              </small>
                            </div>
                          </div>

                          <div className="card-top-right">
                            {flight.tag && (
                              <span
                                className="flight-highlight-pill"
                                style={{ backgroundColor: `${flight.tagColor || '#168c91'}18`, color: flight.tagColor || '#168c91' }}
                              >
                                {flight.tag}
                              </span>
                            )}
                            <button
                              type="button"
                              className={`save-heart-btn ${isSaved ? 'is-saved' : ''}`}
                              onClick={() => {
                                playPop()
                                onToggleSaveFlight(flight.id)
                              }}
                              aria-label="Save to favorites"
                            >
                              <Heart
                                size={17}
                                fill={isSaved ? '#d7686c' : 'none'}
                                color={isSaved ? '#d7686c' : '#8898a8'}
                              />
                            </button>
                          </div>
                        </div>

                        {/* Card Flight Schedule & Route */}
                        <div className="card-flight-schedule">
                          {/* Departure */}
                          <div className="schedule-col schedule-depart">
                            <b className="flight-time">{flight.depart}</b>
                            <span className="flight-code">{flight.from}</span>
                            <small className="flight-city">{fromCity.city}</small>
                          </div>

                          {/* Flight Duration with Animated Gliding Plane on hover */}
                          <div className="schedule-col schedule-track">
                            <small className="duration-text">{flight.duration}</small>
                            <div className="route-track-line">
                              <span className="line-left" />
                              <motion.div
                                className="plane-icon-wrap"
                                animate={isHovered ? { x: [0, 25, 0] } : {}}
                                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                              >
                                <Plane size={14} className="text-teal-700 transform rotate-90" />
                              </motion.div>
                              <span className="line-right" />
                            </div>
                            <span className={`stops-badge ${flight.stops === 0 ? 'nonstop' : 'one-stop'}`}>
                              {flight.stops === 0 ? 'Nonstop' : `${flight.stops} Stop · ${flight.layover || 'Layover'}`}
                            </span>
                          </div>

                          {/* Arrival */}
                          <div className="schedule-col schedule-arrive">
                            <b className="flight-time">
                              {flight.arrive}
                              {flight.arrive < flight.depart && (
                                <sup className="next-day-pill">+1 Day</sup>
                              )}
                            </b>
                            <span className="flight-code">{flight.to}</span>
                            <small className="flight-city">{toCity.city}</small>
                          </div>

                          {/* Price Tag Box */}
                          <div className="schedule-col schedule-price-box">
                            <span className="price-from-label">from</span>
                            <b className="price-val">{money(flight.price)}</b>
                            <small className="price-type">round trip / traveler</small>
                          </div>
                        </div>

                        {/* Card Footer Features & Actions */}
                        <div className="card-footer-row">
                          <div className="card-amenities-chips">
                            <span className="amenity-chip">
                              <Luggage size={13} />
                              <span>{flight.baggage ? 'Baggage incl.' : 'Standard'}</span>
                            </span>
                            <span className="amenity-chip">
                              <Wifi size={13} />
                              <span>Wi-Fi available</span>
                            </span>
                            <span className="amenity-chip rating-chip">
                              ★ {flight.rating}
                            </span>
                          </div>

                          <div className="card-actions-group">
                            <button
                              type="button"
                              className="view-details-btn"
                              onClick={() => {
                                playClick()
                                setDetailsFlight(flight)
                              }}
                            >
                              <span>Flight details</span>
                              <ArrowRight size={13} />
                            </button>

                            <motion.button
                              type="button"
                              className="select-flight-btn"
                              onClick={() => {
                                playPop()
                                onSelectFlight(flight)
                              }}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                            >
                              <span>Select Flight</span>
                              <ArrowRight size={15} />
                            </motion.button>
                          </div>
                        </div>
                      </motion.article>
                    )
                  })}
                </AnimatePresence>
              </motion.div>
            ) : (
              /* No matching flights state */
              <div className="no-flights-state">
                <div className="no-flights-icon-circle">
                  <Plane size={32} />
                </div>
                <h3>No Flights Match Your Filters</h3>
                <p>Try expanding your price range or clearing selected airlines to discover available flights.</p>
                <button type="button" className="reset-filters-cta" onClick={resetFilters}>
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Flight Details Slide-in Panel */}
      <AnimatePresence>
        {detailsFlight && (
          <FlightDetailsModal
            flight={detailsFlight}
            onClose={() => setDetailsFlight(null)}
            onSelect={() => {
              const selected = detailsFlight
              setDetailsFlight(null)
              onSelectFlight(selected)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
