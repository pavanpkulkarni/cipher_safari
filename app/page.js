'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import RotorWheel from '@/components/RotorWheel'
import VineBoard from '@/components/VineBoard'
import LevelTracker from '@/components/LevelTracker'
import AnimalStage from '@/components/AnimalStage'
import LimerickBox from '@/components/LimerickBox'
import { PUZZLES, VINE_COLORS, SEASON_NAMES, DECOY_ANIMALS } from '@/lib/gameData'

const SEASON_BACKGROUNDS = {
  0: '/seasons/spring.jpeg',
  1: '/seasons/summer.jpg',
  2: '/seasons/autumn.jpeg',
  3: '/seasons/winter.jpeg',
}

export default function GamePage() {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0)
  const [completedLevels, setCompletedLevels] = useState([])
  const [seasonIndex, setSeasonIndex] = useState(0)
  const [shadowHour, setShadowHour] = useState(12)
  const [selectedVineColor, setSelectedVineColor] = useState(null)
  const [connectedSocket, setConnectedSocket] = useState(null)
  const [feedback, setFeedback] = useState(null) // null | 'success' | 'fail'
  const [alanState, setAlanState] = useState('idle') // idle | excited | thinking
  const [isValidating, setIsValidating] = useState(false)
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [particles, setParticles] = useState([])

  const currentPuzzle = PUZZLES[currentLevelIndex]

  // Decoys for this level: pick 2 animals different from current animal
  const decoyAnimals = DECOY_ANIMALS[currentPuzzle?.id] || []

  const spawnDialParticles = useCallback((color, isSeason) => {
    const baseX = isSeason ? 45 : 55
    const baseY = 12
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i + Math.random(),
      color: color,
      x: baseX + (Math.random() - 0.5) * 6,
      y: baseY + (Math.random() - 0.5) * 6,
      dx: (Math.random() - 0.5) * 80,
      dy: (Math.random() - 0.5) * 80,
    }))
    setParticles(prev => [...prev, ...newParticles].slice(-40))
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)))
    }, 800)
  }, [])

  const handleSeasonChange = useCallback((idx) => {
    setSeasonIndex(idx)
    setFeedback(null)
    setConnectedSocket(null)
    setSelectedVineColor(null)
    spawnDialParticles('#FFE500', true)
  }, [spawnDialParticles])

  const handleHourChange = useCallback((hour) => {
    setShadowHour(hour)
    setFeedback(null)
    setConnectedSocket(null)
    setSelectedVineColor(null)
    spawnDialParticles('#FF8C00', false)
  }, [spawnDialParticles])

  const handleVineConnect = useCallback(async (vineColor, socketId) => {
    if (isValidating) return
    if (!vineColor || !socketId) {
      setSelectedVineColor(null)
      setConnectedSocket(null)
      setFeedback(null)
      return
    }
    setSelectedVineColor(vineColor)
    setConnectedSocket(socketId)
    setIsValidating(true)
    setAlanState('thinking')

    try {
      let isCorrect = false
      try {
        const response = await fetch('/api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            level: currentPuzzle.id,
            season_index: seasonIndex,
            shadow_hour: shadowHour,
            vine_color: vineColor,
            socket_id: socketId,
          }),
        })
        if (response.ok) {
          const result = await response.json()
          isCorrect = result.status === 'unlocked'
        } else {
          throw new Error('API server returned error status')
        }
      } catch (apiErr) {
        console.warn('API verification failed, using local fallback validation:', apiErr)
        // Fallback: Client-side validation (manifest embedded in gameData)
        const puzzle = currentPuzzle
        const isSeasonCorrect = seasonIndex === puzzle.target_season_index
        const isHourCorrect = shadowHour === puzzle.target_shadow_hour
        const isCircuitCorrect = vineColor === puzzle.required_vine_color && socketId === puzzle.target_nest_id
        isCorrect = isSeasonCorrect && isHourCorrect && isCircuitCorrect
      }

      await new Promise(r => setTimeout(r, 600)) // Dramatic pause

      if (isCorrect) {
        // SUCCESS!
        setFeedback('success')
        setAlanState('excited')
        spawnParticles()
        setTimeout(() => {
          setShowSuccessOverlay(true)
        }, 800)
        setTimeout(() => {
          const newCompleted = [...completedLevels, currentPuzzle.id]
          setCompletedLevels(newCompleted)
          if (currentLevelIndex < PUZZLES.length - 1) {
            setShowSuccessOverlay(false)
            setCurrentLevelIndex(prev => prev + 1)
            resetInteractionState()
          } else {
            setGameComplete(true)
          }
        }, 3200)
      } else {
        // FAIL
        setFeedback('fail')
        setAlanState('idle')
        setTimeout(() => {
          setFeedback(null)
          setConnectedSocket(null)
          setSelectedVineColor(null)
        }, 2800)
      }
    } catch (err) {
      console.error('Validation error:', err)
      setFeedback('fail')
    } finally {
      setIsValidating(false)
    }
  }, [currentPuzzle, seasonIndex, shadowHour, completedLevels, currentLevelIndex, isValidating])

  const spawnParticles = () => {
    const colors = ['#FF2D55', '#00C3FF', '#FFE500', '#FF8C00', '#FF00CC', '#00FFF5']
    const newParticles = Array.from({ length: 24 }, (_, i) => ({
      id: Date.now() + i,
      color: colors[i % colors.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      dx: (Math.random() - 0.5) * 200,
      dy: (Math.random() - 0.5) * 200,
    }))
    setParticles(newParticles)
    setTimeout(() => setParticles([]), 1000)
  }

  const resetInteractionState = () => {
    setSeasonIndex(0)
    setShadowHour(12)
    setSelectedVineColor(null)
    setConnectedSocket(null)
    setFeedback(null)
    setAlanState('idle')
    setShowSuccessOverlay(false)
  }

  const handleRestart = () => {
    setCurrentLevelIndex(0)
    setCompletedLevels([])
    setGameComplete(false)
    resetInteractionState()
  }

  if (!currentPuzzle) return null

  return (
    <div className="game-container" style={{ fontFamily: 'Outfit, sans-serif' }}>
      {/* CRT Effects */}
      <div className="crt-overlay" aria-hidden="true" />
      <div className="crt-vignette" aria-hidden="true" />

      {/* Season Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={seasonIndex}
          className="season-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            backgroundImage: `url(${SEASON_BACKGROUNDS[seasonIndex]})`,
            filter: 'brightness(1.2)'
          }}
        />
      </AnimatePresence>

      {/* Dark overlay for readability */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.35)', zIndex: 1 }}
      />

      {/* Main content layer */}
      <div className="relative flex flex-col h-full" style={{ zIndex: 2 }}>

        {/* ===== TOP LEVEL TRACKER ===== */}
        <LevelTracker
          puzzles={PUZZLES}
          currentIndex={currentLevelIndex}
          completed={completedLevels}
          onRestart={handleRestart}
          onSelectLevel={(idx) => {
            setCurrentLevelIndex(idx)
            resetInteractionState()
          }}
        />

        {/* ===== MAIN GAME AREA ===== */}
        <div className="flex flex-1 overflow-hidden" style={{ gap: '0' }}>

          {/* ===== LEFT PANEL: Limerick Text Floating Over Background Scroll ===== */}
          <div
            className="flex flex-col items-start justify-end" /* CHANGED: items-center -> items-start to move it LEFT */
            style={{
              width: '450px',
              flexShrink: 0,
              paddingBottom: '100px', /* INCREASE this value to move it UP, DECREASE to move it DOWN */
              paddingLeft: '100px',    /* DECREASE this value to move it LEFT, INCREASE to move it RIGHT */
            }}
          >
            {/* Limerick */}
            <LimerickBox puzzle={currentPuzzle} seasonIndex={seasonIndex} />
          </div>

          {/* ===== CENTER: Animal Stage + Dials Console ===== */}
          <div className="flex-1 relative flex flex-col items-center justify-between pb-6 pt-4">

            {/* Floating Dials Console */}
            <div
              className="flex z-10"
              style={{
                position: 'absolute',
                top: '200px',                 /* VERTICAL ALIGNMENT: Increase to move DOWN, decrease to move UP */
                left: '50%',                 /* HORIZONTAL ALIGNMENT: Use '50%' with transform to center, or set a direct pixel value (e.g. '120px') */
                transform: 'translateX(-50%)', /* Keeps the console centered horizontally when left is 50% */
                gap: '48px',                 /* SPACING: Spacing/gap between the two rotors */
              }}
            >
              {/* Season Rotor */}
              <div
                className="flex flex-col items-center"
                style={{
                  /* If you need to position this rotor individually, uncomment these: */
                  /* position: 'absolute', */
                  /* top: '0px', */
                  /* left: '-100px', */
                }}
              >
                {/* Season Rotor Label */}
                <div
                  style={{
                    fontFamily: 'Courier Prime, monospace',
                    fontSize: '20px',                  /* FONT SIZE: Increase or decrease (e.g. '14px') */
                    fontWeight: 'bold',
                    color: '#2e2e28ff',                  /* COLOR */
                    textShadow: '0 0 6px #FFE500',     /* GLOW EFFECT */
                    marginBottom: '8px',               /* SPACING between label and dial */
                    position: 'relative',
                    top: '0px',                        /* VERTICAL OFFSET: Increase to move DOWN, decrease to move UP */
                    left: '0px',                       /* HORIZONTAL OFFSET: Increase to move RIGHT, decrease to move LEFT */
                  }}
                >
                  SEASON ROTOR
                </div>
                <RotorWheel
                  type="season"
                  value={seasonIndex}
                  onChange={handleSeasonChange}
                  dialImage="/seasons/season_dial.png"
                  disabled={isValidating || !!feedback}
                  size={200} /* ROTOR SIZE: Change this number (e.g. 180, 200) to make it larger */
                />
              </div>

              {/* Shadow Rotor */}
              <div
                className="flex flex-col items-center"
                style={{
                  /* If you need to position this rotor individually, uncomment these: */
                  /* position: 'absolute', */
                  /* top: '0px', */
                  /* left: '100px', */
                }}
              >
                {/* Shadow Rotor Label */}
                <div
                  style={{
                    fontFamily: 'Courier Prime, monospace',
                    fontSize: '20px',                  /* FONT SIZE: Increase or decrease (e.g. '14px') */
                    fontWeight: 'bold',
                    color: '#2e2e28ff',                  /* COLOR */
                    textShadow: '0 0 6px #FF8C00',     /* GLOW EFFECT */
                    marginBottom: '8px',               /* SPACING between label and dial */
                    position: 'relative',
                    top: '0px',                        /* VERTICAL OFFSET: Increase to move DOWN, decrease to move UP */
                    left: '0px',                       /* HORIZONTAL OFFSET: Increase to move RIGHT, decrease to move LEFT */
                  }}
                >
                  SHADOW ROTOR
                </div>
                <RotorWheel
                  type="shadow"
                  value={shadowHour}
                  onChange={handleHourChange}
                  dialImage="/seasons/shadow_dial.png"
                  disabled={isValidating || !!feedback}
                  size={200} /* ROTOR SIZE: Change this number (e.g. 180, 200) to make it larger */
                />
              </div>
            </div>

            {/* Animal Stage (Bottom aligned) */}
            <div
              className="w-full flex items-end justify-center"
              style={{
                position: 'absolute',
                bottom: '180px',          /* VERTICAL POSITION: Increase to move UP, decrease to move DOWN */
                left: '0',
                right: '0',
                transform: 'translateX(-150px)', /* HORIZONTAL SHIFT: Change '0px' to a positive value to move RIGHT (e.g., '40px') or negative to move LEFT (e.g., '-40px') */
                zIndex: 5,
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentLevelIndex}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="w-full flex justify-center"
                >
                  <AnimalStage
                    puzzle={currentPuzzle}
                    decoys={decoyAnimals}
                    feedback={feedback}
                    connectedSocket={connectedSocket}
                    onSocketHover={() => { }}
                    targetSize={200}   /* TARGET ANIMAL SIZE: Change this to increase/decrease the active animal size */
                    decoySize={200}     /* DECOY ANIMAL SIZE: Change this to increase/decrease decoy sizes */
                    gap={200}          /* SPACING: Spacing between animals */
                    showAnimalName={false} /* Hide the animal name tag below the character */
                    shadowHour={shadowHour} /* Sync the dynamic animal shadow to the Shadow Rotor hour setting */
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ===== RIGHT PANEL: Vine Board Only ===== */}
          <div
            className="flex flex-col items-center justify-center px-9"
            style={{ width: '310px', flexShrink: 0 }}
          >
            {/* Vine Board */}
            <div>
              <p
                className="text-center text-xs font-bold tracking-widest"
                style={{
                  color: '#00FFF5',
                  fontFamily: 'Courier Prime, monospace',
                  textShadow: '0 0 8px #00FFF5',
                  position: 'relative',
                  top: '-110px',           /* VERTICAL: Increase to move text DOWN, decrease to move UP */
                  left: '-50px',          /* HORIZONTAL: Increase to move text RIGHT, decrease to move LEFT */
                  marginBottom: '8px'   /* SPACING: Spacing beneath the text label */
                }}
              >
                🌿 VINES
              </p>
              <VineBoard
                puzzle={currentPuzzle}
                onVineConnect={handleVineConnect}
                connectedSocket={connectedSocket}
                feedback={feedback}

                /* SOCKET COORDINATE CONTROLS */
                socket1X={-200}       /* SOCKET 1 (LEFT STUMP) HORIZONTAL: Increase to move RIGHT, decrease to move LEFT */
                socket1Y={540}      /* SOCKET 1 (LEFT STUMP) VERTICAL: Increase to move DOWN, decrease to move UP */

                socket2X={-20}      /* SOCKET 2 (RIGHT STUMP) HORIZONTAL: Increase to move RIGHT, decrease to move LEFT */
                socket2Y={550}      /* SOCKET 2 (RIGHT STUMP) VERTICAL: Increase to move DOWN, decrease to move UP */

                socket3X={150}      /* SOCKET 3 (MIDDLE STUMP) HORIZONTAL: Increase to move RIGHT, decrease to move LEFT */
                socket3Y={520}      /* SOCKET 3 (MIDDLE STUMP) VERTICAL: Increase to move DOWN, decrease to move UP */

                /* SOCKET LABEL OFFSET CONTROLS */
                label1OffsetX={0}   /* LABEL 1 HORIZONTAL OFFSET: Shift label 1 text relative to socket 1 */
                label1OffsetY={50}  /* LABEL 1 VERTICAL OFFSET: Shift label 1 text relative to socket 1 */

                label2OffsetX={0}   /* LABEL 2 HORIZONTAL OFFSET: Shift label 2 text relative to socket 2 */
                label2OffsetY={60}  /* LABEL 2 VERTICAL OFFSET: Shift label 2 text relative to socket 2 */

                label3OffsetX={0}   /* LABEL 3 HORIZONTAL OFFSET: Shift label 3 text relative to socket 3 */
                label3OffsetY={60}  /* LABEL 3 VERTICAL OFFSET: Shift label 3 text relative to socket 3 */
                labelFontSize="20px" /* SOCKET LABELS FONT SIZE: Increase or decrease size (e.g., "12px", "14px") */
              />
            </div>
          </div>
        </div>

        {/* ===== FEEDBACK MESSAGES ===== */}
        <AnimatePresence>
          {feedback === 'fail' && (
            <motion.div
              className="feedback-overlay text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div
                className="px-8 py-5 rounded-2xl error-shake"
                style={{
                  background: 'rgba(10,0,0,0.92)',
                  border: '3px solid #FF2D55',
                  boxShadow: '0 0 30px rgba(255,45,85,0.6)',
                }}
              >
                <div className="text-5xl mb-2">🔴</div>
                <p
                  className="text-2xl font-black"
                  style={{ fontFamily: 'Cinzel, serif', color: '#FF2D55', textShadow: '0 0 15px #FF2D55' }}
                >
                  DON&apos;T GIVE UP!
                </p>
                <p
                  className="text-lg mt-1"
                  style={{ fontFamily: 'Cinzel, serif', color: '#FF8080' }}
                >
                  KEEP TRYING! 💪
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== SUCCESS OVERLAY ===== */}
        <AnimatePresence>
          {showSuccessOverlay && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              style={{ zIndex: 200, background: 'rgba(0,0,0,0.5)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="success-banner text-center px-12 py-8 rounded-3xl"
                initial={{ scale: 0.5, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="text-6xl mb-4">🎉</div>
                <p
                  className="text-3xl font-black"
                  style={{ fontFamily: 'Cinzel, serif', color: '#FF8C00', textShadow: '0 0 20px #FF8C00' }}
                >
                  CIPHER UNLOCKED!
                </p>
                <p className="text-xl mt-2" style={{ color: '#FFD580' }}>
                  {currentPuzzle.animal} says Hoorayyy !!! 🐾
                </p>
                <p className="text-sm mt-3" style={{ color: '#aaa' }}>
                  Advancing to next level...
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== GAME COMPLETE ===== */}
        <AnimatePresence>
          {gameComplete && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              style={{ zIndex: 300, background: 'rgba(0,0,0,0.85)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="text-center px-16 py-12 rounded-3xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(15,8,2,0.98), rgba(35,18,5,0.98))',
                  border: '3px solid #FFE500',
                  boxShadow: '0 0 50px rgba(255,229,0,0.5)',
                }}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <div className="text-8xl mb-6">🏆</div>
                <p
                  className="text-4xl font-black"
                  style={{ fontFamily: 'Cinzel, serif', color: '#FFE500', textShadow: '0 0 30px #FFE500' }}
                >
                  SAFARI COMPLETE!
                </p>
                <p className="text-xl mt-4" style={{ color: '#FFD580' }}>
                  All 26 Animal Habitats Stabilized!
                </p>
                <p className="mt-2" style={{ color: '#aaa' }}>
                  Professor Alan Turing is proud of you! 🎓
                </p>
                <button
                  onClick={handleRestart}
                  className="mt-8 px-10 py-4 rounded-2xl text-xl font-bold transition-transform hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #FF8C00, #FFE500)',
                    color: '#000',
                    fontFamily: 'Cinzel, serif',
                    boxShadow: '0 0 20px rgba(255,140,0,0.5)',
                  }}
                >
                  🔄 PLAY AGAIN
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== PARTICLE SPARKS ===== */}
        {particles.map(p => (
          <div
            key={p.id}
            className="spark"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: '8px',
              height: '8px',
              background: p.color,
              boxShadow: `0 0 8px ${p.color}`,
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
