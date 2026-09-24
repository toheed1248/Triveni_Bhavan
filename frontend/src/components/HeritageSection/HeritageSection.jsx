import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

const labels = ['Traditional Setting', 'Temple', 'Heritage Surroundings']

function LazyImage({ src, alt, className = '', ...props }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
      {!loaded && (
        <div className="absolute inset-0 bg-dark/5 animate-pulse" />
      )}
    </div>
  )
}

export default function HeritageSection() {
  return (
    <section className="relative bg-ivory py-20 sm:py-24 lg:py-32 overflow-hidden">
      {/* Subtle gold decorative line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-gold-antique/30 to-transparent" />

      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Images - Left */}
          <div className="relative">
            {/* Main image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <LazyImage
                src="/images/Mandir-image.png"
                alt="Triveni Bhavan Temple and Mandir"
                className="w-full h-72 sm:h-80 lg:h-[480px] rounded-2xl"
              />
            </motion.div>

            {/* Secondary overlapping image */}
            <motion.div
              initial={{ opacity: 0, scale: 1.04 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute -bottom-6 -right-4 sm:right-0 lg:-right-8 w-36 sm:w-44 lg:w-52 h-40 sm:h-48 lg:h-56 rounded-xl overflow-hidden shadow-xl border-4 border-ivory"
            >
              <LazyImage
                src="/images/triveni-bhavan-night.png"
                alt="Triveni Bhavan venue at night"
                className="w-full h-full"
              />
            </motion.div>
          </div>

          {/* Text - Right */}
          <div className="lg:pl-8 mt-8 lg:mt-0">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-gold-antique mb-3"
            >
              Heritage & Spiritual Setting
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-dark tracking-tight leading-tight"
            >
              Tradition at the Heart of Every Celebration
            </motion.h2>

            {/* Gold decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="origin-left mt-5 mb-6 w-16 h-0.5 bg-gold-antique/60"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-base sm:text-lg text-dark/60 leading-relaxed mb-4"
            >
              Alongside its celebration spaces, Triveni Bhavan offers a
              distinctive traditional and spiritual setting that adds character
              to special occasions.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-base sm:text-lg text-dark/60 leading-relaxed mb-7"
            >
              The temple and surrounding heritage elements create a setting
              where celebrations can remain connected to tradition.
            </motion.p>

            {/* Labels */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-wrap gap-2.5 mb-8"
            >
              {labels.map((label) => (
                <span
                  key={label}
                  className="px-4 py-1.5 text-xs font-medium text-maroon border border-maroon/15 rounded-full bg-maroon/5"
                >
                  {label}
                </span>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.a
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              href="#venue"
              className="group inline-flex items-center gap-2.5 bg-maroon px-7 py-3.5 text-sm font-semibold text-ivory rounded-md tracking-wide transition-all duration-300 hover:bg-maroon-dark hover:shadow-lg hover:-translate-y-0.5"
            >
              Discover Our Venue
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  )
}
