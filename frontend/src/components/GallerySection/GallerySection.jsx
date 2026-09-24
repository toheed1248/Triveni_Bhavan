import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Expand,
  Sparkles,
  Images,
} from 'lucide-react'
import { useGallery } from '../../hooks/useGallery'
import { resolveMediaUrl } from '../../utils/helpers'

const categories = [
  'All',
  'Exterior',
  'Open Hall',
  'Closed / Banquet Hall',
  'Mandir',
  'Interiors',
  'Events & Decoration',
  'Rooms',
]

/* =========================================================
   FILTER
========================================================= */

function GalleryFilter({ active, onChange }) {
  return (
    <div className="mb-10 overflow-x-auto pb-2 scrollbar-hide sm:mb-12">
      <div className="flex min-w-max justify-center gap-2 px-1">
        {categories.map((cat) => {
          const isActive = active === cat

          return (
            <button
              key={cat}
              onClick={() => onChange(cat)}
              className={`
                relative overflow-hidden rounded-full px-4 py-2.5
                text-[11px] font-semibold uppercase tracking-[0.12em]
                transition-all duration-300 sm:px-5 sm:text-xs
                ${
                  isActive
                    ? 'bg-[#42151F] text-white shadow-[0_8px_25px_rgba(66,21,31,0.18)]'
                    : 'border border-[#211B19]/10 bg-white/60 text-[#211B19]/55 hover:border-[#C6A15B]/50 hover:bg-white hover:text-[#211B19]'
                }
              `}
            >
              {isActive && (
                <motion.span
                  layoutId="gallery-filter-active"
                  className="absolute inset-0 rounded-full bg-[#42151F]"
                  transition={{
                    type: 'spring',
                    stiffness: 350,
                    damping: 30,
                  }}
                />
              )}

              <span className="relative z-10">{cat}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* =========================================================
   GALLERY CARD
========================================================= */

function GalleryCard({ item, index, onClick }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const thumbUrl = resolveMediaUrl(item.thumbnailUrl || item.image)
  const fullUrl = resolveMediaUrl(item.image)

  const buildSrcSet = () => {
    if (!item.variants) return undefined

    const entries = Object.entries(item.variants)

    if (entries.length === 0) return undefined

    return entries
      .map(([w, url]) => `${resolveMediaUrl(url)} ${w}w`)
      .join(', ')
  }

  const srcSet = buildSrcSet()

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{
        duration: 0.55,
        delay: Math.min(index * 0.035, 0.25),
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`
        group relative cursor-pointer overflow-hidden
        rounded-[1.35rem] border border-white/70
        bg-[#211B19]/5
        shadow-[0_12px_40px_rgba(33,27,25,0.07)]
        transition-all duration-500
        hover:-translate-y-1
        hover:shadow-[0_25px_65px_rgba(33,27,25,0.15)]
        ${item.span || ''}
      `}
      onClick={() => onClick(item)}
    >
      <div className="relative h-full min-h-[260px] overflow-hidden sm:min-h-[300px] lg:min-h-[320px]">
        {!error ? (
          <img
            src={thumbUrl}
            srcSet={srcSet}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            alt={item.title}
            loading={index < 4 ? 'eager' : 'lazy'}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            className={`
              absolute inset-0 h-full w-full object-cover
              transition-all duration-1000 ease-out
              group-hover:scale-[1.07]
              ${
                loaded
                  ? 'opacity-100'
                  : 'scale-[1.02] opacity-0'
              }
            `}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#211B19]/5">
            <span className="text-xs text-[#211B19]/30">
              Image unavailable
            </span>
          </div>
        )}

        {/* Loading */}
        {!loaded && !error && (
          <div className="absolute inset-0 animate-pulse bg-[#211B19]/5" />
        )}

        {/* Cinematic overlay */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-t
            from-[#211B19]/90 via-[#211B19]/10 to-transparent
            opacity-80
            transition-opacity duration-500
            group-hover:opacity-100
          "
        />

        {/* Top category */}
        <div className="absolute left-4 top-4 sm:left-5 sm:top-5">
          <span
            className="
              rounded-full border border-white/20
              bg-black/20 px-3 py-1.5
              text-[9px] font-semibold uppercase
              tracking-[0.15em] text-white/85
              backdrop-blur-md
            "
          >
            {item.category}
          </span>
        </div>

        {/* Expand */}
        <div
          className="
            absolute right-4 top-4 flex
            h-10 w-10 items-center justify-center
            rounded-full border border-white/20
            bg-black/20 text-white
            opacity-0 backdrop-blur-md
            translate-y-2
            transition-all duration-500
            group-hover:translate-y-0
            group-hover:opacity-100
            sm:right-5 sm:top-5
          "
        >
          <Expand size={15} />
        </div>

        {/* Bottom content */}
        <div
          className="
            absolute inset-x-0 bottom-0
            p-5 sm:p-6
            translate-y-1
            transition-transform duration-500
            group-hover:translate-y-0
          "
        >
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <h3 className="truncate font-serif text-xl text-white sm:text-2xl">
                {item.title || 'Triveni Bhavan'}
              </h3>

              <div className="mt-2 h-px w-8 bg-[#E4C77E] transition-all duration-500 group-hover:w-14" />
            </div>

            <div
              className="
                flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-full border border-white/20
                bg-white/10 text-white
                backdrop-blur-md
                transition-transform duration-500
                group-hover:rotate-[-45deg]
              "
            >
              <ArrowRight size={15} />
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

/* =========================================================
   LIGHTBOX
========================================================= */

function Lightbox({
  items,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}) {
  const item = items[currentIndex]
  const [imgLoaded, setImgLoaded] = useState(false)

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    },
    [onClose, onPrev, onNext]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  useEffect(() => {
    setImgLoaded(false)
  }, [currentIndex])

  if (!item) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-[#100D0C]/[0.97]
        backdrop-blur-xl
      "
      role="dialog"
      aria-label="Image viewer"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C6A15B]/5 blur-[100px]" />

      {/* Close */}
      <button
        onClick={onClose}
        className="
          absolute right-4 top-4 z-20
          flex h-11 w-11 items-center justify-center
          rounded-full border border-white/10
          bg-white/10 text-white
          backdrop-blur-md
          transition hover:bg-white/20
          sm:right-7 sm:top-7
        "
        aria-label="Close viewer"
      >
        <X size={19} />
      </button>

      {/* Previous */}
      <button
        onClick={onPrev}
        className="
          absolute left-3 top-1/2 z-20
          flex h-11 w-11 -translate-y-1/2
          items-center justify-center
          rounded-full border border-white/10
          bg-white/10 text-white
          backdrop-blur-md
          transition hover:bg-white/20
          sm:left-7
        "
        aria-label="Previous image"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Next */}
      <button
        onClick={onNext}
        className="
          absolute right-3 top-1/2 z-20
          flex h-11 w-11 -translate-y-1/2
          items-center justify-center
          rounded-full border border-white/10
          bg-white/10 text-white
          backdrop-blur-md
          transition hover:bg-white/20
          sm:right-7
        "
        aria-label="Next image"
      >
        <ChevronRight size={20} />
      </button>

      {/* Image */}
      <div className="relative mx-14 flex max-h-[88vh] w-full max-w-6xl flex-col items-center sm:mx-20">
        {!imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/20 border-t-[#E4C77E]" />
          </div>
        )}

        <motion.img
          key={item.id}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{
            opacity: imgLoaded ? 1 : 0,
            scale: 1,
          }}
          transition={{ duration: 0.45 }}
          src={resolveMediaUrl(item.image)}
          alt={item.title}
          onLoad={() => setImgLoaded(true)}
          className="
            max-h-[72vh]
            w-auto max-w-full
            rounded-xl
            object-contain
            shadow-[0_30px_100px_rgba(0,0,0,0.45)]
            sm:max-h-[76vh]
          "
        />

        {/* Info */}
        <div className="mt-5 text-center">
          <p className="font-serif text-lg text-white sm:text-xl">
            {item.title || 'Triveni Bhavan'}
          </p>

          <div className="mt-2 flex items-center justify-center gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E4C77E]">
              {item.category}
            </span>

            <span className="h-1 w-1 rounded-full bg-white/20" />

            <span className="text-xs text-white/35">
              {currentIndex + 1} / {items.length}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* =========================================================
   SKELETON
========================================================= */

function GallerySkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="
            min-h-[260px]
            animate-pulse
            rounded-[1.35rem]
            bg-[#211B19]/5
          "
        />
      ))}
    </div>
  )
}

/* =========================================================
   MAIN GALLERY
========================================================= */

export default function GallerySection() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const apiCategory =
    activeCategory === 'All' ? '' : activeCategory

  const {
    images: apiImages,
    loading,
  } = useGallery(apiCategory, 1, 50)

  const galleryItems = apiImages.map((img) => ({
    id: img._id || img.id,
    title: img.title || img.name || '',
    category: img.category || 'Uncategorized',
    image: img.imageUrl || img.url || '',
    thumbnailUrl: img.thumbnailUrl || '',
    variants: img.variants || {},
    span: img.span || '',
  }))

  const filteredItems =
    activeCategory === 'All'
      ? galleryItems
      : galleryItems.filter(
          (item) => item.category === activeCategory
        )

  const openLightbox = (item) => {
    setLightboxIndex(
      filteredItems.findIndex(
        (i) => i.id === item.id
      )
    )
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
  }

  const prevImage = () =>
    setLightboxIndex((prev) =>
      prev > 0
        ? prev - 1
        : filteredItems.length - 1
    )

  const nextImage = () =>
    setLightboxIndex((prev) =>
      prev < filteredItems.length - 1
        ? prev + 1
        : 0
    )

  return (
    <section
      id="gallery"
      className="
        relative overflow-hidden
        bg-[#F7F3ED]
        py-20 sm:py-24 lg:py-32
      "
    >
      {/* =====================================================
          BACKGROUND DETAILS
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-[#C6A15B]/10 blur-[100px]" />

        <div className="absolute -left-40 bottom-20 h-96 w-96 rounded-full bg-[#42151F]/5 blur-[100px]" />

        <div className="absolute left-1/2 top-0 h-px w-1/2 bg-gradient-to-r from-transparent via-[#C6A15B]/20 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mx-auto mb-12 max-w-4xl text-center sm:mb-14 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="
              mb-5 inline-flex items-center gap-2
              rounded-full border border-[#C6A15B]/25
              bg-white/60 px-4 py-2
              text-[10px] font-semibold
              uppercase tracking-[0.22em]
              text-[#8E6F35]
              backdrop-blur-md
            "
          >
            <Images size={13} />
            Triveni Bhavan Gallery
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="
              font-serif
              text-4xl font-medium
              leading-[1.05]
              tracking-tight
              text-[#211B19]
              sm:text-5xl
              lg:text-6xl
            "
          >
            See the moments.
            <span className="block text-[#8E6F35]">
              Feel the celebration.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, delay: 0.16 }}
            className="
              mx-auto mt-6 max-w-2xl
              text-sm leading-7
              text-[#211B19]/55
              sm:text-base
            "
          >
            Explore Triveni Bhavan through the spaces,
            celebrations and memories that make every
            occasion special.
          </motion.p>
        </div>

        {/* =====================================================
            FILTER
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <GalleryFilter
            active={activeCategory}
            onChange={setActiveCategory}
          />
        </motion.div>

        {/* =====================================================
            GALLERY
        ====================================================== */}

        {loading ? (
          <GallerySkeleton />
        ) : (
          <motion.div
            layout
            className="
              grid
              grid-cols-1
              gap-3
              sm:grid-cols-2
              sm:gap-4
              lg:grid-cols-3
              lg:auto-rows-[250px]
            "
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  index={index}
                  onClick={openLightbox}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* =====================================================
            EMPTY
        ====================================================== */}

        {!loading && filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              rounded-[2rem]
              border border-[#211B19]/10
              bg-white/60
              px-6 py-20
              text-center
              backdrop-blur-md
            "
          >
            <Images
              size={30}
              className="mx-auto text-[#C6A15B]"
            />

            <p className="mt-5 font-serif text-2xl text-[#211B19]">
              No images here yet.
            </p>

            <p className="mt-2 text-sm text-[#211B19]/45">
              More memories will appear in this category soon.
            </p>
          </motion.div>
        )}

        {/* =====================================================
            BOTTOM CTA
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="mt-12 sm:mt-16"
        >
          <div
            className="
              relative overflow-hidden
              rounded-[2rem]
              bg-[#211B19]
              px-6 py-8
              sm:px-9 sm:py-9
              lg:px-12
            "
          >
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#C6A15B]/10 blur-3xl" />

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E4C77E]">
                  Explore More Memories
                </p>

                <h3 className="mt-2 font-serif text-2xl text-white sm:text-3xl">
                  There is more to discover.
                </h3>
              </div>

              <a
                href="#gallery"
                className="
                  group inline-flex w-fit
                  items-center gap-2.5
                  rounded-full
                  bg-[#E4C77E]
                  px-6 py-3.5
                  text-sm font-semibold
                  text-[#211B19]
                  transition-all duration-300
                  hover:bg-white
                  hover:shadow-[0_10px_35px_rgba(228,199,126,0.18)]
                "
              >
                View Full Gallery
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* =====================================================
          LIGHTBOX
      ====================================================== */}

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            items={filteredItems}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>
    </section>
  )
}