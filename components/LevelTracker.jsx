'use client'

import { motion } from 'framer-motion'

export default function LevelTracker({ puzzles, currentIndex, completed, onRestart, onSelectLevel, onToggleHelp }) {
  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #ed9d68ff 50%, #ed9d68ff 50%)',
        borderBottom: '0.5px solid #9b4f18ff',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexShrink: 0,
        overflowX: 'auto',
        boxShadow: '0 4px 20px rgba(134, 121, 121, 0.71)',
        scrollbarWidth: 'none', /* Hide default scrollbar */
      }}
    >
      {/* Title */}
      <span
        style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '14px',
          fontWeight: '900',
          color: '#1f1e1dff',
          textShadow: '0 0 8px #2d2d27ff, 0 0 15px rgba(224, 224, 206, 0.6)',
          letterSpacing: '3px',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          marginRight: '8px',
        }}
      >
        CIPHER SAFARI
      </span>

      <span style={{ color: '#282524ff', flexShrink: 0, fontSize: '14px' }}>|</span>

      {/* Level badges */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'nowrap',
          padding: '4px 0'
        }}
      >
        {puzzles.map((puzzle, idx) => {
          const isCompleted = completed.includes(puzzle.id)
          const isCurrent = idx === currentIndex

          return (
            <motion.div
              key={puzzle.id}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectLevel && onSelectLevel(idx)}
              style={{
                position: 'relative',
                width: '32px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                cursor: 'pointer',
                userSelect: 'none',

                /* Weathered paper/metal background depending on state */
                background: isCurrent
                  ? 'radial-gradient(circle, #fdf6cc 0%, #d4af37 100%)' /* Highlighted gold parchment for active */
                  : isCompleted
                    ? '#2c221a' /* Completed: dark warm wood/metal */
                    : '#18120e', /* Locked: dark iron */

                /* Weathered metal bracket borders */
                borderTop: '1px solid rgba(92, 73, 56, 0.4)',
                borderBottom: '1px solid rgba(92, 73, 56, 0.4)',
                borderLeft: isCurrent
                  ? '3px solid #f3d476'
                  : '3px solid #4a3b2c', /* Weathered metal bracket left */
                borderRight: isCurrent
                  ? '3px solid #f3d476'
                  : '3px solid #4a3b2c', /* Weathered metal bracket right */

                borderRadius: '3px',
                boxShadow: isCurrent
                  ? '0 0 15px rgba(212, 175, 55, 0.7), inset 0 1px 2px rgba(255,255,255,0.4)'
                  : '0 2px 4px rgba(0,0,0,0.6), inset 0 1px 3px rgba(0,0,0,0.8)',

                transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
              }}
              title={`Jump to Level ${puzzle.id}: ${puzzle.animal}`}
            >
              {/* Antique-black engraved letter */}
              <span
                style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: '15px',
                  fontWeight: '900',
                  color: isCurrent
                    ? '#16110d' /* Engraved black letter on gold parchment */
                    : isCompleted
                      ? '#6e543d' /* Completed level text color */
                      : '#cbbfb4ff', /* Faded antique-black letter */
                  textShadow: isCurrent
                    ? '0 1px 1px rgba(255,255,255,0.4)'
                    : 'inset 0 1px 2px rgba(0,0,0,0.9)',
                }}
              >
                {puzzle.id}
              </span>

              {/* Glowing visual confirmation indicator for completed levels */}
              {isCompleted && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0, 255, 128, 0.08)',
                    borderRadius: '2px',
                    boxShadow: '0 0 8px rgba(0, 255, 128, 0.5) inset, 0 0 4px rgba(0, 255, 128, 0.3)',
                    border: '1px solid rgba(0, 255, 128, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    color: '#00ff80',
                    fontWeight: '900',
                    textShadow: '0 0 4px #00ff80',
                    pointerEvents: 'none',
                  }}
                >
                  ✓
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Progress count */}
      <span style={{ color: '#3d2e24', flexShrink: 0, marginLeft: 'auto', fontSize: '14px' }}>|</span>
      <span
        style={{
          fontFamily: 'Courier Prime, monospace',
          fontSize: '20px',
          color: '#090909ff',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          fontWeight: 'bold',
          letterSpacing: '1px',
        }}
      >
        COMPLETED: {completed.length}/26
      </span>

      {/* Help button */}
      <motion.button
        onClick={onToggleHelp}
        whileHover={{ scale: 1.05, background: 'rgba(92, 73, 56, 0.15)' }}
        whileTap={{ scale: 0.95 }}
        style={{
          flexShrink: 0,
          marginLeft: '8px',
          padding: '6px 12px',
          borderRadius: '4px',
          background: 'rgba(255, 255, 255, 0.25)',
          border: '1px solid rgba(27, 23, 20, 0.4)',
          color: '#1b1714',
          fontFamily: 'Courier Prime, monospace',
          fontSize: '20px',
          fontWeight: '900',
          cursor: 'pointer',
          letterSpacing: '1px',
          boxShadow: '0 0 8px rgba(0,0,0,0.1)',
          transition: 'all 0.2s',
          whiteSpace: 'nowrap',
        }}
        title="Show instructions on how to play"
      >
        📖 GUIDE
      </motion.button>

      {/* Restart button */}
      <motion.button
        onClick={onRestart}
        whileHover={{ scale: 1.05, background: 'rgba(255,45,85,0.25)' }}
        whileTap={{ scale: 0.95 }}
        style={{
          flexShrink: 0,
          marginLeft: '8px',
          padding: '6px 12px',
          borderRadius: '4px',
          background: 'rgba(216, 202, 205, 0.78)',
          border: '1px solid rgba(211, 195, 198, 0.4)',
          color: '#f10a30ff',
          fontFamily: 'Courier Prime, monospace',
          fontSize: '20px',
          fontWeight: '900',
          cursor: 'pointer',
          letterSpacing: '1px',
          boxShadow: '0 0 8px rgba(247, 242, 243, 0.2)',
          transition: 'all 0.2s',
          whiteSpace: 'nowrap',
        }}
        title="Restart game from Level A"
      >
        🔄 RESET SAFARI
      </motion.button>
    </div>
  )
}
