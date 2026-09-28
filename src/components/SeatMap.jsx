import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Armchair, Plane, ArrowRight, ArrowLeft, CheckCircle2
} from 'lucide-react'
import { playClick, playPop } from '../lib/sound'

// Occupied seats mockup
const OCCUPIED_SEATS = [
  '1A', '1D', '2B', '2C', '3A', '3F', '4B', '4E',
  '5C', '6A', '6D', '7B', '7E', '8C', '8F', '9A',
  '10D', '11B', '12E', '13C', '14A', '15F',
]

// Cabin zone configs
const CABIN_ROWS = [
  // Rows 1-2: First / Business (2-2 configuration)
  { row: 1, type: 'business', price: 65, label: 'Lie-flat Business', cols: ['A', 'B', '', 'C', 'D'] },
  { row: 2, type: 'business', price: 65, label: 'Lie-flat Business', cols: ['A', 'B', '', 'C', 'D'] },
  // Rows 3-5: Premium Economy (3-3 configuration)
  { row: 3, type: 'premium', price: 30, label: 'Extra Legroom (36")', cols: ['A', 'B', 'C', '', 'D', 'E', 'F'] },
  { row: 4, type: 'premium', price: 30, label: 'Extra Legroom (36")', cols: ['A', 'B', 'C', '', 'D', 'E', 'F'] },
  { row: 5, type: 'premium', price: 30, label: 'Extra Legroom (36")', cols: ['A', 'B', 'C', '', 'D', 'E', 'F'] },
  // Rows 6-15: Economy (3-3 configuration)
  { row: 6, type: 'economy', price: 0, label: 'Standard Economy', cols: ['A', 'B', 'C', '', 'D', 'E', 'F'], exitRow: true },
  { row: 7, type: 'economy', price: 0, label: 'Standard Economy', cols: ['A', 'B', 'C', '', 'D', 'E', 'F'] },
  { row: 8, type: 'economy', price: 0, label: 'Standard Economy', cols: ['A', 'B', 'C', '', 'D', 'E', 'F'] },
  { row: 9, type: 'economy', price: 0, label: 'Standard Economy', cols: ['A', 'B', 'C', '', 'D', 'E', 'F'] },
  { row: 10, type: 'economy', price: 0, label: 'Standard Economy', cols: ['A', 'B', 'C', '', 'D', 'E', 'F'] },
  { row: 11, type: 'economy', price: 0, label: 'Standard Economy', cols: ['A', 'B', 'C', '', 'D', 'E', 'F'] },
  { row: 12, type: 'economy', price: 0, label: 'Standard Economy', cols: ['A', 'B', 'C', '', 'D', 'E', 'F'], exitRow: true },
  { row: 13, type: 'economy', price: 0, label: 'Standard Economy', cols: ['A', 'B', 'C', '', 'D', 'E', 'F'] },
  { row: 14, type: 'economy', price: 0, label: 'Standard Economy', cols: ['A', 'B', 'C', '', 'D', 'E', 'F'] },
  { row: 15, type: 'economy', price: 0, label: 'Standard Economy', cols: ['A', 'B', 'C', '', 'D', 'E', 'F'] },
]

export function SeatMap({
  selectedSeat,
  onSelectSeat,
  passenger,
  flight,
  onNext,
  onBack,
}) {
  const [hoveredSeat, setHoveredSeat] = useState(null)

  // Find info about currently selected seat
  const seatDetails = selectedSeat ? getSeatInfo(selectedSeat) : null

  function getSeatInfo(code) {
    if (!code) return null
    const rowNum = parseInt(code.match(/\d+/)[0], 10)
    const colLetter = code.replace(/\d+/, '')
    const rowConfig = CABIN_ROWS.find((r) => r.row === rowNum)
    if (!rowConfig) return null

    let position = 'Middle Seat'
    if (colLetter === 'A' || colLetter === 'F' || (rowConfig.type === 'business' && colLetter === 'D')) {
      position = 'Window Seat'
    } else if (colLetter === 'C' || colLetter === 'D' || (rowConfig.type === 'business' && colLetter === 'B')) {
      position = 'Aisle Seat'
    }

    return {
      code,
      type: rowConfig.type,
      label: rowConfig.label,
      price: rowConfig.price,
      position,
      exitRow: rowConfig.exitRow,
    }
  }

  const handleSeatClick = (seatCode) => {
    if (OCCUPIED_SEATS.includes(seatCode)) return
    playPop()
    onSelectSeat(seatCode)
  }

  return (
    <div className="seat-selection-wrapper">
      {/* Top Header */}
      <div className="seat-header-card">
        <div className="seat-header-left">
          <span className="step-tag">SEAT SELECTION</span>
          <h1 className="step-main-title">Choose your preferred seat</h1>
          <p className="step-caption">
            Select your seat on the {flight?.aircraft || 'Airbus A350-900'} for traveler{' '}
            <b>{passenger?.first ? `${passenger.first} ${passenger.last}` : 'Passenger 1'}</b>.
          </p>
        </div>

        {/* Legend */}
        <div className="seat-legend-grid">
          <div className="legend-item">
            <span className="legend-box seat-avail" />
            <span>Available ($0)</span>
          </div>
          <div className="legend-item">
            <span className="legend-box seat-prem" />
            <span>Premium Extra (+$30)</span>
          </div>
          <div className="legend-item">
            <span className="legend-box seat-biz" />
            <span>Lie-flat Biz (+$65)</span>
          </div>
          <div className="legend-item">
            <span className="legend-box seat-occ" />
            <span>Occupied</span>
          </div>
          <div className="legend-item">
            <span className="legend-box seat-sel" />
            <span>Your Seat</span>
          </div>
        </div>
      </div>

      {/* Main Seatmap & Live Seat Preview Sidebar */}
      <div className="seatmap-split-layout">
        {/* Fuselage Container */}
        <div className="fuselage-outer-frame">
          <div className="fuselage-aircraft">
            {/* Aircraft Nose Cone & Cockpit */}
            <div className="aircraft-nose">
              <div className="cockpit-glass">
                <Plane size={20} className="cockpit-plane-icon" />
              </div>
              <span className="cockpit-title">COCKPIT · FLIGHT DECK</span>
            </div>

            {/* Left & Right Wings Visuals */}
            <div className="wing-left">
              <span>◄ LEFT WING · JET ENGINE 1</span>
            </div>
            <div className="wing-right">
              <span>JET ENGINE 2 · RIGHT WING ►</span>
            </div>

            {/* Cabin Body */}
            <div className="cabin-scroll-viewport">
              {/* Column Letters Header */}
              <div className="cabin-cols-guide">
                <span>A</span>
                <span>B</span>
                <span>C</span>
                <span className="aisle-guide-space">AISLE</span>
                <span>D</span>
                <span>E</span>
                <span>F</span>
              </div>

              {/* Rows List */}
              <div className="cabin-rows-list">
                {CABIN_ROWS.map((rowConfig) => {
                  return (
                    <div
                      key={rowConfig.row}
                      className={`seat-row-strip ${rowConfig.type === 'business' ? 'biz-strip' : ''} ${
                        rowConfig.exitRow ? 'exit-row-strip' : ''
                      }`}
                    >
                      {/* Emergency exit row indicator */}
                      {rowConfig.exitRow && (
                        <div className="emergency-exit-badge">
                          <span>EMERGENCY EXIT ROW</span>
                        </div>
                      )}

                      {/* Row Number */}
                      <span className="row-num-tag">{rowConfig.row}</span>

                      {/* Seats in row */}
                      <div className="row-seats-cluster">
                        {rowConfig.cols.map((col, colIdx) => {
                          if (!col) {
                            return (
                              <div
                                key={`aisle-${rowConfig.row}-${colIdx}`}
                                className="seat-aisle-divider"
                              />
                            )
                          }

                          const seatCode = `${rowConfig.row}${col}`
                          const isOccupied = OCCUPIED_SEATS.includes(seatCode)
                          const isSelected = selectedSeat === seatCode
                          const isHovered = hoveredSeat?.code === seatCode

                          return (
                            <motion.button
                              key={seatCode}
                              type="button"
                              disabled={isOccupied}
                              onClick={() => handleSeatClick(seatCode, rowConfig)}
                              onMouseEnter={() =>
                                !isOccupied && setHoveredSeat(getSeatInfo(seatCode))
                              }
                              onMouseLeave={() => setHoveredSeat(null)}
                              whileHover={!isOccupied ? { scale: 1.25 } : {}}
                              whileTap={!isOccupied ? { scale: 0.92 } : {}}
                              animate={
                                isSelected
                                  ? {
                                      scale: [1, 1.35, 1.15],
                                      transition: { type: 'spring', stiffness: 400, damping: 15 },
                                    }
                                  : {}
                              }
                              className={`seat-unit ${rowConfig.type} ${
                                isOccupied ? 'is-occupied' : 'is-available'
                              } ${isSelected ? 'is-selected' : ''} ${isHovered ? 'is-hovered' : ''}`}
                              aria-label={`Seat ${seatCode}, ${rowConfig.label}, ${
                                isOccupied ? 'Occupied' : `$${rowConfig.price}`
                              }`}
                            >
                              <Armchair size={13} className="seat-armchair-icon" />
                              <span className="seat-letter">{col}</span>
                            </motion.button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Aircraft Tail */}
              <div className="aircraft-tail">
                <span>REAR GALLEY & LAVATORIES</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Seat Preview & Specs Sidebar */}
        <div className="seat-sidebar-column">
          <div className="seat-inspector-card">
            <span className="inspector-eyebrow">SEAT INSPECTOR</span>
            {selectedSeat ? (
              <motion.div
                key={selectedSeat}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="selected-seat-showcase"
              >
                <div className="seat-badge-large">
                  <b>{selectedSeat}</b>
                  <span>SELECTED</span>
                </div>

                <div className="seat-specs-list">
                  <div className="seat-spec-row">
                    <span>Cabin Class:</span>
                    <b>{seatDetails?.label}</b>
                  </div>
                  <div className="seat-spec-row">
                    <span>Position:</span>
                    <b>{seatDetails?.position}</b>
                  </div>
                  <div className="seat-spec-row">
                    <span>Legroom & Pitch:</span>
                    <b>{seatDetails?.type === 'business' ? '60" Lie-flat' : seatDetails?.type === 'premium' ? '36" Pitch' : '32" Pitch'}</b>
                  </div>
                  <div className="seat-spec-row">
                    <span>Seat Surcharge:</span>
                    <b className="text-teal-700">
                      {seatDetails?.price ? `+$${seatDetails.price}` : 'Free (Included)'}
                    </b>
                  </div>
                </div>

                <div className="seat-perks-box">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  <span>Includes in-seat power, adjustable headrest & USB port.</span>
                </div>
              </motion.div>
            ) : (
              <div className="empty-seat-guide">
                <Armchair size={36} className="text-gray-400" />
                <b>No seat chosen yet</b>
                <p>Click on any available seat on the fuselage map to inspect features and reserve it.</p>
              </div>
            )}
          </div>

          {/* Hover seat dynamic tooltip info */}
          <AnimatePresence>
            {hoveredSeat && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="hover-seat-tooltip-card"
              >
                <div className="tooltip-head">
                  <b>Seat {hoveredSeat.code}</b>
                  <span>{hoveredSeat.position}</span>
                </div>
                <div className="tooltip-sub">
                  <span>{hoveredSeat.label}</span>
                  <b>{hoveredSeat.price ? `+$${hoveredSeat.price}` : 'Free'}</b>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="seat-action-bottom-bar">
        <button type="button" className="btn-secondary-back" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to Passenger Details</span>
        </button>

        <div className="seat-bottom-summary">
          {selectedSeat ? (
            <div className="bottom-chosen-seat">
              <span>Seat:</span>
              <b>{selectedSeat}</b>
              <span className="bullet">·</span>
              <span>{seatDetails?.position}</span>
              <span className="bullet">·</span>
              <b className="text-teal-700">{seatDetails?.price ? `+$${seatDetails.price}` : 'Included'}</b>
            </div>
          ) : (
            <span className="bottom-select-hint">Please choose a seat to proceed</span>
          )}

          <motion.button
            type="button"
            className="btn-primary-continue"
            disabled={!selectedSeat}
            onClick={() => {
              playClick()
              onNext()
            }}
            whileHover={selectedSeat ? { scale: 1.02 } : {}}
            whileTap={selectedSeat ? { scale: 0.98 } : {}}
          >
            <span>Proceed to Payment</span>
            <ArrowRight size={16} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
