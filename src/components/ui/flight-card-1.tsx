import * as React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Plane } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FlightCardProps {
  imageUrl: string
  airline: string
  flightCode: string
  flightClass: string
  departureCode: string
  departureCity: string
  departureTime: string
  arrivalCode: string
  arrivalCity: string
  arrivalTime: string
  duration: string
  className?: string
  onSelect?: () => void
}

export const FlightCard = React.forwardRef<HTMLDivElement, FlightCardProps>(function FlightCard({
  imageUrl, airline, flightCode, flightClass, departureCode, departureCity, departureTime,
  arrivalCode, arrivalCity, arrivalTime, duration, className, onSelect,
}, ref) {
  return <motion.article ref={ref} className={cn('sky-feature-flight', className)} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -3 }}>
    <div className="sky-feature-flight-image"><img src={imageUrl} alt="Scenic view from an airplane window" loading="lazy"/><span>HANDPICKED ROUTE</span></div>
    <div className="sky-feature-flight-body"><div className="sky-feature-route">
      <div><small>{departureTime}</small><b>{departureCode}</b><span>{departureCity}</span></div>
      <div className="sky-feature-route-mid"><small>{flightCode}</small><span><i/><Plane size={15}/><i/></span><small>{duration}</small></div>
      <div className="sky-feature-arrival"><small>{arrivalTime}</small><b>{arrivalCode}</b><span>{arrivalCity}</span></div>
    </div><div className="sky-feature-meta"><span><small>AIRLINE</small><b>{airline}</b></span><span><small>CLASS</small><b>{flightClass}</b></span><button onClick={onSelect}>Explore flights <ArrowRight size={14}/></button></div></div>
  </motion.article>
})
FlightCard.displayName = 'FlightCard'
