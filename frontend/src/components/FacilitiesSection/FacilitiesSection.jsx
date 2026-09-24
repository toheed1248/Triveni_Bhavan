import { motion } from 'framer-motion'
import { ArrowRight, Building2, Warehouse, Landmark, BedDouble, Car, Volume2, Sparkles, UtensilsCrossed, Star } from 'lucide-react'
import { useState } from 'react'
import { useBusinessSettings } from '../../contexts/BusinessSettingsContext'

const facilityIconMap = {
  'Open Hall': Building2,
  'Closed / Banquet Hall': Warehouse,
  'Temple / Mandir': Landmark,
  '10+ AC Rooms with Ducting': BedDouble,
  'Parking': Car,
  'Sound Facility': Volume2,
  'Decoration Facility': Sparkles,
  'Catering Facility': UtensilsCrossed,
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  }),
}

export default function FacilitiesSection() {
  const [roomLoaded, setRoomLoaded] = useState(false)
  const { settings } = useBusinessSettings()

  const facilities = (settings?.facilities || []).map((f) => {
    const name = typeof f === 'string' ? f : (f.title || f.name || '')
    return {
      title: name,
      description: typeof f === 'object' ? (f.description || '') : '',
      icon: facilityIconMap[name] || Star,
    }
  })

  return (
    <section className="relative bg-ivory py-20 sm:py-24 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-gold-antique mb-3">
            Facilities &amp; Services
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-dark tracking-tight leading-tight">
            Everything You Need for Your Celebration
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 text-base sm:text-lg text-dark/60 leading-relaxed">
            From venue spaces and guest accommodation to sound, decoration and catering facilities, Triveni Bhavan brings essential event requirements together in one setting.
          </motion.p>
        </div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-16 sm:mb-20">
          {facilities.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-dark/40 text-base">Facilities information will be available soon.</p>
            </div>
          ) : facilities.map((facility, i) => {
            const Icon = facility.icon
            return (
              <motion.div key={facility.title} custom={i} variants={cardVariants}
                className="group bg-white rounded-[18px] p-6 border border-dark/5 hover:border-gold-antique/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="mb-4 w-11 h-11 rounded-xl bg-maroon/5 group-hover:bg-gold-antique/10 flex items-center justify-center transition-colors duration-300">
                  <Icon size={20} className="text-maroon group-hover:text-gold-antique transition-colors duration-300" />
                </div>
                <h3 className="font-heading text-base font-semibold text-dark mb-1.5">{facility.title}</h3>
                <p className="text-sm text-dark/55 leading-relaxed">{facility.description}</p>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center mb-16 sm:mb-20">
          <div className="relative overflow-hidden rounded-2xl h-64 sm:h-72 lg:h-80">
            <img src="/images/triveni-bhavan-night.png" alt="Triveni Bhavan guest rooms"
              onLoad={() => setRoomLoaded(true)}
              className={`w-full h-full object-cover transition-opacity duration-500 ${roomLoaded ? 'opacity-100' : 'opacity-0'}`} />
            {!roomLoaded && <div className="absolute inset-0 bg-dark/5 animate-pulse" />}
          </div>
          <div className="lg:pl-6">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-gold-antique mb-3">Guest Accommodation</p>
            <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-dark tracking-tight mb-4">Stay Close to the Celebration</h3>
            <p className="text-base sm:text-lg text-dark/60 leading-relaxed mb-7">
              Triveni Bhavan has 10+ air-conditioned rooms with ducting for guest accommodation.
            </p>
            <a href="#availability"
              className="group inline-flex items-center gap-2.5 bg-maroon px-7 py-3.5 text-sm font-semibold text-ivory rounded-md tracking-wide transition-all duration-300 hover:bg-maroon-dark hover:shadow-lg hover:-translate-y-0.5">
              Check Availability
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }} className="text-center">
          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-dark mb-3">Planning Your Event?</h3>
          <p className="text-base text-dark/60 max-w-xl mx-auto mb-8 leading-relaxed">
            Tell us what you are planning and we will help you explore the available spaces and facilities.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a href="#availability"
              className="group inline-flex items-center gap-2.5 bg-maroon px-7 py-3.5 text-sm font-semibold text-ivory rounded-md tracking-wide transition-all duration-300 hover:bg-maroon-dark hover:shadow-lg hover:-translate-y-0.5">
              Check Availability
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a href="#enquire"
              className="group inline-flex items-center gap-2.5 border border-dark/15 px-7 py-3.5 text-sm font-semibold text-dark rounded-md tracking-wide transition-all duration-300 hover:border-gold-antique/40 hover:bg-gold-antique/5">
              Request Pricing
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}