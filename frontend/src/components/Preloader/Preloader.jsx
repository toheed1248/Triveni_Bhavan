import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBusinessSettings } from '../../contexts/BusinessSettingsContext'

const DURATION = 5000
const FADE_DURATION = 0.7

export default function Preloader() {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const { settings } = useBusinessSettings()

  const businessName = settings?.businessName || 'Triveni Bhavan'
  const tagline = settings?.tagline || 'Where Traditions Meet Celebration'

  useEffect(() => {
    const startTime = Date.now()

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const pct = Math.min((elapsed / DURATION) * 100, 100)
      setProgress(pct)

      if (pct >= 100) {
        clearInterval(interval)
        setTimeout(() => setIsVisible(false), 200)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_DURATION, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#42151F]"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C6A15B]/[0.04] blur-[120px]" />
          </div>

          <div className="relative flex flex-col items-center px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6 h-20 w-20 overflow-hidden rounded-full ring-2 ring-white/10 sm:h-24 sm:w-24"
            >
              <img
                src="/images/Logo.png"
                alt={`${businessName} Logo`}
                className="h-full w-full object-cover"
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-2xl font-semibold tracking-[0.15em] uppercase text-white sm:text-3xl"
            >
              {businessName}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 text-[11px] tracking-[0.3em] uppercase text-white/40 sm:text-xs"
            >
              {tagline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-10 w-40 sm:w-48"
            >
              <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-[#C6A15B]"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.03 }}
                />
              </div>

              <p className="mt-3 text-center text-[10px] tracking-[0.2em] text-white/30">
                {Math.round(progress)}%
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
