import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star, ArrowUpRight } from 'lucide-react'
import { useBusinessSettings } from '../../contexts/BusinessSettingsContext'

const stats = [
  {
    value: 1000,
    suffix: '+',
    label: 'Guests Capacity',
    description: 'Designed for memorable gatherings',
  },
  {
    value: 21,
    suffix: '+',
    label: 'Years of Experience',
    description: 'A legacy built over time',
  },
  {
    value: 1000,
    suffix: '+',
    label: 'Events Hosted',
    description: 'Celebrations made unforgettable',
  },
  {
    value: 500,
    suffix: '+',
    label: 'Happy Customers',
    description: 'Trusted by families & guests',
  },
  {
    value: 4.3,
    suffix: '',
    label: 'Google Rating',
    description: 'Rated by our guests',
    decimal: true,
    rating: true,
  },
]

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const item = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

function AnimatedNumber({ value, suffix, decimal = false, active }) {
  const [count, setCount] = useState(0)
  const animationRef = useRef(null)

  useEffect(() => {
    if (!active) return

    let startTime = null
    const duration = 1800

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp

      const progress = Math.min(
        (timestamp - startTime) / duration,
        1
      )

      // Smooth ease-out
      const eased =
        1 - Math.pow(1 - progress, 4)

      const currentValue = value * eased

      setCount(
        decimal
          ? Number(currentValue.toFixed(1))
          : Math.floor(currentValue)
      )

      if (progress < 1) {
        animationRef.current =
          requestAnimationFrame(animate)
      } else {
        setCount(value)
      }
    }

    animationRef.current =
      requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [active, value, decimal])

  return (
    <>
      {decimal ? count.toFixed(1) : count}
      {suffix}
    </>
  )
}

function StatCard({ stat }) {
  const ref = useRef(null)

  const isInView = useInView(ref, {
    once: true,
    margin: '-80px',
  })

  return (
    <motion.div
      ref={ref}
      variants={item}
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border border-white/[0.08]
        bg-white/[0.045]
        backdrop-blur-xl
        px-5
        py-7
        sm:px-6
        sm:py-8
        transition-all
        duration-500
        hover:-translate-y-1
        hover:border-[#C6A15B]/30
        hover:bg-white/[0.065]
        hover:shadow-[0_20px_50px_rgba(0,0,0,0.18)]
      "
    >

      {/* Background glow */}

      <div
        className="
          pointer-events-none
          absolute
          -right-12
          -top-12
          h-28
          w-28
          rounded-full
          bg-[#C6A15B]/10
          blur-3xl
          transition-all
          duration-500
          group-hover:bg-[#C6A15B]/20
        "
      />

      {/* Number */}

      <div className="relative">

        <div className="flex items-end justify-center">

          <span
            className="
              font-heading
              text-[2.7rem]
              sm:text-5xl
              lg:text-[3.2rem]
              font-semibold
              tracking-tight
              text-[#E4C77E]
            "
          >
            <AnimatedNumber
              value={stat.value}
              suffix={stat.suffix}
              decimal={stat.decimal}
              active={isInView}
            />
          </span>

          {stat.rating && (
            <Star
              size={20}
              fill="currentColor"
              strokeWidth={1.5}
              className="
                mb-2
                ml-1
                text-[#E4C77E]
              "
            />
          )}

        </div>

        {/* Label */}

        <p
          className="
            mt-3
            text-sm
            sm:text-[15px]
            font-medium
            text-white/85
          "
        >
          {stat.label}
        </p>

        {/* Description */}

        <p
          className="
            mt-1.5
            text-[11px]
            sm:text-xs
            leading-relaxed
            text-white/40
          "
        >
          {stat.description}
        </p>

        {/* Bottom indicator */}

        <div className="mt-5 flex items-center justify-center">

          <span
            className="
              h-px
              w-7
              bg-[#C6A15B]/30
              transition-all
              duration-500
              group-hover:w-12
              group-hover:bg-[#C6A15B]
            "
          />

        </div>

      </div>
    </motion.div>
  )
}

export default function Highlights() {
  const { settings } = useBusinessSettings()

  const stats = [
    ...(settings?.capacity ? [{
      value: settings.capacity,
      suffix: '+',
      label: 'Guests Capacity',
      description: 'Designed for memorable gatherings',
    }] : []),
    ...(settings?.yearsExperience ? [{
      value: settings.yearsExperience,
      suffix: '+',
      label: 'Years of Experience',
      description: 'A legacy built over time',
    }] : []),
    ...(settings?.eventsHosted ? [{
      value: settings.eventsHosted,
      suffix: '+',
      label: 'Events Hosted',
      description: 'Celebrations made unforgettable',
    }] : []),
    ...(settings?.customers ? [{
      value: settings.customers,
      suffix: '+',
      label: 'Happy Customers',
      description: 'Trusted by families & guests',
    }] : []),
    ...(settings?.googleRating ? [{
      value: settings.googleRating,
      suffix: '',
      label: 'Google Rating',
      description: 'Rated by our guests',
      decimal: true,
      rating: true,
    }] : []),
  ]

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#42151F]
        py-20
        sm:py-24
        lg:py-28
      "
    >

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >

        <div
          className="
            absolute
            -left-32
            top-10
            h-80
            w-80
            rounded-full
            bg-[#C6A15B]/10
            blur-[100px]
          "
        />

        <div
          className="
            absolute
            -right-32
            bottom-0
            h-96
            w-96
            rounded-full
            bg-[#C6A15B]/[0.07]
            blur-[120px]
          "
        />

      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div
        className="
          relative
          mx-auto
          max-w-[1400px]
          px-5
          sm:px-8
          lg:px-12
        "
      >

        {/* Header */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            margin: '-80px',
          }}
          transition={{
            duration: 0.7,
          }}
          className="
            mx-auto
            mb-12
            max-w-2xl
            text-center
            sm:mb-16
          "
        >

          {/* Eyebrow */}

          <div className="mb-4 flex items-center justify-center gap-3">

            <span className="h-px w-7 bg-[#C6A15B]/60" />

            <p
              className="
                text-[10px]
                sm:text-xs
                font-medium
                uppercase
                tracking-[0.3em]
                text-[#E4C77E]
              "
            >
              Why Choose Us
            </p>

            <span className="h-px w-7 bg-[#C6A15B]/60" />

          </div>

          {/* Heading */}

          <h2
            className="
              font-heading
              text-3xl
              sm:text-4xl
              lg:text-5xl
              font-semibold
              tracking-tight
              text-white
            "
          >
            A Legacy of
            <span className="text-[#E4C77E]">
              {' '}Excellence
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-lg
              text-sm
              sm:text-base
              leading-relaxed
              text-white/50
            "
          >
            Years of experience, countless celebrations,
            and memories that stay with you forever.
          </p>

        </motion.div>

        {/* =====================================================
            STATS
        ====================================================== */}

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            margin: '-80px',
          }}
          className="
            grid
            grid-cols-2
            gap-3
            sm:gap-5
            lg:grid-cols-5
          "
        >

          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              stat={stat}
            />
          ))}

        </motion.div>

        {/* =====================================================
            BOTTOM STATEMENT
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.5,
            duration: 0.8,
          }}
          className="
            mt-10
            flex
            items-center
            justify-center
            gap-2
            text-center
          "
        >

          <span
            className="
              text-[10px]
              sm:text-xs
              uppercase
              tracking-[0.2em]
              text-white/30
            "
          >
            {settings?.yearsExperience ? `Trusted for ${settings.yearsExperience}+ years` : 'Trusted by families everywhere'}
          </span>

          <ArrowUpRight
            size={13}
            className="text-[#C6A15B]/50"
          />

        </motion.div>

      </div>
    </section>
  )
}