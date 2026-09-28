import { useEffect, useState } from 'react'

export interface TypewriterProps {
  text: string | string[]
  speed?: number
  cursor?: string
  loop?: boolean
  deleteSpeed?: number
  delay?: number
  className?: string
}

export function Typewriter({ text, speed = 70, cursor = '|', loop = false, deleteSpeed = 35, delay = 1400, className }: TypewriterProps) {
  const lines = Array.isArray(text) ? text : [text]
  const [lineIndex, setLineIndex] = useState(0)
  const [position, setPosition] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const current = lines[lineIndex] || ''

  useEffect(() => {
    if (!current) return
    let timeout: ReturnType<typeof setTimeout>
    if (!deleting && position < current.length) timeout = setTimeout(() => setPosition((v) => v + 1), speed)
    else if (!deleting && loop) timeout = setTimeout(() => setDeleting(true), delay)
    else if (deleting && position > 0) timeout = setTimeout(() => setPosition((v) => v - 1), deleteSpeed)
    else if (deleting) { setDeleting(false); setLineIndex((v) => (v + 1) % lines.length) }
    return () => clearTimeout(timeout)
  }, [current, position, deleting, loop, speed, deleteSpeed, delay, lines.length])

  return <span className={className}>{current.slice(0, position)}<span className="sky-type-cursor" aria-hidden="true">{cursor}</span></span>
}
