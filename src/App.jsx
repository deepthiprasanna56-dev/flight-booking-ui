import { lazy, Suspense, useState } from 'react'
import { useTheme } from 'next-themes'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight, Check, Heart, Mail, MapPin, Menu, Moon, Plane, Search, ShieldCheck, Sparkles, Star,
  Sun, Volume2, VolumeX, X
} from 'lucide-react'
import { cities, flights } from './data/flights'
import { FlightCard as FeaturedFlightCard } from './components/ui/flight-card-1'
import { FlightStatusCard } from './components/ui/flight-status-card'
import { AuthUI } from './components/ui/auth-ui'

import { FlightSearchSection } from './components/FlightSearchSection'
import { FlightResults } from './components/FlightResults'
import { BookingProgressHeader } from './components/BookingProgressHeader'
import { PassengerForm } from './components/PassengerForm'
import { SeatMap } from './components/SeatMap'
import { PaymentSection } from './components/PaymentSection'
import { BookingSummaryCard } from './components/BookingSummaryCard'
import { BookingConfirmation } from './components/BookingConfirmation'
import { isSoundEnabled, setSoundEnabled, playClick, playPop } from './lib/sound'

const fadeVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
}

const IconCloud = lazy(() =>
  import('./components/ui/interactive-icon-cloud').then((module) => ({
    default: module.IconCloud,
  }))
)

const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10)
const nextWeek = new Date(Date.now() + 8 * 86400000).toISOString().slice(0, 10)

const initialSearch = {
  from: 'New York',
  to: 'London',
  depart: tomorrow,
  return: nextWeek,
  type: 'Round trip',
  cabin: 'Economy',
  adults: 1,
  children: 0,
  infants: 0,
}

const sampleFlightStatuses = [
  { ...flights.find((flight) => flight.flightNumber === 'BA 117'), from: 'JFK', to: 'LHR', gate: 'B12', statusText: 'On time', statusColor: 'green', boarding: 'Boarding soon', boardingTime: '35 min', closes: '10:10 PM', start: '9:35 PM', end: '10:10 PM', progress: 64 },
  { ...flights.find((flight) => flight.flightNumber === 'SQ 25'), from: 'SIN', to: 'HND', gate: 'C23', statusText: 'Boarding', statusColor: 'green', boarding: 'Final boarding', boardingTime: 'Now', closes: '8:45 PM', start: '8:05 PM', end: '8:45 PM', progress: 82 },
  { ...flights.find((flight) => flight.flightNumber === 'DL 003'), from: 'JFK', to: 'LAX', gate: 'A07', statusText: 'Delayed 20 min', statusColor: 'orange', boarding: 'Updated departure', boardingTime: '9:20 PM', closes: '9:00 PM', start: '8:20 PM', end: '9:00 PM', progress: 38 },
  { ...flights.find((flight) => flight.flightNumber === 'EK 202'), from: 'DXB', to: 'CDG', gate: 'A18', statusText: 'On time', statusColor: 'green', boarding: 'Check-in open', boardingTime: 'Terminal 3', closes: '11:15 PM', start: '10:30 PM', end: '11:15 PM', progress: 22 },
]

function App() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDarkMode = resolvedTheme === 'dark'
  const [step, setStep] = useState('home') // 'home' | 'results' | 'passenger' | 'seats' | 'payment' | 'confirmation'
  const [searchData, setSearchData] = useState(initialSearch)
  const [selectedFlight, setSelectedFlight] = useState(flights[0])
  const [passenger, setPassenger] = useState({
    title: 'Ms',
    first: '',
    last: '',
    dob: '',
    gender: '',
    nationality: '',
    email: '',
    phone: '',
    passport: '',
    meal: 'Standard / Chef Selection',
  })
  const [seat, setSeat] = useState('')
  const [booking, setBooking] = useState(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [savedFlights, setSavedFlights] = useState(['sv218'])
  const [soundActive, setSoundActive] = useState(isSoundEnabled())

  const navigateTo = (nextStep) => {
    playClick()
    setStep(nextStep)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const setSearch = (key, value) => {
    setSearchData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSelectFlight = (flight) => {
    playPop()
    setSelectedFlight(flight)
    navigateTo('passenger')
  }

  const toggleSaveFlight = (id) => {
    setSavedFlights((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const toggleSound = () => {
    const nextVal = !soundActive
    setSoundEnabled(nextVal)
    setSoundActive(nextVal)
  }

  // Calculate pricing breakdown
  const baseFare = selectedFlight?.price || 684
  let seatSurcharge = 0
  if (seat) {
    const rowNum = parseInt(seat.match(/\d+/)?.[0] || '10', 10)
    if (rowNum <= 2) seatSurcharge = 65 // Lie-flat business
    else if (rowNum <= 5) seatSurcharge = 30 // Extra legroom
  }
  const totalAmount = baseFare + seatSurcharge

  const handleCompleteBooking = () => {
    const pnrRef = `SK${Math.random().toString(36).slice(2, 7).toUpperCase()}Y`
    const confirmedBooking = {
      ref: pnrRef,
      passenger,
      flight: selectedFlight,
      seat: seat || '12B',
      date: searchData.depart,
      cabin: searchData.cabin,
      total: totalAmount,
    }
    setBooking(confirmedBooking)
    navigateTo('confirmation')
  }

  return (
    <div className="app-shell">
      {/* Global Navigation Bar */}
      <Navbar
        currentStep={step}
        onNavigate={navigateTo}
        onSignIn={() => setAuthOpen(true)}
        soundActive={soundActive}
        onToggleSound={toggleSound}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setTheme(isDarkMode ? 'light' : 'dark')}
      />

      {/* Main View Transitions with Framer Motion */}
      <AnimatePresence mode="wait">
        {/* 1. Home / Search Page */}
        {step === 'home' && (
          <motion.main key="home" {...fadeVariants}>
            <HomeView
              searchData={searchData}
              setSearch={setSearch}
              onSearch={() => navigateTo('results')}
            />
          </motion.main>
        )}

        {/* 2. Flight Results Page */}
        {step === 'results' && (
          <motion.main key="results" {...fadeVariants}>
            <FlightResults
              searchData={searchData}
              onSelectFlight={handleSelectFlight}
              onEditSearch={() => navigateTo('home')}
              savedFlights={savedFlights}
              onToggleSaveFlight={toggleSaveFlight}
            />
          </motion.main>
        )}

        {step === 'destinations' && (
          <motion.main key="destinations" {...fadeVariants}>
            <DestinationsPage onSearch={() => navigateTo('results')} />
          </motion.main>
        )}

        {step === 'flight-status' && (
          <motion.main key="flight-status" {...fadeVariants}>
            <FlightStatusPage onFindFlights={() => navigateTo('results')} />
          </motion.main>
        )}

        {/* 3. Booking Workflow (Passenger Details, Seat Selection, Payment) */}
        {['passenger', 'seats', 'payment'].includes(step) && (
          <motion.main key={step} {...fadeVariants} className="page-wrap booking-page">
            <BookingProgressHeader
              currentStep={step}
              onBackToResults={() => navigateTo('results')}
            />
            <div className="booking-layout">
              <div className="booking-main">
                {step === 'passenger' && (
                  <PassengerForm
                    passenger={passenger}
                    setPassenger={setPassenger}
                    onNext={() => navigateTo('seats')}
                    onBack={() => navigateTo('results')}
                  />
                )}
                {step === 'seats' && (
                  <SeatMap
                    selectedSeat={seat}
                    onSelectSeat={setSeat}
                    passenger={passenger}
                    flight={selectedFlight}
                    onNext={() => navigateTo('payment')}
                    onBack={() => navigateTo('passenger')}
                  />
                )}
                {step === 'payment' && (
                  <PaymentSection
                    totalAmount={totalAmount}
                    flight={selectedFlight}
                    passenger={passenger}
                    seat={seat}
                    onPaySuccess={handleCompleteBooking}
                    onBack={() => navigateTo('seats')}
                  />
                )}
              </div>

              {/* Sticky Summary Card */}
              <BookingSummaryCard
                flight={selectedFlight}
                searchData={searchData}
                seat={seat}
                total={totalAmount}
              />
            </div>
          </motion.main>
        )}

        {/* 4. Booking Confirmation View */}
        {step === 'confirmation' && (
          <motion.main key="confirmation" {...fadeVariants}>
            <BookingConfirmation
              booking={booking}
              onHome={() => navigateTo('home')}
            />
          </motion.main>
        )}
      </AnimatePresence>

      <Footer onNavigate={navigateTo} booking={booking} />

      {/* Auth Modal */}
      <AnimatePresence>
        {authOpen && <AuthUI onClose={() => setAuthOpen(false)} />}
      </AnimatePresence>
    </div>
  )
}

function Navbar({ currentStep, onNavigate, onSignIn, soundActive, onToggleSound, isDarkMode, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="navbar">
      <div className="nav-inner">
        <button className="brand" onClick={() => onNavigate('home')}>
          <span className="brand-mark">
            <Plane size={18} />
          </span>
          <span>
            skyvoyage<span className="brand-dot">.</span>
          </span>
        </button>

        <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
          <button
            className={currentStep === 'home' ? 'nav-active' : ''}
            onClick={() => {
              setMenuOpen(false)
              onNavigate('home')
            }}
          >
            Explore
          </button>
          <button
            className={currentStep === 'results' ? 'nav-active' : ''}
            onClick={() => {
              setMenuOpen(false)
              onNavigate('results')
            }}
          >
            Find Flights
          </button>
          <button
            className={currentStep === 'destinations' ? 'nav-active' : ''}
            onClick={() => {
              setMenuOpen(false)
              onNavigate('destinations')
            }}
          >
            Destinations
          </button>
          <button
            className={currentStep === 'flight-status' ? 'nav-active' : ''}
            onClick={() => {
              setMenuOpen(false)
              onNavigate('flight-status')
            }}
          >
            Flight Status
          </button>
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
            <span>{isDarkMode ? 'Light mode' : 'Dark mode'}</span>
          </button>

          {/* Sound FX Toggle Button */}
          <button
            type="button"
            className="sound-toggle-btn"
            onClick={onToggleSound}
            title={soundActive ? 'Mute Sound FX' : 'Enable Sound FX'}
          >
            {soundActive ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span>{soundActive ? 'Sound On' : 'Muted'}</span>
          </button>

          <button className="sign-in" onClick={onSignIn} aria-label="Sign in">
            <span>Sign in</span>
            <ArrowRight size={15} />
          </button>

          <button
            aria-label="Toggle mobile menu"
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  )
}

function HomeView({ searchData, setSearch, onSearch }) {
  return (
    <div className="home-landing">
      {/* Hero Section */}
      <section className="hero home-hero">
        <div className="hero-image" />
        <div className="hero-shade" />
        <div className="hero-content home-hero-inner">
          <motion.div className="home-hero-copy" {...fadeVariants}>
            <div className="eyebrow light">
              <Sparkles size={14} /> THE WORLD, A LITTLE CLOSER
            </div>
            <h1>
              Find your
              <br />
              somewhere <em>wonderful.</em>
            </h1>
            <p>
              Thoughtful journeys begin with one good choice. Discover remarkable places, carefully selected flights, and a smoother way to get there.
            </p>
            <button
              className="hero-link"
              onClick={() =>
                document.getElementById('search-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
              }
            >
              Find your flight <ArrowRight size={17} />
            </button>
          </motion.div>
          <motion.aside
            className="home-route-preview"
            aria-label="Featured journey from New York to London"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.55 }}
          >
            <div className="home-route-topline"><span><span className="home-route-live-dot" /> THIS WEEK'S FARE</span><ShieldCheck size={15} />
            </div>
            <div className="home-route-route">
              <div><small>NEW YORK</small><b>JFK</b><span>New York</span></div>
              <div className="home-route-track"><span>NONSTOP · 7H 45M</span><i><Plane size={17} /></i></div>
              <div className="home-route-destination"><small>LONDON</small><b>LHR</b><span>United Kingdom</span></div>
            </div>
            <div className="home-route-bottom"><span><b>Thoughtful fares</b><small>Handpicked flights, one easy search</small></span><span className="home-route-price"><small>ROUND TRIP FROM</small><b>$428</b></span></div>
            <div className="home-route-glow" />
          </motion.aside>
        </div>
        <div className="hero-note">
          <span>01 / 08</span>
          <span className="note-line" />
          <span>THOUGHTFUL FLIGHTS. MEMORABLE PLACES.</span>
        </div>
      </section>

      {/* 1. Enhanced Flight Search Section */}
      <FlightSearchSection
        searchData={searchData}
        setSearch={setSearch}
        onSearchFlights={onSearch}
      />

      {/* Trust & Accreditations Row */}
      <section className="trust-row">
        <div>
          <ShieldCheck />
          <span>
            <b>Flexible Bookings</b>
            <small>Free changes within 24 hours</small>
          </span>
        </div>
        <div>
          <Plane />
          <span>
              <b>Worldwide routes</b>
              <small>More than 300 connected destinations</small>
          </span>
        </div>
        <div>
          <Heart />
          <span>
            <b>Crafted for You</b>
            <small>Personalized seating & amenities</small>
          </span>
        </div>
        <div className="trust-rating">
          <Star fill="currentColor" />
          <span>
              <b>Rated 4.9 out of 5</b>
            <small>Trusted by 35,000+ travelers</small>
          </span>
        </div>
      </section>

      {/* Destination Inspiration */}
      <section id="destinations" className="destinations-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">A LITTLE INSPIRATION</div>
            <h2>Places worth the journey.</h2>
          </div>
          <button className="text-link" onClick={onSearch}>
            See all destinations <ArrowRight size={16} />
          </button>
        </div>
        <div className="destination-grid">
          {[
            {
              name: 'Amalfi Coast',
              country: 'ITALY',
              price: '$620',
              image: 'photo-1533105079780-92b9be482077',
            },
            {
              name: 'Kyoto in Bloom',
              country: 'JAPAN',
              price: '$890',
              image: 'photo-1493976040374-85c8e12f0c0e',
            },
            {
              name: 'The Blue Hour',
              country: 'MOROCCO',
              price: '$540',
              image: 'photo-1539020140153-e479b8c22e70',
            },
            {
              name: 'Lisbon in the sun',
              country: 'PORTUGAL',
              price: '$485',
              image: 'photo-1555881400-74d7acaacd8b',
            },
            {
              name: 'Somewhere in Bali',
              country: 'INDONESIA',
              price: '$760',
              image: 'photo-1537996194471-e657df975ab4',
            },
            {
              name: 'The quiet north',
              country: 'ICELAND',
              price: '$695',
              image: 'photo-1476610182048-b716b8518aae',
            },
            {
              name: 'Golden hour in Cape Town',
              country: 'SOUTH AFRICA',
              price: '$820',
              image: 'photo-1580060839134-75a5edca2e99',
            },
            {
              name: 'A weekend in New York',
              country: 'UNITED STATES',
              price: '$390',
              image: 'photo-1518391846015-55a9cc003b25',
            },
          ].map((d) => (
            <motion.button
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="destination-card"
              key={d.name}
              onClick={onSearch}
            >
              <img
                src={`https://images.unsplash.com/${d.image}?auto=format&fit=crop&w=900&q=85`}
                alt={d.name}
              />
              <span className="destination-gradient" />
              <span className="destination-price">from {d.price}</span>
              <span className="destination-copy">
                <small>{d.country}</small>
                <b>{d.name}</b>
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Travel Tools: Handpicked flight & live status card */}
      <section id="travel-tools" className="travel-tools-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">TRAVEL, THOUGHTFULLY ARRANGED</div>
            <h2>Every detail, in good hands.</h2>
          </div>
          <span className="travel-tools-copy">
            A closer look at the journey, from takeoff to touchdown.
          </span>
        </div>
        <div className="travel-tools-grid">
          <FeaturedFlightCard
            imageUrl="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1000&q=85"
            airline="British Airways"
            flightCode="BA 117"
            flightClass="World Traveller"
            departureCode="JFK"
            departureCity="New York"
            departureTime="10:40 PM"
            arrivalCode="LHR"
            arrivalCity="London"
            arrivalTime="10:25 AM"
            duration="7h 45m"
            onSelect={onSearch}
          />
          <FlightStatusCard
            airlineName="British Airways"
            airlineLogo={<span className="status-logo">BA</span>}
            planeImageSrc="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80"
            flightNumber="BA 117"
            gate="B12"
            origin={{ city: 'New York', code: 'JFK' }}
            destination={{ city: 'London', code: 'LHR' }}
            status={{ text: 'On time', color: 'green' }}
            boardingStatusText="Boarding soon"
            boardingTimeLeft="35 min"
            gateCloseTime="10:10 PM"
            boardingStartTime="9:35 PM"
            boardingEndTime="10:10 PM"
            progressPercent={35}
            onTrack={onSearch}
          />
        </div>
        <div className="partner-row">
          <div>
            <small>CONNECTED TO THE WORLD</small>
            <b>Premier airlines for every journey</b>
          </div>
          <Suspense fallback={<div className="partner-fallback">Air France · Delta · Emirates · KLM · Lufthansa · Singapore Airlines</div>}>
            <IconCloud
              iconSlugs={[
                'airfrance',
                'delta',
                'emirates',
                'qatarairways',
                'klm',
                'lufthansa',
                'britishairways',
                'singaporeairlines',
              ]}
            />
          </Suspense>
        </div>
      </section>
    </div>
  )
}

const destinationShowcase = [
  { name: 'Amalfi Coast', country: 'Italy', price: '$620', image: 'photo-1533105079780-92b9be482077', note: 'Slow days by the sea' },
  { name: 'Kyoto in bloom', country: 'Japan', price: '$890', image: 'photo-1493976040374-85c8e12f0c0e', note: 'Old streets, new seasons' },
  { name: 'The blue hour', country: 'Morocco', price: '$540', image: 'photo-1539020140153-e479b8c22e70', note: 'A city made for wandering' },
  { name: 'Lisbon in the sun', country: 'Portugal', price: '$485', image: 'photo-1555881400-74d7acaacd8b', note: 'Golden light and tiled lanes' },
  { name: 'Somewhere in Bali', country: 'Indonesia', price: '$760', image: 'photo-1537996194471-e657df975ab4', note: 'Find your island rhythm' },
  { name: 'The quiet north', country: 'Iceland', price: '$695', image: 'photo-1476610182048-b716b8518aae', note: 'Wide skies, quieter days' },
  { name: 'Golden hour in Cape Town', country: 'South Africa', price: '$820', image: 'photo-1580060839134-75a5edca2e99', note: 'Mountain air meets the sea' },
  { name: 'A weekend in New York', country: 'United States', price: '$390', image: 'photo-1518391846015-55a9cc003b25', note: 'The city that keeps unfolding' },
]

function DestinationsPage({ onSearch }) {
  return (
    <div className="destination-page page-wrap">
      <div className="destination-page-heading">
        <div className="eyebrow">YOUR NEXT CHAPTER</div>
        <h1>Go where you feel most alive.</h1>
        <p>Thoughtful places, inspiring fares, and a little room to dream.</p>
      </div>
      <div className="destination-page-grid">
        {destinationShowcase.map((place) => (
          <motion.button key={place.name} className="destination-page-card" onClick={onSearch} whileHover={{ y: -5 }}>
            <img src={`https://images.unsplash.com/${place.image}?auto=format&fit=crop&w=900&q=85`} alt={`${place.name}, ${place.country}`} loading="lazy" />
            <span className="destination-page-shade" />
            <span className="destination-page-fare">Flights from {place.price}</span>
            <span className="destination-page-copy"><small>{place.country}</small><b>{place.name}</b><i>{place.note}</i></span>
          </motion.button>
        ))}
      </div>
      <div className="destination-page-cta"><span><b>Have a place in mind?</b><small>Find a route that takes you there.</small></span><button className="primary-btn" onClick={onSearch}>Find flights <ArrowRight size={16} /></button></div>
    </div>
  )
}

function FlightStatusPage({ onFindFlights }) {
  const [query, setQuery] = useState('')
  const [flight, setFlight] = useState(null)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')

  const searchStatus = (event) => {
    event.preventDefault()
    const normalized = query.trim().replace(/\s+/g, '').toLowerCase()
    if (!normalized) { setError('Enter a flight number to check its status.'); setFlight(null); setSearched(false); return }
    const match = sampleFlightStatuses.find((item) => item.id.toLowerCase() === normalized || item.flightNumber.replace(/\s+/g, '').toLowerCase() === normalized)
    setFlight(match || null)
    setSearched(true)
    setError(match ? '' : 'No demo status is available for that flight. Try BA 117, SQ 25, DL 003, or EK 202.')
  }

  const selectSampleFlight = (sample) => {
    setQuery(sample.flightNumber)
    setFlight(sample)
    setSearched(true)
    setError('')
  }

  const origin = flight && cities.find((city) => city.code === flight.from)
  const destination = flight && cities.find((city) => city.code === flight.to)

  return (
    <section className="flight-status-page page-wrap">
      <div className="status-page-heading"><div className="eyebrow">YOUR JOURNEY, IN REAL TIME</div><h1>Flight status</h1><p>Check a flight number for a sample departure update.</p></div>
      <form className="status-lookup" onSubmit={searchStatus}>
        <label htmlFor="flight-number">Flight number</label>
        <div className="status-lookup-row"><input id="flight-number" value={query} onChange={(event) => { setQuery(event.target.value); setError('') }} placeholder="For example, BA 117" aria-describedby={error ? 'status-message' : undefined} /><button className="primary-btn" type="submit"><Search size={16} /> Check status</button></div>
        <small id="status-message" className={error ? 'status-error' : 'status-hint'}>{error || 'Try one of the sample flights below. Statuses are illustrative demo information.'}</small>
      </form>
      {flight && origin && destination && (
        <motion.div className="status-result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="status-result-heading"><span><b>Flight found</b><small>Sample status · Updated just now</small></span><span className="status-demo-tag">DEMO DATA</span></div>
          <FlightStatusCard
            airlineName={flight.airline}
            airlineLogo={<span className="status-logo">{flight.brand}</span>}
            planeImageSrc="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1000&q=85"
            flightNumber={flight.flightNumber}
            gate={flight.gate || 'B12'}
            origin={{ city: origin.city, code: origin.code }}
            destination={{ city: destination.city, code: destination.code }}
            status={{ text: flight.statusText || 'On time', color: flight.statusColor || 'green' }}
            boardingStatusText={flight.boarding || 'Boarding information'}
            boardingTimeLeft={flight.boardingTime || 'See your airline for live updates'}
            gateCloseTime={flight.closes || '10:10 PM'}
            boardingStartTime={flight.start || '9:35 PM'}
            boardingEndTime={flight.end || '10:10 PM'}
            progressPercent={flight.progress || 35}
            onTrack={onFindFlights}
            actionLabel="Find this route"
          />
        </motion.div>
      )}
      {!flight && (
        <section className="status-sample-board" aria-labelledby="sample-status-heading">
          <div className="status-sample-heading">
            <div><span className="eyebrow">SAMPLE DEPARTURES</span><h2 id="sample-status-heading">A few flights in motion.</h2></div>
            <small>Select a flight to see its demo update.</small>
          </div>
          <div className="status-sample-grid">
            {sampleFlightStatuses.map((sample) => {
              const fromCity = cities.find((city) => city.code === sample.from)
              const toCity = cities.find((city) => city.code === sample.to)
              return (
                <button className="status-sample-item" key={sample.id} type="button" onClick={() => selectSampleFlight(sample)}>
                  <span className="status-sample-airline"><i style={{ backgroundColor: sample.color }}>{sample.brand}</i><span><b>{sample.flightNumber}</b><small>{sample.airline}</small></span></span>
                  <span className="status-sample-route"><b>{sample.from}</b><ArrowRight size={14} /><b>{sample.to}</b></span>
                  <span className={`status-sample-pill ${sample.statusColor}`}>{sample.statusText}</span>
                  <small className="status-sample-cities">{fromCity?.city} to {toCity?.city}</small>
                </button>
              )
            })}
          </div>
        </section>
      )}
      <p className="status-disclaimer">Flight details on this page are illustrative mock data and are not connected to live airline systems.</p>
    </section>
  )
}

function Footer({ onNavigate, booking }) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [legalPanel, setLegalPanel] = useState('')

  const subscribe = (event) => {
    event.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
  }

  const scrollTo = (id) => {
    if (document.getElementById(id)) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    onNavigate('home')
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 350)
  }

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand-column">
          <button className="brand" onClick={() => onNavigate('home')} aria-label="SkyVoyage home">
            <span className="brand-mark"><Plane size={17} /></span>
            <span>skyvoyage<span className="brand-dot">.</span></span>
          </button>
          <p>Thoughtful journeys, from the first search to the moment you land.</p>
          <span className="footer-trust"><ShieldCheck size={15} /> Your next trip is in good hands.</span>
        </div>

        <div className="footer-link-group">
          <b>Explore</b>
          <button onClick={() => onNavigate('results')}>Find a flight</button>
          <button onClick={() => scrollTo('destinations')}>Popular destinations</button>
          <button onClick={() => scrollTo('travel-tools')}>Travel inspiration</button>
        </div>
        <div className="footer-link-group">
          <b>Your trip</b>
          <button onClick={() => booking ? onNavigate('confirmation') : setLegalPanel('manage')}>Manage booking</button>
          <button onClick={() => setLegalPanel('baggage')}>Baggage information</button>
          <button onClick={() => setLegalPanel('travel')}>Travel requirements</button>
        </div>
        <div className="footer-link-group">
          <b>We’re here to help</b>
          <a href="mailto:hello@skyvoyage.com"><Mail size={14} /> Email our travel team</a>
          <span><MapPin size={14} /> Here for you, wherever you are</span>
          <button onClick={() => setLegalPanel('support')}>Visit the help center</button>
        </div>

        <form className="footer-newsletter" onSubmit={subscribe}>
          <label htmlFor="footer-email">A little inspiration, occasionally.</label>
          <p>Travel notes and thoughtful fares. No noise.</p>
          {subscribed ? (
            <div className="newsletter-success" role="status"><Check size={16} /> You’re on the list. See you out there.</div>
          ) : (
            <div className="newsletter-input-wrap">
              <input id="footer-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email address" autoComplete="email" required />
              <button aria-label="Subscribe to travel notes" type="submit"><ArrowRight size={17} /></button>
            </div>
          )}
          <small>By subscribing, you agree to our <button type="button" onClick={() => setLegalPanel('privacy')}>Privacy Policy</button>.</small>
        </form>
      </div>
      <div className="footer-bottom">
        <span>© 2026 SkyVoyage, Inc. All rights reserved.</span>
        <div className="footer-bottom-links">
          <button onClick={() => setLegalPanel('privacy')}>Privacy</button>
          <button onClick={() => setLegalPanel('terms')}>Terms</button>
          <button onClick={() => setLegalPanel('accessibility')}>Accessibility</button>
          <span className="footer-region">United States · USD $</span>
        </div>
      </div>
      <AnimatePresence>
        {legalPanel && (
          <motion.div className="footer-dialog-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setLegalPanel('') }}>
            <motion.div className="footer-dialog" role="dialog" aria-modal="true" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
              <button className="footer-dialog-close" onClick={() => setLegalPanel('')} aria-label="Close"><X size={18} /></button>
              <div className="eyebrow">SKYVOYAGE GUEST CARE</div>
              <h3>{legalPanel === 'privacy' ? 'Your privacy matters.' : legalPanel === 'terms' ? 'Clear skies, clear terms.' : legalPanel === 'accessibility' ? 'Travel should be for everyone.' : legalPanel === 'baggage' ? 'Bring what you need.' : legalPanel === 'travel' ? 'A smoother arrival starts here.' : legalPanel === 'manage' ? 'Your trips, in one place.' : 'How can we help?'}</h3>
              <p>{legalPanel === 'privacy' ? 'This booking experience is a frontend demo. Information entered here stays in the current browser session and is not sent to a booking service.' : legalPanel === 'terms' ? 'Flight prices and schedules shown here are sample data for demonstration. No reservation or payment is created by this website.' : legalPanel === 'accessibility' ? 'SkyVoyage is designed for keyboard, touch, and reduced-motion use. If anything makes your journey harder, let our team know.' : legalPanel === 'baggage' ? 'Baggage allowances vary by airline and fare. Your selected flight’s details panel includes the mock carry-on and checked-bag allowance for that itinerary.' : legalPanel === 'travel' ? 'Entry rules depend on your passport, destination, and travel dates. Check your destination government’s current guidance and airline document requirements before departure.' : legalPanel === 'manage' ? booking ? `Your demo booking ${booking.ref} is ready to view${booking.passenger?.first ? ` for ${booking.passenger.first} ${booking.passenger.last}` : ''}.` : 'You don’t have a completed booking in this session yet. Once you finish checkout, your ticket will be available here.' : 'Our travel team is ready to help with flight search, baggage questions, or booking guidance. Email hello@skyvoyage.com and we’ll be glad to point you in the right direction.'}</p>
              {legalPanel === 'manage' ? (
                <button className="primary-btn" onClick={() => { setLegalPanel(''); onNavigate(booking ? 'confirmation' : 'results') }}>
                  {booking ? 'View my ticket' : 'Find flights'} <ArrowRight size={15} />
                </button>
              ) : (
                <button className="primary-btn" onClick={() => setLegalPanel('')}>Got it</button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  )
}

export default App
