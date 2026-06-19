'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const ALAN_STATES = {
  idle: {
    expression: '🧐',
    speech: '"Read the clues carefully, young cryptanalyst..."',
    color: '#FFE500',
  },
  thinking: {
    expression: '🤔',
    speech: '"Calculating... cross-referencing the celestial logs..."',
    color: '#00C3FF',
  },
  excited: {
    expression: '🎉',
    speech: '"Brilliant! The cipher is broken! The habitat is stable!"',
    color: '#FF8C00',
  },
}

export default function AlanPorthole({ state }) {
  const cfg = ALAN_STATES[state] || ALAN_STATES.idle

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
      {/* Title plate */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(80,45,10,0.9), rgba(50,28,6,0.9))',
          border: '2px solid rgba(139,90,43,0.8)',
          borderRadius: '8px',
          padding: '4px 12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
        }}
      >
        <p style={{ fontFamily: 'Cinzel, serif', fontSize: '11px', fontWeight: '700', color: '#FFD580', margin: 0, letterSpacing: '1px' }}>
          PROFESSOR
        </p>
        <p style={{ fontFamily: 'Cinzel, serif', fontSize: '13px', fontWeight: '900', color: '#FFE500', margin: 0, textShadow: '0 0 8px #FFE500' }}>
          ALAN TURING
        </p>
      </div>

      {/* Porthole frame */}
      <div
        className="porthole-frame"
        style={{
          width: '120px',
          height: '120px',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        <motion.div
          key={state}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{ width: '100%', height: '100%', position: 'relative' }}
        >
          <Image
            src="/avatar/alan.png"
            alt="Professor Alan Turing"
            fill
            style={{ objectFit: 'cover', objectPosition: 'top center' }}
            priority
          />
        </motion.div>

        {/* State expression badge */}
        <motion.div
          key={`expr-${state}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
          style={{
            position: 'absolute',
            bottom: '-6px',
            right: '-6px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#0a0a0a',
            border: `2px solid ${cfg.color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            boxShadow: `0 0 8px ${cfg.color}`,
            zIndex: 10,
          }}
        >
          {cfg.expression}
        </motion.div>
      </div>

      {/* Speech bubble */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'rgba(5,5,15,0.85)',
            border: `1px solid ${cfg.color}40`,
            borderRadius: '10px',
            padding: '8px 10px',
            position: 'relative',
            maxWidth: '220px',
            backdropFilter: 'blur(4px)',
          }}
        >
          <p style={{
            fontFamily: 'Courier Prime, monospace',
            fontSize: '10px',
            color: cfg.color,
            margin: 0,
            lineHeight: 1.5,
            fontStyle: 'italic',
          }}>
            {cfg.speech}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
