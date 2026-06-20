'use client'

import { motion } from 'framer-motion'

export default function LimerickBox({ puzzle }) {
  return (
    <motion.div
      key={puzzle.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        width: '100%',
        padding: '1px 5px',
        background: 'transparent',
        userSelect: 'none',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {puzzle.lines.map((line, i) => (
          <p
            key={i}
            style={{
              fontFamily: '"Georgia", "Cinzel", serif',
              fontSize: '20px',   /* Increased base font size since CSS scale was removed */
              lineHeight: 1.45,
              color: '#0e0d0cff', // Dark, aged sepia-black matching the ink print style
              margin: 0,
              fontWeight: '700',
              fontStyle: 'bold',
              letterSpacing: '0.2px',
              textShadow: '0.3px 0.3px 0.3px rgba(0, 0, 0, 0.15)',
              paddingBottom: '10px', /* Ensure proper spacing between lines when wrapping occurs */
            }}
          >
            {line}
          </p>
        ))}
      </div>
    </motion.div>
  )
}
