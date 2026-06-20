'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { VINE_COLORS, VINE_COLOR_MAP, DECOY_ANIMALS } from '@/lib/gameData'

// Vine anchors hanging from the tree branch at the top right of the canvas
const VINE_ANCHORS = {
  0: { x: 20, y: -90, restingH: 200 },
  1: { x: 90, y: -80, restingH: 200 },
  2: { x: 150, y: -70, restingH: 200 },
}

const SOCKET_LABELS = {
  Alligator_Pool: '🐊 Swamp Pool',
  Bear_Cave: '🐻 Bear Cave',
  Crab_Shore: '🦀 Crab Shore',
  Dolphin_Reef: '🐬 Dolphin Reef',
  Elephant_Wall: '🐘 Mud Bath',
  Frog_Lilypad: '🐸 Lilypad',
  Gorilla_Jungle: '🦍 Jungle Wall',
  Hippo_River: '🦛 Mud River',
  Iguana_Branch: '🦎 Warm Rocks',
  Jaguar_Lair: '🐆 Night Cave',
  Kangaroo_Pouch: '🦘 Outback',
  Lion_Den: '🦁 Royal Den',
  Monkey_Nest: '🐒 Tree Nest',
  Newt_Pond: '🦎 Newt Pond',
  Owl_Nest: '🦉 Owl Nest',
  Panda_Grove: '🐼 Bamboo Grove',
  Quail_Bush: '🐦 Quail Bush',
  Rhino_Mud: '🦏 Rhino Mud',
  Snake_Hole: '🐍 Sand Bed',
  Tiger_Thicket: '🐯 Frozen Wood',
  Urchin_Rock: '🦔 Deep Water',
  Vulture_Peak: '🦅 Windy Peak',
  Whale_Ocean: '🐋 Ocean Current',
  Xerus_Burrow: '🐿️ Dirt Burrow',
  Yak_Mountain: '🐃 High Ridge',
  Zebra_Plains: '🦓 Grasslands',
}

// Global audio context variables for cello sound synthesis
let audioCtx = null
let celloOsc = null
let celloGain = null

// Start cello hum when pulling vine
const startCelloHum = (frequency = 90) => {
  if (typeof window === 'undefined') return
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    if (!audioCtx) audioCtx = new AudioContext()

    // Sawtooth oscillator + warm low-pass filter to sound like a string cello hum
    celloOsc = audioCtx.createOscillator()
    celloOsc.type = 'sawtooth'
    celloOsc.frequency.setValueAtTime(frequency, audioCtx.currentTime)

    const filter = audioCtx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(280, audioCtx.currentTime)

    celloGain = audioCtx.createGain()
    celloGain.gain.setValueAtTime(0.001, audioCtx.currentTime)

    celloOsc.connect(filter)
    filter.connect(celloGain)
    celloGain.connect(audioCtx.destination)

    celloOsc.start()
    celloGain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 0.1)
  } catch (e) {
    console.warn('Audio Cello Start failed:', e)
  }
}

// Update cello pitch and gain depending on stretching tension
const updateCelloHum = (frequency, tension) => {
  if (!audioCtx || !celloOsc || !celloGain) return
  try {
    celloOsc.frequency.setTargetAtTime(frequency, audioCtx.currentTime, 0.05)
    // Cello gain scales up with physical tension
    const vol = 0.04 + tension * 0.14
    celloGain.gain.setTargetAtTime(vol, audioCtx.currentTime, 0.05)
  } catch (e) { }
}

// Stop cello sound when dropping vine
const stopCelloHum = () => {
  if (!audioCtx || !celloOsc || !celloGain) return
  try {
    const prevGain = celloGain
    const prevOsc = celloOsc
    prevGain.gain.setValueAtTime(prevGain.gain.value, audioCtx.currentTime)
    prevGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15)
    setTimeout(() => {
      try {
        prevOsc.stop()
        prevOsc.disconnect()
        prevGain.disconnect()
      } catch (e) { }
    }, 200)

    celloOsc = null
    celloGain = null
  } catch (e) { }
}

// Synthesize an organic Thump-Zap plugging sound effect on snapping
const playThumpZapSound = () => {
  if (typeof window === 'undefined') return
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()

    // Thump - decaying low-frequency boom
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(140, ctx.currentTime)
    osc1.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.3)
    gain1.gain.setValueAtTime(0.35, ctx.currentTime)
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start()
    osc1.stop(ctx.currentTime + 0.3)

    // Zap - decaying high-frequency electric sweep
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sawtooth'
    osc2.frequency.setValueAtTime(2200, ctx.currentTime)
    osc2.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.16)

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(750, ctx.currentTime)

    gain2.gain.setValueAtTime(0.12, ctx.currentTime)
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16)

    osc2.connect(filter)
    filter.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start()
    osc2.stop(ctx.currentTime + 0.16)
  } catch (err) {
    console.warn('Audio Thump-Zap synthesis failed:', err)
  }
}

export default function VineBoard({
  puzzle,
  onVineConnect,
  connectedSocket,
  feedback,
  isValidating,
  socket1X = 90,       /* Socket 1 X coordinate */
  socket1Y = 400,      /* Socket 1 Y coordinate */
  socket2X = 210,      /* Socket 2 X coordinate */
  socket2Y = 400,      /* Socket 2 Y coordinate */
  socket3X = 150,      /* Socket 3 X coordinate */
  socket3Y = 400,      /* Socket 3 Y coordinate */
  label1OffsetX = 0,   /* Socket 1 Label Horizontal Offset */
  label1OffsetY = 26,  /* Socket 1 Label Vertical Offset */
  label2OffsetX = 0,   /* Socket 2 Label Horizontal Offset */
  label2OffsetY = 26,  /* Socket 2 Label Vertical Offset */
  label3OffsetX = 0,   /* Socket 3 Label Horizontal Offset */
  label3OffsetY = 26,  /* Socket 3 Label Vertical Offset */
  labelFontSize = '9.5px' /* Font size of the labels */
}) {
  const [draggedColor, setDraggedColor] = useState(null)
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 })
  const [selectedVine, setSelectedVine] = useState(null)
  const svgRef = useRef(null)

  // Dynamically compute 3 socket coordinates from props
  const SOCKET_POSITIONS = useMemo(() => ({
    0: { x: socket1X, y: socket1Y },
    1: { x: socket2X, y: socket2Y },
    2: { x: socket3X, y: socket3Y },
  }), [socket1X, socket1Y, socket2X, socket2Y, socket3X, socket3Y])

  // Reset when level changes
  useEffect(() => {
    setSelectedVine(null)
    setDraggedColor(null)
  }, [puzzle?.id])

  // Clean up sounds on unmount
  useEffect(() => {
    return () => {
      stopCelloHum()
    }
  }, [])

  // Only show 3 vines per level (required + 2 decoys) sorted alphabetically
  const availableVines = useMemo(() => {
    if (!puzzle) return []
    const decoyColors = VINE_COLORS.filter(c => c !== puzzle.required_vine_color).slice(0, 2)
    return [puzzle.required_vine_color, ...decoyColors].sort()
  }, [puzzle])

  // Show 3 target sockets (correct + 2 decoys) sorted alphabetically
  const availableSockets = useMemo(() => {
    if (!puzzle) return []
    const target = puzzle.target_nest_id
    const decoys = DECOY_ANIMALS[puzzle.id] || []
    
    const getSocket = (animal) => {
      if (!animal) return target
      const cap = animal.charAt(0).toUpperCase() + animal.slice(1)
      return Object.keys(SOCKET_LABELS).find(k => k.startsWith(cap)) || target
    }
    
    const decoy1 = getSocket(decoys[0])
    const decoy2 = getSocket(decoys[1])
    
    return [target, decoy1, decoy2].sort()
  }, [puzzle])

  const getRelativeCoords = useCallback((e) => {
    if (!svgRef.current) return { x: 0, y: 0 }
    const svg = svgRef.current
    const clientX = e.clientX || e.touches?.[0]?.clientX || e.changedTouches?.[0]?.clientX || 0
    const clientY = e.clientY || e.touches?.[0]?.clientY || e.changedTouches?.[0]?.clientY || 0
    
    let point = svg.createSVGPoint()
    point.x = clientX
    point.y = clientY
    
    const ctm = svg.getScreenCTM()
    if (ctm) {
      point = point.matrixTransform(ctm.inverse())
    }
    
    return {
      x: point.x,
      y: point.y,
    }
  }, [])

  const handleStartDrag = useCallback((color, e) => {
    if (feedback || isValidating) return
    e.preventDefault()

    // Disconnect if previously connected
    if (connectedSocket && selectedVine === color) {
      onVineConnect(null, null)
    }

    const coords = getRelativeCoords(e)
    setDraggedColor(color)
    setSelectedVine(color)
    setDragPos(coords)
    startCelloHum(90)
  }, [feedback, isValidating, connectedSocket, selectedVine, onVineConnect, getRelativeCoords])

  useEffect(() => {
    if (!draggedColor) return

    const onMove = (e) => {
      const coords = getRelativeCoords(e)
      setDragPos(coords)

      const idx = availableVines.indexOf(draggedColor)
      const anchor = VINE_ANCHORS[idx] || { x: 150, y: 30, restingH: 150 }
      const dx = coords.x - anchor.x
      const dy = coords.y - anchor.y
      const dist = Math.hypot(dx, dy)

      const tension = dist > anchor.restingH ? Math.min(1.0, (dist - anchor.restingH) / 250) : 0
      const freq = 90 + dist * 0.45

      updateCelloHum(freq, tension)
    }

    const onUp = (e) => {
      const coords = getRelativeCoords(e)
      stopCelloHum()

      let snappedSocketId = null
      const SNAP_RADIUS = 80 // Increased to allow stretching easily into all sockets
      availableSockets.forEach((socketId, sIdx) => {
        const socketPos = SOCKET_POSITIONS[sIdx]
        if (!socketPos) return
        const dist = Math.hypot(coords.x - socketPos.x, coords.y - socketPos.y)
        if (dist < SNAP_RADIUS) {
          snappedSocketId = socketId
        }
      })

      if (snappedSocketId) {
        playThumpZapSound()
        onVineConnect(draggedColor, snappedSocketId)
      } else {
        setSelectedVine(null)
      }
      setDraggedColor(null)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onUp)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [draggedColor, availableVines, availableSockets, onVineConnect, getRelativeCoords, SOCKET_POSITIONS])

  // Get active coordinates of a vine tip
  const getTipCoords = useCallback((color, idx) => {
    if (draggedColor === color) {
      return dragPos
    }
    if (connectedSocket && selectedVine === color) {
      const sIdx = availableSockets.indexOf(connectedSocket)
      return SOCKET_POSITIONS[sIdx] || { x: 150, y: 400 }
    }
    const anchor = VINE_ANCHORS[idx] || { x: 150, y: 30, restingH: 150 }
    return { x: anchor.x, y: anchor.y + anchor.restingH }
  }, [draggedColor, dragPos, connectedSocket, selectedVine, availableSockets, SOCKET_POSITIONS])

  return (
    <div
      style={{
        width: '310px',
        height: '520px',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      <svg
        ref={svgRef}
        style={{
          width: '100%',
          height: '100%',
          overflow: 'visible',
        }}
      >
        <defs>
          {Object.entries(VINE_COLOR_MAP).map(([color, cfg]) => (
            <filter key={color} id={`glow-${color}`} x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>

        {/* Tree Branch path lines */}
        <path
          d="M 60 12 Q 160 -4 280 18"
          fill="none"
          stroke="#3d2715"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M 110 8 Q 180 0 240 10"
          fill="none"
          stroke="#4e331c"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Labeled Habitat sockets (Tree Stumps) */}
        {availableSockets.map((socketId, sIdx) => {
          const pos = SOCKET_POSITIONS[sIdx]
          if (!pos) return null

          const label = SOCKET_LABELS[socketId] || socketId
          const isConnected = connectedSocket === socketId
          const isCorrect = feedback === 'success' && isConnected
          const isFail = feedback === 'fail' && isConnected

          let offsetX = 0
          let offsetY = 26
          if (sIdx === 0) {
            offsetX = label1OffsetX
            offsetY = label1OffsetY
          } else if (sIdx === 1) {
            offsetX = label2OffsetX
            offsetY = label2OffsetY
          } else if (sIdx === 2) {
            offsetX = label3OffsetX
            offsetY = label3OffsetY
          }

          let socketGlowColor = '#555'
          if (isConnected) {
            if (isCorrect) socketGlowColor = '#FF8C00'
            else if (isFail) socketGlowColor = '#FF2D55'
            else {
              socketGlowColor = VINE_COLOR_MAP[selectedVine]?.hex || '#FFE500'
            }
          }

          return (
            <g key={socketId}>
              {/* Outer wooden stump rings */}
              <ellipse
                cx={pos.x}
                cy={pos.y}
                rx={24}
                ry={12}
                fill="#3c2613"
                stroke="#1d120a"
                strokeWidth={2}
              />

              {/* Inner dark center hollow hole */}
              <ellipse
                cx={pos.x}
                cy={pos.y}
                rx={15}
                ry={7.5}
                fill={isConnected ? socketGlowColor : '#120904'}
                style={isConnected ? { filter: `drop-shadow(0 0 8px ${socketGlowColor})` } : {}}
              />

              {/* Interactive target bounds */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={24}
                fill="transparent"
              />

              {/* Labeled habitat text below stump */}
              <text
                x={pos.x + offsetX}
                y={pos.y + offsetY}
                textAnchor="middle"
                style={{
                  fontFamily: 'Courier Prime, monospace',
                  fontSize: labelFontSize,
                  fill: isConnected ? '#fff' : '#c3b3a3',
                  fontWeight: 'bold',
                  textShadow: '0 1px 3px rgba(0,0,0,0.95)',
                  pointerEvents: 'none',
                }}
              >
                {label}
              </text>
            </g>
          )
        })}

        {/* Dynamic Dangling Vine Cords */}
        {availableVines.map((color, idx) => {
          const cfg = VINE_COLOR_MAP[color]
          if (!cfg) return null

          const anchor = VINE_ANCHORS[idx] || { x: 150, y: 30, restingH: 150 }
          const tip = getTipCoords(color, idx)

          const dx = tip.x - anchor.x
          const dy = tip.y - anchor.y
          const dist = Math.hypot(dx, dy)
          const isStretched = dist > anchor.restingH
          const tension = isStretched ? Math.min(1.0, (dist - anchor.restingH) / 250) : 0

          // High tension vibration woggles
          const vibe = tension > 0.25 && (draggedColor === color || (connectedSocket && selectedVine === color))
            ? Math.sin(Date.now() * 0.15) * (tension - 0.25) * 8
            : 0

          // Add organic slack/catenary curve when the vine is hanging near its resting height
          const slack = Math.max(0, 1.0 - (dist / (anchor.restingH * 1.3))) * 40; /* Sag up to 40px */
          const cp1x = anchor.x + (idx % 2 === 0 ? slack : -slack); /* Alternate sag direction */
          const cp1y = anchor.y + Math.max(40, dy * 0.45) + vibe;
          const cp2x = tip.x - (idx % 2 === 0 ? slack : -slack);
          const cp2y = tip.y - Math.max(40, dy * 0.45) - vibe;

          const pathD = `M ${anchor.x} ${anchor.y} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${tip.x} ${tip.y}`
          // Cord thins out dynamically under stretch tension
          const strokeWidth = Math.max(2.2, 5.5 - tension * 3.3)
          const isDraggingThis = draggedColor === color

          return (
            <g key={color}>
              {/* Branch Node */}
              <circle
                cx={anchor.x}
                cy={anchor.y}
                r={5.5}
                fill="#4a2c1b"
                stroke="#1d120a"
                strokeWidth={1.5}
              />

              {/* Glowing SVG Vine path */}
              <path
                d={pathD}
                fill="none"
                stroke={cfg.hex}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                style={{
                  filter: `url(#glow-${color})`,
                  opacity: (connectedSocket && selectedVine !== color) ? 0.35 : 1,
                  transition: isDraggingThis ? 'none' : 'opacity 0.2s',
                }}
              />

              {/* Tip Drag Handle */}
              <g
                transform={`translate(${tip.x}, ${tip.y})`}
                onMouseDown={(e) => handleStartDrag(color, e)}
                onTouchStart={(e) => handleStartDrag(color, e)}
                style={{
                  cursor: (feedback || isValidating) ? 'default' : 'grab',
                  opacity: (connectedSocket && selectedVine !== color) ? 0.35 : 1,
                }}
              >
                {/* Outer Grip Bezel */}
                <circle
                  cx={0}
                  cy={0}
                  r={11}
                  fill="#ac8227"
                  stroke="#faf3b3"
                  strokeWidth={1.5}
                  style={{ filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.5))` }}
                />

                {/* Core Color node */}
                <circle
                  cx={0}
                  cy={0}
                  r={5}
                  fill={cfg.hex}
                />
              </g>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
