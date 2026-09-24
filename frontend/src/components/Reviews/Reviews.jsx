import { useEffect, useState } from 'react'
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  Sparkles,
} from 'lucide-react'
import {
  usePublicReviews,
  useReviewSummary,
} from '../../hooks/useReviews'

export default function Reviews() {
  const { reviews, loading } = usePublicReviews(1, 6)
  const { summary } = useReviewSummary()

  const averageRating = summary?.averageRating || 4.3
  const totalReviews = summary?.totalReviews || 0

  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  /*
    Desktop = 3 cards
    Tablet = 2 cards
    Mobile = 1 card

    We keep the dynamic review array untouched.
  */
  const getVisibleCards = () => {
    if (typeof window === 'undefined') return 1
    if (window.innerWidth >= 1024) return 3
    if (window.innerWidth >= 768) return 2
    return 1
  }

  const [visibleCards, setVisibleCards] = useState(getVisibleCards())

  useEffect(() => {
    const handleResize = () => {
      setVisibleCards(getVisibleCards())
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const maxIndex = Math.max(
    0,
    reviews.length - visibleCards
  )

  useEffect(() => {
    setCurrent((prev) => Math.min(prev, maxIndex))
  }, [maxIndex])

  /*
    Auto slide
  */
  useEffect(() => {
    if (
      loading ||
      reviews.length <= visibleCards ||
      isPaused
    ) {
      return
    }

    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev >= maxIndex ? 0 : prev + 1
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [
    loading,
    reviews.length,
    visibleCards,
    maxIndex,
    isPaused,
  ])

  const nextSlide = () => {
    setCurrent((prev) =>
      prev >= maxIndex ? 0 : prev + 1
    )
  }

  const prevSlide = () => {
    setCurrent((prev) =>
      prev <= 0 ? maxIndex : prev - 1
    )
  }

  return (
    <section
      className="
        relative overflow-hidden
        bg-[#211B19]
        py-20 sm:py-24 lg:py-32
      "
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0">

        <div
          className="
            absolute -left-40 top-20
            h-[500px] w-[500px]
            rounded-full
            bg-[#C6A15B]/8
            blur-[120px]
          "
        />

        <div
          className="
            absolute -right-40 bottom-0
            h-[500px] w-[500px]
            rounded-full
            bg-[#42151F]/60
            blur-[120px]
          "
        />

        <div
          className="
            absolute left-1/2 top-0
            h-px w-1/2
            -translate-x-1/2
            bg-gradient-to-r
            from-transparent
            via-[#C6A15B]/20
            to-transparent
          "
        />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-12 text-center sm:mb-14 lg:mb-16">

          <div
            className="
              mb-5 inline-flex items-center gap-2
              rounded-full
              border border-[#C6A15B]/20
              bg-white/[0.05]
              px-4 py-2
              text-[10px] font-semibold
              uppercase tracking-[0.22em]
              text-[#E4C77E]
              backdrop-blur-md
            "
          >
            <Sparkles size={13} />
            Guest Stories
          </div>

          <h2
            className="
              font-serif
              text-4xl font-medium
              leading-[1.05]
              tracking-tight
              text-white
              sm:text-5xl
              lg:text-6xl
            "
          >
            What our guests
            <span className="block text-[#E4C77E]">
              remember.
            </span>
          </h2>

          <p
            className="
              mx-auto mt-6 max-w-2xl
              text-sm leading-7
              text-white/50
              sm:text-base
            "
          >
            Real experiences from guests who celebrated
            their special moments at Triveni Bhavan.
          </p>

          {/* Rating */}

          <div
            className="
              mt-7 inline-flex
              flex-wrap items-center
              justify-center gap-3
              rounded-full
              border border-white/10
              bg-white/[0.05]
              px-4 py-2.5
              backdrop-blur-md
            "
          >
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={15}
                  className={
                    star <= Math.round(averageRating)
                      ? 'fill-[#E4C77E] text-[#E4C77E]'
                      : 'fill-white/10 text-white/15'
                  }
                />
              ))}
            </div>

            <span className="h-4 w-px bg-white/10" />

            <span className="text-xs font-medium text-white/60">
              {averageRating} on Google
            </span>

            {totalReviews > 0 && (
              <>
                <span className="h-1 w-1 rounded-full bg-[#C6A15B]/50" />

                <span className="text-xs text-white/35">
                  {totalReviews} reviews
                </span>
              </>
            )}
          </div>
        </div>

        {/* =====================================================
            LOADING
        ====================================================== */}

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="
                  min-h-[320px]
                  animate-pulse
                  rounded-[2rem]
                  border border-white/5
                  bg-white/[0.04]
                "
              />
            ))}

          </div>
        ) : reviews.length === 0 ? (

          /* ===================================================
             EMPTY
          ================================================== */

          <div
            className="
              mx-auto max-w-2xl
              rounded-[2rem]
              border border-white/10
              bg-white/[0.04]
              px-6 py-16
              text-center
              backdrop-blur-md
            "
          >
            <Quote
              size={32}
              className="mx-auto text-[#C6A15B]/50"
            />

            <p className="mt-5 font-serif text-2xl text-white">
              Guest stories are coming soon.
            </p>

            <p className="mt-3 text-sm leading-6 text-white/40">
              Reviews will appear here as verified customer
              feedback becomes available.
            </p>
          </div>

        ) : (

          /* ===================================================
             SLIDER
          ================================================== */

          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >

            {/* Slider viewport */}

            <div className="overflow-hidden px-1 py-3">

              <div
                className="
                  flex
                  transition-transform
                  duration-700
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                "
                style={{
                  transform: `translateX(-${
                    current * (100 / visibleCards)
                  }%)`,
                }}
              >

                {reviews.map((review, i) => (

                  <div
                    key={i}
                    className="
                      min-w-0
                      shrink-0
                      px-2
                      md:px-2.5
                    "
                    style={{
                      flexBasis: `${100 / visibleCards}%`,
                    }}
                  >

                    <article
                      className="
                        group relative
                        flex h-full
                        min-h-[330px]
                        flex-col
                        overflow-hidden
                        rounded-[2rem]
                        border border-white/10
                        bg-white/[0.055]
                        p-6
                        shadow-[0_20px_60px_rgba(0,0,0,0.18)]
                        backdrop-blur-xl
                        transition-all
                        duration-500
                        hover:-translate-y-1
                        hover:border-[#C6A15B]/20
                        hover:bg-white/[0.07]
                        sm:p-7
                        lg:p-8
                      "
                    >

                      {/* Gold glow */}

                      <div
                        className="
                          pointer-events-none
                          absolute -right-16 -top-16
                          h-40 w-40
                          rounded-full
                          bg-[#C6A15B]/8
                          blur-3xl
                          transition-opacity
                          duration-500
                          group-hover:bg-[#C6A15B]/12
                        "
                      />

                      {/* Quote */}

                      <div className="relative flex items-start justify-between">

                        <div
                          className="
                            flex h-11 w-11
                            items-center justify-center
                            rounded-2xl
                            bg-[#C6A15B]/10
                            text-[#E4C77E]
                          "
                        >
                          <Quote
                            size={20}
                            strokeWidth={1.7}
                          />
                        </div>

                        <span
                          className="
                            text-[10px]
                            font-medium
                            uppercase
                            tracking-[0.18em]
                            text-white/20
                          "
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </div>

                      {/* Stars */}

                      <div className="relative mt-7 flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={
                              star <= review.rating
                                ? 'fill-[#E4C77E] text-[#E4C77E]'
                                : 'fill-white/10 text-white/15'
                            }
                          />
                        ))}
                      </div>

                      {/* Review */}

                      <p
                        className="
                          relative mt-5
                          flex-1
                          text-sm
                          leading-7
                          text-white/65
                          sm:text-[15px]
                        "
                      >
                        “{review.reviewText}”
                      </p>

                      {/* Divider */}

                      <div className="my-6 h-px bg-gradient-to-r from-[#C6A15B]/30 via-white/10 to-transparent" />

                      {/* Reviewer */}

                      <div className="relative flex items-center justify-between gap-4">

                        <div className="flex min-w-0 items-center gap-3">

                          <div
                            className="
                              flex h-10 w-10
                              shrink-0
                              items-center justify-center
                              rounded-full
                              bg-[#E4C77E]
                              text-xs
                              font-bold
                              text-[#42151F]
                            "
                          >
                            {(review.reviewerName || 'G')
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">
                              {review.reviewerName}
                            </p>

                            <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-white/30">
                              Guest
                            </p>
                          </div>

                        </div>

                        <span className="shrink-0 text-[10px] text-white/25">
                          {review.reviewDate}
                        </span>

                      </div>

                    </article>
                  </div>

                ))}

              </div>
            </div>

            {/* =================================================
                CONTROLS
            ================================================== */}

            {reviews.length > visibleCards && (
              <div className="mt-8 flex items-center justify-center gap-4">

                {/* Previous */}

                <button
                  type="button"
                  onClick={prevSlide}
                  className="
                    flex h-11 w-11
                    items-center justify-center
                    rounded-full
                    border border-white/10
                    bg-white/[0.05]
                    text-white/60
                    backdrop-blur-md
                    transition-all
                    hover:border-[#C6A15B]/30
                    hover:bg-[#C6A15B]/10
                    hover:text-[#E4C77E]
                    active:scale-95
                  "
                  aria-label="Previous review"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Dots */}

                <div className="flex items-center gap-1.5">

                  {Array.from({
                    length: maxIndex + 1,
                  }).map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrent(index)}
                      aria-label={`Go to review ${index + 1}`}
                      className="
                        flex h-6 items-center
                      "
                    >
                      <span
                        className={`
                          block h-1.5 rounded-full
                          transition-all duration-300
                          ${
                            current === index
                              ? 'w-7 bg-[#E4C77E]'
                              : 'w-1.5 bg-white/20 hover:bg-white/40'
                          }
                        `}
                      />
                    </button>
                  ))}

                </div>

                {/* Next */}

                <button
                  type="button"
                  onClick={nextSlide}
                  className="
                    flex h-11 w-11
                    items-center justify-center
                    rounded-full
                    border border-white/10
                    bg-white/[0.05]
                    text-white/60
                    backdrop-blur-md
                    transition-all
                    hover:border-[#C6A15B]/30
                    hover:bg-[#C6A15B]/10
                    hover:text-[#E4C77E]
                    active:scale-95
                  "
                  aria-label="Next review"
                >
                  <ChevronRight size={18} />
                </button>

              </div>
            )}

          </div>
        )}

        {/* =====================================================
            BOTTOM MESSAGE
        ====================================================== */}

        {reviews.length > 0 && !loading && (
          <div className="mt-10 text-center">

            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/25">
              Real experiences • Genuine moments • Triveni Bhavan
            </p>

          </div>
        )}
      </div>
    </section>
  )
}