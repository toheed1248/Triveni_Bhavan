import { motion } from 'framer-motion'
import {
  Landmark,
  TreePine,
  Church,
  Snowflake,
  Car,
  Volume2,
  Palette,
  UtensilsCrossed,
} from 'lucide-react'

const facilities = [
  {
    icon: Landmark,
    title: 'Open Hall',
    description: 'Spacious open hall for grand celebrations and large gatherings.',
  },
  {
    icon: Snowflake,
    title: 'Closed / Banquet Hall',
    description: 'Air-conditioned banquet hall for intimate and elegant events.',
  },
  {
    icon: Church,
    title: 'Temple / Mandir',
    description: 'Sacred temple space for spiritual ceremonies and rituals.',
  },
  {
    icon: Snowflake,
    title: '10+ AC Rooms',
    description: 'Comfortable air-conditioned rooms with ducting for guests.',
  },
  {
    icon: Car,
    title: 'Parking Facility',
    description: 'Ample parking space for guests and event vehicles.',
  },
  {
    icon: Volume2,
    title: 'Sound Facility',
    description: 'Professional sound system for events and celebrations.',
  },
  {
    icon: Palette,
    title: 'Decoration Facility',
    description: 'Expert decoration services to transform your event.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Catering Facility',
    description: 'Premium catering services with customizable menus.',
  },
]

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
}

export default function Facilities() {
  return (
    <section className="relative bg-ivory py-20 sm:py-24 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-14 sm:mb-16">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-gold-antique mb-3">
            Our Venue
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-dark tracking-tight">
            World-Class Facilities
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-dark/60 leading-relaxed">
            Everything you need for a perfect celebration, all under one roof.
          </p>
        </div>

        {/* Facilities Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
        >
          {facilities.map((facility) => {
            const Icon = facility.icon
            return (
              <motion.div
                key={facility.title}
                variants={item}
                className="group relative bg-white rounded-xl p-6 sm:p-7 border border-dark/5 hover:border-gold-antique/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="mb-4 w-12 h-12 rounded-lg bg-maroon/5 group-hover:bg-gold-antique/10 flex items-center justify-center transition-colors duration-300">
                  <Icon
                    size={22}
                    className="text-maroon group-hover:text-gold-antique transition-colors duration-300"
                  />
                </div>
                <h3 className="font-heading text-lg font-semibold text-dark mb-2">
                  {facility.title}
                </h3>
                <p className="text-sm text-dark/60 leading-relaxed">
                  {facility.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
