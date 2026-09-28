import * as React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, PlaneTakeoff } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FlightStatusCardProps {
  airlineName: string
  airlineLogo: React.ReactNode
  planeImageSrc: string
  flightNumber: string
  gate: string
  origin: { city: string; code: string }
  destination: { city: string; code: string }
  status: { text: string; color: 'green' | 'orange' | 'red' }
  boardingStatusText: string
  boardingTimeLeft?: string
  gateCloseTime: string
  boardingStartTime: string
  boardingEndTime: string
  progressPercent: number
  className?: string
  onTrack?: () => void
  actionLabel?: string
}

const statusColors = { green: '#36a77c', orange: '#e29951', red: '#db6b69' }

export const FlightStatusCard = React.forwardRef<HTMLDivElement, FlightStatusCardProps>(function FlightStatusCard({
  airlineName, airlineLogo, planeImageSrc, flightNumber, gate, origin, destination, status,
  boardingStatusText, boardingTimeLeft, gateCloseTime, boardingStartTime, boardingEndTime,
  progressPercent, className, onTrack, actionLabel = 'Trip details',
}, ref) {
  const progress = Math.min(100, Math.max(0, progressPercent))
  return <article ref={ref} className={cn('sky-status-card', className)}>
    <div className="sky-status-top"><div className="sky-status-plane"><img src={planeImageSrc} alt="Airplane" loading="lazy"/><span>YOUR TRAVEL, AT A GLANCE</span></div>
      <div className="sky-status-route-row"><div className="sky-status-airline">{airlineLogo || <PlaneTakeoff size={20}/>}<span>{airlineName}</span></div><div className="sky-status-flight"><b>{flightNumber} · Gate {gate}</b><span>{origin.code} <ArrowRight size={13}/> {destination.code}</span></div></div>
      <div className="sky-status-cities"><span><b>{origin.code}</b>{origin.city}</span><i/><span><b>{destination.code}</b>{destination.city}</span></div>
      <div className="sky-status-state"><i style={{ background: statusColors[status.color] }}/><b>{status.text}</b>{onTrack && <button onClick={onTrack}>{actionLabel} <ArrowRight size={13}/></button>}</div>
    </div>
    <div className="sky-status-bottom"><div className="sky-status-status"><b>{boardingStatusText}</b>{boardingTimeLeft && <span>· {boardingTimeLeft}</span>}<small>Gate closes at {gateCloseTime}</small></div>
      <div className="sky-status-progress" role="progressbar" aria-label="Boarding progress" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><span/><motion.i initial={{ width: 0 }} whileInView={{ width: `${progress}%` }} viewport={{ once: true }} transition={{ duration: 1 }}/><motion.b initial={{ left: 0 }} whileInView={{ left: `${progress}%` }} viewport={{ once: true }} transition={{ duration: 1 }}/></div>
      <div className="sky-status-times"><span>{boardingStartTime}</span><span>{boardingEndTime}</span></div>
    </div>
  </article>
})
FlightStatusCard.displayName = 'FlightStatusCard'
