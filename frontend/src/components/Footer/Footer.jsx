import { ArrowRight, Instagram, Facebook, Youtube } from 'lucide-react'
import { useBusinessSettings } from '../../contexts/BusinessSettingsContext'

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Venue', href: '#venue' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#enquire' },
]

const venueLinks = [
  { label: 'Open Hall', href: '#venue' },
  { label: 'Closed / Banquet Hall', href: '#venue' },
  { label: 'Temple / Mandir', href: '#venue' },
  { label: 'Rooms', href: '#venue' },
  { label: 'Facilities', href: '#venue' },
]

const socialIconMap = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
}

const legacyDetails = [
  {
    label: 'भवन निर्माता',
    value: 'श्रीमती उषा किरण विनोद देवड़ा',
  },
  {
    label: 'पुण्य स्मृति',
    value: 'स्व. मातुश्री त्रिवेणी देवी देवड़ा एवं स्व. पिताश्री शुभकरण जी देवड़ा',
  },
  {
    label: 'वास्तु विद्',
    value: 'श्री धरनीधर शर्मा',
  },
  {
    label: 'लोकार्पण',
    value: 'शनिवार, 22 जनवरी 2005',
  },
  {
    label: 'संचालक',
    value: 'त्रिवेणीदेवी देवड़ा चैरिटेबल ट्रस्ट',
  },
]

export default function Footer() {
  const { settings } = useBusinessSettings()

  const contact = settings?.contact || {}
  const socialLinks = settings?.socialLinks || {}
  const businessName = settings?.businessName || 'Triveni Bhavan'
  const tagline = settings?.tagline || 'Where Traditions Meet Celebration'
  const description = settings?.description || 'A distinctive setting for weddings, celebrations and meaningful gatherings, carrying forward a legacy of tradition and togetherness.'

  const activeSocials = Object.entries(socialLinks)
    .filter(([, url]) => url)
    .map(([platform, url]) => ({
      label: platform.charAt(0).toUpperCase() + platform.slice(1),
      href: url,
      icon: socialIconMap[platform.toLowerCase()] || null,
    }))
    .filter((s) => s.icon)

  return (
    <footer className="bg-[#241015] text-ivory">

      {/* =====================================================
          LEGACY / TRUST SECTION
      ===================================================== */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-14 sm:py-16">

          <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.6fr] gap-10 lg:gap-16">

            {/* Intro */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-10 bg-[#C6A15B]" />

                <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#C6A15B] font-semibold">
                  Our Legacy
                </span>
              </div>

              <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-medium leading-tight text-white">
                A legacy built on
                <span className="block text-[#D8B76A] italic">
                  tradition &amp; values.
                </span>
              </h3>

              <p className="mt-5 max-w-md text-sm leading-7 text-white/50">
                Triveni Bhavan carries forward a family legacy rooted in
                tradition, remembrance and community. The Bhavan was
                inaugurated in 2005 and continues to serve as a place for
                celebrations, ceremonies and meaningful gatherings.
              </p>

              <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-[#C6A15B]/20 bg-[#C6A15B]/5 px-4 py-2.5">
                <span className="h-2 w-2 rounded-full bg-[#C6A15B]" />
                <span className="text-xs tracking-wide text-[#D8B76A]">
                  Established &amp; Inaugurated — 22 January 2005
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] overflow-hidden">

              <div className="px-5 sm:px-7 py-5 border-b border-white/10">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#C6A15B] font-semibold">
                  Triveni Bhavan
                </p>

                <h4 className="mt-1 text-lg sm:text-xl font-heading text-white">
                  Legacy &amp; Trust Details
                </h4>
              </div>

              <div className="divide-y divide-white/[0.07]">
                {legacyDetails.map((item, index) => (
                  <div
                    key={item.label}
                    className="grid grid-cols-1 sm:grid-cols-[145px_1fr] gap-2 sm:gap-6 px-5 sm:px-7 py-4.5 hover:bg-white/[0.025] transition-colors"
                  >
                    <div className="text-xs font-semibold text-[#C6A15B]">
                      {item.label}
                    </div>

                    <div className="text-sm leading-6 text-white/65">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN FOOTER
      ===================================================== */}
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 pt-14 sm:pt-18 pb-8">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">

            <a
              href="#home"
              className="inline-flex items-center gap-3 mb-5"
            >
              <div className="w-11 h-11 rounded-full border border-[#C6A15B]/30 p-0.5">
                <img
                  src="/images/Logo.png"
                  alt={`${businessName} Logo`}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>

              <span className="font-heading text-base font-semibold tracking-[0.12em] uppercase text-white">
                {businessName}
              </span>
            </a>

            <p className="text-sm text-[#D8B76A] leading-relaxed mb-2">
              {tagline}
            </p>

            <p className="text-sm text-white/40 leading-7 max-w-xs">
              {description}
            </p>

            {/* Location */}
            {contact.address && (
              <div className="mt-5">
                {contact.googleMapsUrl ? (
                  <a
                    href={contact.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/40 hover:text-[#D8B76A] transition-colors leading-6"
                  >
                    {contact.address}
                  </a>
                ) : (
                  <p className="text-sm text-white/40 leading-6">
                    {contact.address}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-[#D8B76A] mb-5">
              Quick Links
            </h4>

            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-white/45 hover:text-[#D8B76A] transition-colors duration-200"
                  >
                    <span>{link.label}</span>

                    <ArrowRight
                      size={11}
                      className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Venue */}
          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-[#D8B76A] mb-5">
              Venue
            </h4>

            <ul className="space-y-3">
              {venueLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-white/45 hover:text-[#D8B76A] transition-colors duration-200"
                  >
                    <span>{link.label}</span>

                    <ArrowRight
                      size={11}
                      className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Plan Your Event */}
          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-[#D8B76A] mb-5">
              Plan Your Event
            </h4>

            <p className="text-sm text-white/45 leading-7 mb-5">
              Have an event in mind? Check availability or send us your
              requirements.
            </p>

            <div className="flex flex-col gap-2.5">

              <a
                href="#availability"
                className="group inline-flex items-center justify-between gap-3 bg-[#C6A15B]/10 border border-[#C6A15B]/20 px-5 py-3 text-xs font-semibold text-white rounded-xl hover:bg-[#C6A15B]/20 hover:border-[#C6A15B]/35 transition-all"
              >
                Check Availability

                <ArrowRight
                  size={13}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </a>

              <a
                href="#enquire"
                className="group inline-flex items-center justify-between gap-3 border border-white/10 px-5 py-3 text-xs font-semibold text-white/65 rounded-xl hover:border-white/25 hover:text-white transition-all"
              >
                Request Pricing

                <ArrowRight
                  size={13}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </a>

            </div>

            {/* Contact */}
            {(contact.phone || contact.email) && (
              <div className="mt-6 space-y-2.5">

                {contact.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="block text-sm text-white/45 hover:text-[#D8B76A] transition-colors"
                  >
                    {contact.phone}
                  </a>
                )}

                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="block text-sm text-white/45 hover:text-[#D8B76A] transition-colors break-all"
                  >
                    {contact.email}
                  </a>
                )}

              </div>
            )}
          </div>
        </div>

        {/* =====================================================
            BOTTOM
        ===================================================== */}
        <div className="border-t border-white/10 pt-7 flex flex-col sm:flex-row items-center justify-between gap-5">

          {/* Social */}
          <div className="flex items-center gap-2.5">
            {activeSocials.map((social) => {
              const Icon = social.icon

              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-[#D8B76A] hover:border-[#C6A15B]/40 hover:bg-[#C6A15B]/5 transition-all"
                >
                  <Icon size={15} />
                </a>
              )
            })}
          </div>

          {/* Copyright */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-white/25">

            <span>
              © 2026 {businessName}. All rights reserved.
            </span>

            <span className="text-white/40">
              Privacy Policy
            </span>

            <span className="text-white/40">
              Terms &amp; Conditions
            </span>

          </div>

        </div>

      </div>
    </footer>
  )
}