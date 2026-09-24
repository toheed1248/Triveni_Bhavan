import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useBusinessSettings } from '../../contexts/BusinessSettingsContext'

function CountUp({ end, suffix = '', decimals = 0, start }) {
  const [value, setValue] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!start || hasAnimated.current) return
    hasAnimated.current = true

    const duration = 2000
    const startTime = performance.now()
    const step = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(eased * end)
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, end])

  const display = decimals > 0 ? value.toFixed(decimals) : Math.floor(value)
  return <span>{display}{suffix}</span>
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
}

export default function HighlightsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.35 })
  const { settings } = useBusinessSettings()

  const highlights = [
    settings?.capacity ? { end: settings.capacity, suffix: '+', label: 'Guests Capacity' } : null,
    settings?.yearsExperience ? { end: settings.yearsExperience, suffix: '+', label: 'Years of Experience' } : null,
    settings?.eventsHosted ? { end: settings.eventsHosted, suffix: '+', label: 'Events Hosted' } : null,
    settings?.customers ? { end: settings.customers, suffix: '+', label: 'Happy Customers' } : null,
    settings?.googleRating ? { end: settings.googleRating, suffix: '★', label: 'Google Rating', decimals: 1 } : null,
  ].filter(Boolean)

  if (highlights.length === 0) return null

  return (
    <section ref={ref} className="relative bg-maroon py-12 md:py-14 lg:py-16 overflow-hidden">
      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="text-center mb-10 sm:mb-12">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-gold-antique mb-2.5"
          >
            Why Choose Us
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="font-heading text-2xl sm:text-3xl lg:text-3xl font-semibold text-ivory tracking-tight"
          >
            A Legacy of Excellence
          </motion.h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-8 gap-x-4 sm:gap-x-6"
        >
          {highlights.map((stat) => (
            <motion.div
              key={stat.label}
              variants={item}
              className="text-center"
            >
              <div className="mb-2">
                <span className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-gold-antique">
                  <CountUp
                    end={stat.end}
                    suffix={stat.suffix}
                    decimals={stat.decimals || 0}
                    start={isInView}
                  />
                </span>
              </div>
              <p className="text-sm text-ivory/60 font-medium tracking-wide">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}