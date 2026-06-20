'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'

// Web Audio API Click Synthesizer
const playClickSound = (pitch = 800, duration = 0.03) => {
  if (typeof window === 'undefined') return
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(pitch, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + duration)
    
    gain.gain.setValueAtTime(0.08, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch (err) {
    console.warn('Audio click failed:', err)
  }
}

const SEASONS = [
  { id: 0, name: 'Spring Equinox', color: '#4FC3F7' },
  { id: 1, name: 'Summer Solstice', color: '#FF7043' },
  { id: 2, name: 'Autumn Equinox', color: '#FFA726' },
  { id: 3, name: 'Winter Solstice', color: '#90CAF9' },
]

export default function RotorWheel({ type, value, onChange, dialImage, disabled, size = 140 }) {
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startAngle, setStartAngle] = useState(0)
  const [dragStartRotation, setDragStartRotation] = useState(0)
  const dialRef = useRef(null)
  const lastIndexRef = useRef(0)

  const isSeason = type === 'season'
  const steps = isSeason ? 4 : 24
  const stepDeg = 360 / steps
  const accentColor = isSeason ? '#FFE500' : '#FF8C00'

  // Sync rotation with external value changes (e.g., on reset)
  useEffect(() => {
    if (isSeason) {
      // Spring=0deg, Summer=270deg, Autumn=180deg, Winter=90deg to keep correct season at the top
      const targetRot = ((4 - value) % 4) * 90
      setRotation(targetRot)
      lastIndexRef.current = (4 - value) % 4
    } else {
      // hour 1=15deg from 24 at top... hour maps to rotation
      const rawIndex = (24 - value + 24) % 24
      setRotation(rawIndex * 15)
      lastIndexRef.current = rawIndex
    }
  }, [value, isSeason])

  const getAngle = useCallback((x, y) => {
    if (!dialRef.current) return 0
    const rect = dialRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const rad = Math.atan2(y - cy, x - cx)
    const deg = (rad * 180) / Math.PI
    return (deg + 360) % 360
  }, [])

  const startDrag = useCallback((clientX, clientY) => {
    if (disabled) return
    setIsDragging(true)
    setStartAngle(getAngle(clientX, clientY) - rotation)
    setDragStartRotation(rotation)
  }, [getAngle, rotation, disabled])

  const onDrag = useCallback((clientX, clientY) => {
    if (!isDragging) return
    const currentAngle = getAngle(clientX, clientY)
    const newRot = currentAngle - startAngle
    setRotation(newRot)

    let norm = newRot % 360
    if (norm < 0) norm += 360
    const rawIndex = Math.round(norm / stepDeg) % steps

    if (rawIndex !== lastIndexRef.current) {
      lastIndexRef.current = rawIndex
      playClickSound(isSeason ? 400 : 1100, isSeason ? 0.04 : 0.015)
    }
  }, [isDragging, getAngle, startAngle, stepDeg, steps, isSeason])

  const endDrag = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)

    // Detect if this was a click (no significant movement)
    if (Math.abs(rotation - dragStartRotation) < 2) {
      playClickSound(isSeason ? 220 : 700, isSeason ? 0.12 : 0.04)
      if (isSeason) {
        onChange((value + 1) % 4)
      } else {
        onChange(value === 24 ? 1 : value + 1)
      }
      return
    }

    // Snap to nearest step
    let norm = rotation % 360
    if (norm < 0) norm += 360

    const rawIndex = Math.round(norm / stepDeg) % steps
    const snapAngle = rawIndex * stepDeg

    let delta = snapAngle - norm
    if (delta > 180) delta -= 360
    if (delta < -180) delta += 360
    const snapped = rotation + delta
    setRotation(snapped)

    playClickSound(isSeason ? 220 : 700, isSeason ? 0.12 : 0.04)

    if (isSeason) {
      // rawIndex = rotation direction, seasonIndex = (4 - rawIndex) % 4
      const seasonIdx = (4 - rawIndex) % 4
      onChange(seasonIdx)
    } else {
      let logicalHour = 24 - rawIndex
      if (logicalHour === 0) logicalHour = 24
      if (logicalHour > 24) logicalHour = logicalHour - 24
      onChange(logicalHour)
    }
  }, [isDragging, rotation, dragStartRotation, value, stepDeg, steps, isSeason, onChange])

  // Mouse events
  const handleMouseDown = (e) => {
    e.preventDefault()
    startDrag(e.clientX, e.clientY)
  }

  useEffect(() => {
    const handleMouseMove = (e) => onDrag(e.clientX, e.clientY)
    const handleMouseUp = () => endDrag()
    const handleTouchMove = (e) => { if (e.touches[0]) onDrag(e.touches[0].clientX, e.touches[0].clientY) }

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('touchend', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [isDragging, onDrag, endDrag])

  // Display label
  let displayLabel = ''
  if (isSeason) {
    displayLabel = SEASONS[value]?.name || 'Spring Equinox'
  } else {
    const h = value.toString().padStart(2, '0')
    displayLabel = `${h}:00 HRS`
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      {/* Outer casing (Brass Bezel) */}
      <div
        style={{
          position: 'relative',
          width: size + 24,
          height: size + 24,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #b38728 0%, #fbf5b7 30%, #aa771c 50%, #fcf6ba 70%, #8a640f 100%)',
          boxShadow: `
            0 8px 16px rgba(0,0,0,0.6),
            inset 0 2px 4px rgba(255,255,255,0.35),
            inset 0 -2px 4px rgba(0,0,0,0.4)
          `,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
        }}
      >
        {/* Inner shadow rim for recess effect */}
        <div
          style={{
            width: size + 8,
            height: size + 8,
            borderRadius: '50%',
            background: isSeason ? '#181a1f' : '#22150f',
            boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.9), 0 1px 2px rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Top pointer */}
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft: '7px solid transparent',
              borderRight: '7px solid transparent',
              borderBottom: `14px solid ${accentColor}`,
              filter: `drop-shadow(0 0 4px ${accentColor})`,
              zIndex: 10,
            }}
          />

          {/* Dial image that rotates */}
          <div
            ref={dialRef}
            onMouseDown={handleMouseDown}
            onTouchStart={(e) => {
              e.preventDefault()
              if (disabled) return
              if (e.touches[0]) startDrag(e.touches[0].clientX, e.touches[0].clientY)
            }}
            style={{
              width: size,
              height: size,
              borderRadius: '50%',
              backgroundImage: `url(${dialImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              cursor: disabled ? 'not-allowed' : isDragging ? 'grabbing' : 'grab',
              transform: `rotate(${rotation}deg)`,
              transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)',
              WebkitUserDrag: 'none',
            }}
          />
        </div>
      </div>

      {/* Readout */}
      <div
        style={{
          fontFamily: 'Courier Prime, monospace',
          fontSize: '11px',
          fontWeight: 'bold',
          color: accentColor,
          background: '#0a0a0a',
          padding: '3px 10px',
          borderRadius: '4px',
          border: `1px solid ${accentColor}`,
          boxShadow: `0 0 6px ${accentColor}`,
          whiteSpace: 'nowrap',
          textAlign: 'center',
          minWidth: '120px',
        }}
      >
        {displayLabel}
      </div>
    </div>
  )
}
