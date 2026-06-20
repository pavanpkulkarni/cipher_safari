'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useState, useEffect, useMemo } from 'react'

export default function AnimalStage({
  puzzle,
  decoys,
  feedback,
  connectedSocket,
  targetSize = 130, /* Size of the main target animal */
  decoySize = 90,   /* Size of the decoy animals */
  gap = 120,        /* Horizontal spacing between the animals */
  showAnimalName = true, /* Toggle to show/hide the name label under the animal */
  shadowHour = 12   /* The current hour from the shadow rotor */
}) {
  const targetAnimal = puzzle.animal.toLowerCase()
  const [decoy1, decoy2] = decoys || []

  // Shadow transform math relative to noon (12:00 HRS)
  const delta = shadowHour - 12
  const skewX = delta * 3.5  /* Skews the shadow left/right */
  const translateX = delta * 5 /* Shifts the base of the shadow horizontally */
  const scaleY = 0.25 + Math.abs(delta) * 0.035 /* Long shadow in early morning/late evening, short at noon */

  // Position animals in a randomly shuffled group based on puzzle ID
  const animals = useMemo(() => {
    const raw = [
      { name: targetAnimal, isTarget: true, scale: 1.0 },
      { name: decoy1, isTarget: false, scale: 1.0 },
      { name: decoy2, isTarget: false, scale: 1.0 },
    ].filter(a => a.name)

    const hashString = (str) => {
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
      }
      return hash
    }

    const shuffled = [...raw].sort((a, b) => {
      const valA = Math.abs(hashString(a.name + (puzzle?.id || 0)))
      const valB = Math.abs(hashString(b.name + (puzzle?.id || 0)))
      return (valA % 100) - (valB % 100)
    })

    return shuffled.map((a, i) => {
      let xOffset = '0px'
      if (shuffled.length === 3) {
        xOffset = i === 0 ? `-${gap}px` : i === 1 ? '0px' : `${gap}px`
      } else if (shuffled.length === 2) {
        xOffset = i === 0 ? `-${gap/2}px` : `${gap/2}px`
      }
      return { ...a, xOffset }
    })
  }, [puzzle?.id, targetAnimal, decoy1, decoy2, gap])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        position: 'relative',
        height: '200px',
        width: '100%',
        maxWidth: '500px',
      }}
    >
      {animals.map((animal, i) => {
        const isTarget = animal.isTarget
        const shouldBounce = feedback === 'success' && isTarget
        const shouldFade = feedback === 'success' && !isTarget
        const shouldShake = feedback === 'fail' && isTarget

        return (
          <motion.div
            key={`${puzzle.id}-${animal.name}-${i}`}
            initial={{ opacity: 0, y: 30, scale: animal.scale * 0.8 }}
            animate={{
              opacity: shouldFade ? 0 : 1,
              y: shouldBounce ? [0, -20, 0] : 0,
              scale: shouldFade
                ? 0.5
                : shouldBounce
                  ? [animal.scale, animal.scale * 1.15, animal.scale]
                  : animal.scale,
              x: shouldFade ? (i < 1 ? -50 : 50) : 0,
              rotate: shouldShake ? [-3, 3, -3, 3, 0] : 0,
            }}
            transition={{
              y: shouldBounce ? { duration: 0.5, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' } : { duration: 0.5 },
              scale: shouldBounce ? { duration: 0.5, repeat: Infinity, repeatType: 'loop' } : { duration: 0.4 },
              opacity: { duration: 0.5 },
              rotate: shouldShake ? { duration: 0.4 } : {},
            }}
            style={{
              position: 'absolute',
              bottom: '0',
              left: `calc(50% + ${animal.xOffset})`,
              transform: `translateX(-50%)`,
              zIndex: isTarget ? 10 : 5,
              filter: shouldFade
                ? 'grayscale(100%) brightness(0.3)'
                : isTarget
                  ? 'drop-shadow(0 8px 20px rgba(0,0,0,0.6))'
                  : 'drop-shadow(0 4px 10px rgba(0,0,0,0.4)) brightness(0.8)',
            }}
          >
            {/* Real Dynamic 3D Silhouette Shadow */}
            <div
              style={{
                position: 'absolute',
                bottom: '0',
                left: '50%',
                width: isTarget ? `${targetSize}px` : `${decoySize}px`,
                height: isTarget ? `${targetSize}px` : `${decoySize}px`,
                transformOrigin: 'bottom center',
                transform: `translateX(-50%) translateX(${translateX}px) scaleY(${scaleY}) skewX(${skewX}deg)`,
                filter: 'brightness(0) blur(4px)',
                opacity: 0.35,
                pointerEvents: 'none',
                zIndex: 1,
                transition: 'transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
              }}
            >
              <Image
                src={`/animals/individual/${animal.name}.png`}
                alt=""
                fill
                style={{ objectFit: 'contain', objectPosition: 'bottom center' }}
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>

            {/* Main Animal Character Model */}
            <div
              style={{
                position: 'relative',
                width: isTarget ? `${targetSize}px` : `${decoySize}px`,
                height: isTarget ? `${targetSize}px` : `${decoySize}px`,
                zIndex: 2 /* Layered above the shadow */
              }}
            >
              <Image
                src={`/animals/individual/${animal.name}.png`}
                alt={animal.name}
                fill
                style={{ objectFit: 'contain', objectPosition: 'bottom center' }}
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>

            {/* Target animal glow ring on success */}
            {isTarget && feedback === 'success' && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                style={{
                  position: 'absolute',
                  inset: '-10px',
                  borderRadius: '50%',
                  border: '3px solid #FF8C00',
                  boxShadow: '0 0 20px rgba(255,140,0,0.8)',
                  pointerEvents: 'none',
                }}
              />
            )}

            {/* Name tag */}
            {isTarget && showAnimalName && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  position: 'absolute',
                  bottom: '-28px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontFamily: 'Cinzel, serif',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#FFE500',
                  textShadow: '0 0 8px #FFE500',
                  whiteSpace: 'nowrap',
                  background: 'rgba(0,0,0,0.7)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(255,229,0,0.3)',
                }}
              >
                {puzzle.animal}
              </motion.div>
            )}
          </motion.div>
        )
      })}

      <div
        style={{
          position: 'absolute',
          bottom: '-5px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'Courier Prime, monospace',
          fontSize: '9px',
          color: 'rgba(255,140,0,0.6)',
          letterSpacing: '2px',
          whiteSpace: 'nowrap',
          marginTop: '4px',
        }}
      >
      </div>
    </div>
  )
}
