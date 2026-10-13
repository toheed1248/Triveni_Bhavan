import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useBusinessSettings } from '../../contexts/BusinessSettingsContext'

const heroSlides = [
  {
    image: '/images/Night_View.webp',
    alt: 'Triveni Bhavan nighttime view',
    posD: 'center center',
    posM: 'center 62%',
  },
  {
    image: '/images/Mandir_outside.webp',
    alt: 'Triveni Bhavan Mandir',
    posD: 'center center',
    posM: 'center 58%',
  },
  {
    image: '/images/Day_view_of_open_hall.webp',
    alt: 'Triveni Bhavan open hall',
    posD: 'center center',
    posM: 'center 62%',
  },
  {
    image: '/images/Night_open_hall_function.webp',
    alt: 'Triveni Bhavan banquet function',
    posD: 'center center',
    posM: 'center 58%',
  },
]

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 + i * 0.1,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

function SlideImage({ slide, index, isMobile }) {
  const objectPosition = isMobile ? slide.posM : slide.posD

  return (
    <img
      src={slide.image}
      alt={slide.alt}
      className={`hero-slide-${index} absolute inset-0 h-full w-full object-cover`}
      style={{
        objectPosition,
        willChange: 'transform',
      }}
      loading="eager"
      fetchPriority="high"
    />
  )
}

function PreloadAllImages({ onComplete }) {
  useEffect(() => {
    let completed = 0
    const total = heroSlides.length

    const checkComplete = () => {
      completed++
      if (completed === total) {
        onComplete()
      }
    }

    heroSlides.forEach((slide) => {
      const img = new Image()
      img.onload = checkComplete
      img.onerror = checkComplete
      img.src = slide.image
      img.fetchPriority = 'high'
    })
  }, [onComplete])

  return null
}

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [imagesReady, setImagesReady] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const touchStartX = useRef(null)
  const { settings } = useBusinessSettings()

  const businessName = settings?.businessName || 'Triveni Bhavan'
  const tagline = settings?.tagline || 'Where Traditions Meet Celebration.'
  const description = settings?.description || 'A timeless destination for weddings, celebrations, gatherings and unforgettable moments.'
  const yearsExperience = settings?.yearsExperience || 0

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % heroSlides.length)
  }, [])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(next, 3000)
    return () => clearInterval(timer)
  }, [next])

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX
  }

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return

    const endX = event.changedTouches[0].clientX
    const distance = touchStartX.current - endX

    if (Math.abs(distance) > 55) {
      if (distance > 0) next()
      else prev()
    }

    touchStartX.current = null
  }

  const slide = heroSlides[current]

  if (!imagesReady) {
    return (
      <section
        id="home"
        aria-label="Triveni Bhavan Hero"
        className="
          relative
          h-[100vh]
          h-[100svh]
          min-h-[680px]
          w-full
          overflow-hidden
          bg-[#211B19]
          select-none
        "
      >
        <div className="absolute inset-0 bg-[#211B19]" />
        <PreloadAllImages onComplete={() => setImagesReady(true)} />
      </section>
    )
  }

  return (
    <section
      id="home"
      aria-label="Triveni Bhavan Hero"
      className="
        relative
        h-[100vh]
        h-[100svh]
        min-h-[680px]
        w-full
        overflow-hidden
        select-none
      "
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* =====================================================
          BACKGROUND SLIDES
      ====================================================== */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: 'easeInOut' }}
          >
            <div className="absolute inset-0 h-full w-full">
              <motion.div
                className="absolute inset-0 h-full w-full"
                initial={{ scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 3.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <SlideImage slide={slide} index={current} isMobile={isMobile} />
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Desktop left readability gradient */}
      <div
        className="
          absolute inset-0
          hidden sm:block
          bg-gradient-to-r
          from-black/75
          via-black/35
          to-black/5
        "
      />

      {/* Mobile readability gradient */}
      <div
        className="
          absolute inset-0
          sm:hidden
          bg-gradient-to-b
          from-black/35
          via-black/5
          to-black/75
        "
      />

      {/* Bottom cinematic fade */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-t
          from-black/65
          via-transparent
          to-black/10
        "
      />

      {/* =====================================================
          HERO CONTENT
      ====================================================== */}
      <div className="relative z-10 flex h-full items-center">
        <div
          className="
            mx-auto
            w-full
            max-w-[1500px]
            px-5
            sm:px-8
            lg:px-12
            xl:px-16
            pt-24
            pb-28
            sm:pt-28
            sm:pb-24
          "
        >
          <div className="max-w-[820px]">

            {/* Small brand mark + eyebrow */}
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mb-5 sm:mb-7 flex items-center gap-3 sm:gap-4"
            >
              <div className="
                h-11 w-11
                sm:h-12 sm:w-12
                overflow-hidden
                rounded-full
                border border-white/30
                bg-white/95
                p-1
                shadow-[0_8px_30px_rgba(0,0,0,0.2)]
              ">
                <img
                  src="/images/Logo.png"
                  alt="Triveni Bhavan logo"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="h-px w-7 sm:w-10 bg-[#D8B76A]" />
                <span className="
                  text-[10px]
                  sm:text-xs
                  font-semibold
                  uppercase
                  tracking-[0.28em]
                  text-[#E4C77E]
                ">
                  {businessName}
                </span>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="
                font-heading
                max-w-[850px]
                text-[2.65rem]
                leading-[1.03]
                tracking-[-0.035em]
                font-semibold
                text-white
                sm:text-5xl
                md:text-6xl
                lg:text-7xl
                xl:text-[5.25rem]
              "
            >
              {tagline.split('\n').map((line, i) => (
                <span key={i} className={i > 0 ? 'block text-white/90' : ''}>
                  {line}
                </span>
              ))}
            </motion.h1>

            {/* Description */}
            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="
                mt-5
                max-w-[570px]
                text-[14px]
                leading-6
                text-white/75
                sm:mt-6
                sm:text-base
                sm:leading-7
              "
            >
              {description}
            </motion.p>

            {/* CTAs */}
            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="
                mt-7
                flex
                flex-col
                gap-3
                sm:mt-9
                sm:flex-row
              "
            >
              <a
                href="#venue"
                className="
                  group
                  inline-flex
                  min-h-[52px]
                  items-center
                  justify-center
                  gap-3
                  rounded-full
                  bg-[#C6A15B]
                  px-6
                  text-sm
                  font-semibold
                  text-[#211B19]
                  shadow-[0_12px_35px_rgba(0,0,0,0.2)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#D8B76A]
                  hover:shadow-[0_16px_40px_rgba(198,161,91,0.28)]
                  sm:min-w-[180px]
                "
              >
                <span>Explore Venue</span>
                <span className="
                  flex h-7 w-7 items-center justify-center
                  rounded-full bg-[#211B19]/10
                  transition-transform duration-300
                  group-hover:translate-x-0.5
                ">
                  <ArrowUpRight size={15} />
                </span>
              </a>

              <a
                href="#enquire"
                className="
                  group
                  inline-flex
                  min-h-[52px]
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  border border-white/25
                  bg-black/15
                  px-6
                  text-sm
                  font-medium
                  text-white
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:border-white/40
                  hover:bg-white/10
                  sm:min-w-[180px]
                "
              >
                <span>Plan Your Event</span>
                <ArrowUpRight
                  size={15}
                  className="
                    text-white/60
                    transition-all duration-300
                    group-hover:-translate-y-0.5
                    group-hover:translate-x-0.5
                    group-hover:text-white
                  "
                />
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* =====================================================
          BOTTOM INFORMATION
      ====================================================== */}
      <div className="
        absolute
        bottom-5
        left-5
        right-5
        z-20
        flex
        items-end
        justify-between
        gap-4
        sm:bottom-7
        sm:left-8
        sm:right-8
        lg:left-12
        lg:right-12
      ">
        {/* Venue metadata */}
        <div className="hidden sm:flex items-center gap-5 text-[10px] uppercase tracking-[0.22em] text-white/45">
          {yearsExperience > 0 && (
            <>
              <span>{yearsExperience}+ Years</span>
              <span className="h-3 w-px bg-white/20" />
            </>
          )}
          <span>Fatehpur, Rajasthan</span>
        </div>

        {/* Slide controls */}
        <div className="ml-auto flex items-center gap-2">
          <div className="
            flex items-center gap-1
            rounded-full
            border border-white/15
            bg-black/20
            p-1.5
            backdrop-blur-xl
          ">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="
                flex h-9 w-9 items-center justify-center
                rounded-full text-white/65
                transition hover:bg-white/10 hover:text-white
              "
            >
              <ChevronLeft size={17} />
            </button>

            <div className="
              min-w-[55px]
              text-center
              text-[11px]
              font-medium
              tracking-[0.16em]
              text-white/80
              tabular-nums
            ">
              <span className="text-white">
                {String(current + 1).padStart(2, '0')}
              </span>
              <span className="mx-1 text-white/25">/</span>
              <span className="text-white/45">
                {String(heroSlides.length).padStart(2, '0')}
              </span>
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="
                flex h-9 w-9 items-center justify-center
                rounded-full text-white/65
                transition hover:bg-white/10 hover:text-white
              "
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          SLIDE PROGRESS
      ====================================================== */}
      <div className="
        absolute
        bottom-[84px]
        left-5
        z-20
        flex
        items-center
        gap-1.5
        sm:bottom-9
        sm:left-8
        lg:left-12
      ">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
            className="group relative h-5 flex items-center"
          >
            <span
              className={`
                block h-[2px] rounded-full transition-all duration-500
                ${
                  current === index
                    ? 'w-9 bg-[#C6A15B]'
                    : 'w-4 bg-white/25 group-hover:bg-white/50'
                }
              `}
            />
          </button>
        ))}
      </div>

      {/* Scroll indicator - desktop only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="
          absolute
          bottom-7
          left-1/2
          z-20
          hidden
          -translate-x-1/2
          flex-col
          items-center
          gap-1
          sm:flex
        "
      >
        <span className="
          text-[9px]
          font-medium
          uppercase
          tracking-[0.35em]
          text-white/35
        ">
          Scroll
        </span>

        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <ChevronDown
            size={16}
            strokeWidth={1.5}
            className="text-white/35"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
