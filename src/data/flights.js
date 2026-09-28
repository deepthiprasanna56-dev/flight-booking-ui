import { globalDestinations, countries } from './countries'

export { countries, globalDestinations }
export const cities = globalDestinations

// Pre-defined base flight templates with realistic carrier details
export const baseFlights = [
  {
    id: 'sv218',
    flightNumber: 'SQ 25',
    airline: 'Singapore Airlines',
    brand: 'SQ',
    color: '#183b72',
    from: 'JFK',
    to: 'LHR',
    depart: '08:25',
    arrive: '20:10',
    duration: '7h 45m',
    durationMinutes: 465,
    stops: 0,
    price: 684,
    aircraft: 'Airbus A350-900',
    rating: '4.9',
    reviewsCount: 1420,
    baggage: '1 carry-on (10kg) · 2 checked bags (23kg each)',
    tag: 'Best Value',
    tagColor: '#168c91',
    amenities: ['High-speed Wi-Fi', 'AC & USB-C Power', 'Gourmet Dining', '4K In-seat Entertainment', 'Free Messaging'],
    pitch: '34" seat pitch',
    carbonCo2: '162 kg CO2 (-18% vs avg)',
    layover: null,
  },
  {
    id: 'sv431',
    flightNumber: 'BA 117',
    airline: 'British Airways',
    brand: 'BA',
    color: '#be1e2d',
    from: 'JFK',
    to: 'LHR',
    depart: '10:40',
    arrive: '22:25',
    duration: '7h 45m',
    durationMinutes: 465,
    stops: 0,
    price: 742,
    aircraft: 'Boeing 777-300ER',
    rating: '4.7',
    reviewsCount: 2180,
    baggage: '1 carry-on (12kg) · 1 checked bag (23kg)',
    tag: 'Popular',
    tagColor: '#305168',
    amenities: ['Wi-Fi available', 'AC Power', 'British Afternoon Tea', 'Noise-canceling headsets'],
    pitch: '32" seat pitch',
    carbonCo2: '178 kg CO2 (-10% vs avg)',
    layover: null,
  },
  {
    id: 'sv087',
    flightNumber: 'AF 023',
    airline: 'Air France',
    brand: 'AF',
    color: '#23366f',
    from: 'JFK',
    to: 'LHR',
    depart: '13:15',
    arrive: '06:40',
    duration: '11h 25m',
    durationMinutes: 685,
    stops: 1,
    price: 598,
    aircraft: 'Airbus A330-200',
    rating: '4.6',
    reviewsCount: 980,
    baggage: '1 carry-on (12kg) · 1 checked bag (23kg)',
    tag: 'Cheapest',
    tagColor: '#158087',
    amenities: ['French Champagne & Cuisine', 'Wi-Fi messaging', 'HD Touchscreen'],
    pitch: '32" seat pitch',
    carbonCo2: '190 kg CO2 (+3% vs avg)',
    layover: '1h 50m in Paris (CDG)',
  },
  {
    id: 'sv652',
    flightNumber: 'DL 003',
    airline: 'Delta Air Lines',
    brand: 'DL',
    color: '#a6192e',
    from: 'JFK',
    to: 'LHR',
    depart: '16:05',
    arrive: '04:50',
    duration: '7h 45m',
    durationMinutes: 465,
    stops: 0,
    price: 819,
    aircraft: 'Airbus A330-900neo',
    rating: '4.8',
    reviewsCount: 1640,
    baggage: '1 carry-on (10kg) · 2 checked bags (23kg each)',
    tag: 'Fastest Nonstop',
    tagColor: '#b5483e',
    amenities: ['Fast Free Wi-Fi for SkyMiles', 'Delta Studio 1,000+ Movies', 'Fresh Starbucks Coffee'],
    pitch: '33" seat pitch',
    carbonCo2: '166 kg CO2 (-16% vs avg)',
    layover: null,
  },
  {
    id: 'sv124',
    flightNumber: 'LH 401',
    airline: 'Lufthansa',
    brand: 'LH',
    color: '#1b3159',
    from: 'JFK',
    to: 'LHR',
    depart: '18:30',
    arrive: '11:15',
    duration: '10h 45m',
    durationMinutes: 645,
    stops: 1,
    price: 633,
    aircraft: 'Boeing 747-8 "Queen of the Skies"',
    rating: '4.7',
    reviewsCount: 1890,
    baggage: '1 carry-on (8kg) · 1 checked bag (23kg)',
    tag: 'Iconic Jumbo',
    tagColor: '#d68e3b',
    amenities: ['FlyNet Broadband', 'Live Sports TV', 'Warm Bavarian Hospitality'],
    pitch: '32" seat pitch',
    carbonCo2: '195 kg CO2 (+5% vs avg)',
    layover: '1h 20m in Frankfurt (FRA)',
  },
  {
    id: 'sv306',
    flightNumber: 'EK 202',
    airline: 'Emirates',
    brand: 'EK',
    color: '#c79d48',
    from: 'JFK',
    to: 'LHR',
    depart: '20:15',
    arrive: '08:00',
    duration: '7h 45m',
    durationMinutes: 465,
    stops: 0,
    price: 905,
    aircraft: 'Airbus A380-800 Superjumbo',
    rating: '4.9',
    reviewsCount: 3120,
    baggage: '1 carry-on (10kg) · 2 checked bags (25kg each)',
    tag: 'Luxury Experience',
    tagColor: '#bfa052',
    amenities: ['ICE 6,500 Channels', 'Onboard Lounge & Bar', 'Multi-course Gourmet Dining', 'Wi-Fi & Mobile Phone Service'],
    pitch: '34" seat pitch',
    carbonCo2: '172 kg CO2 (-12% vs avg)',
    layover: null,
  },
  {
    id: 'sv519',
    flightNumber: 'VS 004',
    airline: 'Virgin Atlantic',
    brand: 'VS',
    color: '#b5163e',
    from: 'JFK',
    to: 'LHR',
    depart: '21:45',
    arrive: '09:30',
    duration: '7h 45m',
    durationMinutes: 465,
    stops: 0,
    price: 776,
    aircraft: 'Airbus A350-1000',
    rating: '4.8',
    reviewsCount: 1350,
    baggage: '1 carry-on (10kg) · 1 checked bag (23kg)',
    tag: 'The Loft Lounge',
    tagColor: '#962b48',
    amenities: ['The Loft Social Space', 'Vera Entertainment', 'Mood Lighting', 'Free High-speed Wi-Fi'],
    pitch: '33" seat pitch',
    carbonCo2: '160 kg CO2 (-19% vs avg)',
    layover: null,
  },
  {
    id: 'sv743',
    flightNumber: 'KL 642',
    airline: 'KLM Royal Dutch',
    brand: 'KL',
    color: '#1b75bb',
    from: 'JFK',
    to: 'LHR',
    depart: '23:20',
    arrive: '16:05',
    duration: '10h 45m',
    durationMinutes: 645,
    stops: 1,
    price: 572,
    aircraft: 'Boeing 787-9 Dreamliner',
    rating: '4.6',
    reviewsCount: 880,
    baggage: '1 carry-on (12kg) · 1 checked bag (23kg)',
    tag: 'Eco-Friendly Dreamliner',
    tagColor: '#17739e',
    amenities: ['Larger Dimmable Windows', 'Sustainable Biofuel Flights', 'Dutch Delft Houses for Club'],
    pitch: '31" seat pitch',
    carbonCo2: '154 kg CO2 (-22% vs avg)',
    layover: '1h 35m in Amsterdam (AMS)',
  },
]

export const flights = baseFlights

/**
 * Finds or generates destination details based on query (city name, code, or country)
 */
export function findDestination(term) {
  if (!term) return globalDestinations[0]
  const clean = term.trim().toLowerCase()
  return (
    globalDestinations.find(
      (d) =>
        d.city.toLowerCase() === clean ||
        d.code.toLowerCase() === clean ||
        d.country.toLowerCase() === clean ||
        d.airport.toLowerCase().includes(clean)
    ) || {
      city: term,
      airport: `${term} International`,
      code: term.slice(0, 3).toUpperCase(),
      country: 'Global',
      flag: '🌍',
      terminal: 'T1',
      popular: false,
    }
  )
}

/**
 * Dynamically builds realistic flight options tailored to any chosen origin and destination
 */
export function getFlightsForRoute(originTerm, destTerm, cabin = 'Economy') {
  const origin = findDestination(originTerm)
  const dest = findDestination(destTerm)

  const cabinMultiplier =
    cabin === 'First Class'
      ? 2.8
      : cabin === 'Business'
      ? 2.1
      : cabin === 'Premium Economy'
      ? 1.45
      : 1.0

  return baseFlights.map((base) => {
    const adjustedPrice = Math.round(base.price * cabinMultiplier)
    return {
      ...base,
      from: origin.code,
      to: dest.code,
      fromCity: origin.city,
      toCity: dest.city,
      fromCountry: origin.country,
      toCountry: dest.country,
      fromFlag: origin.flag,
      toFlag: dest.flag,
      price: adjustedPrice,
    }
  })
}

export const money = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)

export const formatDate = (date) =>
  date
    ? new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Select date'
