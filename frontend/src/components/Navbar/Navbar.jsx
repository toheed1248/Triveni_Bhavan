import { useState, useEffect } from 'react'
import { Menu, X, ArrowUpRight, CalendarCheck } from 'lucide-react'
import { useBusinessSettings } from '../../contexts/BusinessSettingsContext'

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'Venue', href: '#venue' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#enquire' },
]

const scrollToSection = (href, closeMenu) => {
  const id = href.replace('#', '')
  const target = document.getElementById(id)

  closeMenu?.()

  if (target) {
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  } else {
    window.location.hash = id
  }
}

/* --------------------------------
   DESKTOP NAV
--------------------------------- */

function DesktopNav({ isScrolled }) {
  return (
    <nav
      className={`hidden lg:flex items-center absolute left-1/2 -translate-x-1/2
      rounded-full px-2 py-1.5 transition-all duration-500
      ${
        isScrolled
          ? 'bg-white/[0.07] border border-white/10 backdrop-blur-xl shadow-lg'
          : 'bg-white/[0.05] border border-white/[0.08] backdrop-blur-md'
      }`}
      aria-label="Main navigation"
    >
      <ul className="flex items-center gap-0.5">
        {NAV_ITEMS.map((item) => (
          <li key={item.label}>
            <button
              type="button"
              onClick={() => scrollToSection(item.href)}
              className="
                group relative px-4 xl:px-5 py-2.5
                text-[13px] xl:text-[14px]
                font-medium text-white/75
                rounded-full
                transition-all duration-300
                hover:text-white
              "
            >
              <span className="relative z-10">
                {item.label}
              </span>

              <span
                className="
                  absolute inset-0 rounded-full
                  bg-white/[0.08]
                  scale-75 opacity-0
                  transition-all duration-300
                  group-hover:scale-100
                  group-hover:opacity-100
                "
              />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/* --------------------------------
   MOBILE NAV
--------------------------------- */

function MobileNav({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div
      className="
        lg:hidden absolute
        top-[calc(100%+10px)]
        left-3 right-3
        rounded-3xl
        overflow-hidden
        bg-[#211B19]/95
        backdrop-blur-2xl
        border border-white/10
        shadow-[0_20px_70px_rgba(0,0,0,0.45)]
        animate-in fade-in slide-in-from-top-3
        duration-300
      "
    >
      <nav className="p-3" aria-label="Mobile navigation">

        {/* Mobile navigation links */}

        <div className="space-y-1">
          {NAV_ITEMS.map((item, index) => (
            <button
              key={item.label}
              type="button"
              onClick={() => scrollToSection(item.href, onClose)}
              className="
                group
                w-full
                flex items-center justify-between
                px-4 py-3.5
                rounded-2xl
                text-left
                text-white/80
                hover:text-white
                hover:bg-white/[0.07]
                transition-all duration-300
              "
            >
              <div className="flex items-center gap-3">

                <span className="text-[10px] text-[#C6A15B]/60 font-medium w-4">
                  0{index + 1}
                </span>

                <span className="text-[15px] font-medium">
                  {item.label}
                </span>

              </div>

              <ArrowUpRight
                size={16}
                className="
                  text-white/25
                  group-hover:text-[#C6A15B]
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                  transition-all
                "
              />
            </button>
          ))}
        </div>

        {/* Divider */}

        <div className="my-3 h-px bg-white/[0.08]" />

        {/* Check Availability */}

        <button
          type="button"
          onClick={() => scrollToSection('#availability', onClose)}
          className="
            w-full
            flex items-center justify-between
            px-5 py-4
            rounded-2xl
            border border-white/15
            bg-white/[0.06]
            text-white
            font-medium
            text-sm
            hover:bg-white/[0.12]
            hover:border-[#C6A15B]/40
            transition-all duration-300
          "
        >
          <div className="flex items-center gap-3">
            <CalendarCheck size={17} className="text-[#C6A15B]" />
            <span>Check Availability</span>
          </div>

          <span className="
            flex items-center justify-center
            w-8 h-8
            rounded-full
            bg-white/[0.08]
          ">
            <ArrowUpRight size={16} />
          </span>
        </button>

        {/* CTA */}

        <button
          type="button"
          onClick={() => scrollToSection('#enquire', onClose)}
          className="
            mt-2
            w-full
            flex items-center justify-between
            px-5 py-4
            rounded-2xl
            bg-[#C6A15B]
            text-[#211B19]
            font-semibold
            text-sm
            hover:bg-[#D5B76F]
            transition-all duration-300
          "
        >
          <span>Enquire Now</span>

          <span className="
            flex items-center justify-center
            w-8 h-8
            rounded-full
            bg-[#211B19]/10
          ">
            <ArrowUpRight size={16} />
          </span>
        </button>
      </nav>
    </div>
  )
}

/* --------------------------------
   MAIN NAVBAR
--------------------------------- */

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { settings } = useBusinessSettings()

  const businessName = settings?.businessName || 'Triveni Bhavan'
  const tagline = settings?.tagline || 'Celebrate • Connect • Create'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <header className="fixed top-0 left-0 right-0 z-[10000] pointer-events-none">

      <div className="mx-auto max-w-[1500px] px-3 sm:px-5 lg:px-8 pt-3 sm:pt-4">

        <div
          className={`
            pointer-events-auto
            relative
            h-[58px] sm:h-[64px] lg:h-[72px]
            px-3 sm:px-4 lg:px-5
            flex items-center justify-between
            rounded-2xl lg:rounded-[22px]
            transition-all duration-500

            ${
              isScrolled
                ? `
                  bg-[#211B19]/85
                  backdrop-blur-2xl
                  border border-white/[0.10]
                  shadow-[0_10px_40px_rgba(0,0,0,0.25)]
                `
                : `
                  bg-[#211B19]/55
                  backdrop-blur-xl
                  border border-white/[0.08]
                `
            }
          `}
        >

          {/* --------------------------------
              LOGO
          --------------------------------- */}

          <button
            type="button"
            onClick={() =>
              scrollToSection('#home', () => setMobileOpen(false))
            }
            className="
              group
              flex items-center gap-2.5 sm:gap-3
              shrink-0
            "
            aria-label="Go to home"
          >

            <div
              className="
                relative
                w-9 h-9
                sm:w-10 sm:h-10
                rounded-full
                overflow-hidden
                ring-1 ring-white/10
                group-hover:ring-[#C6A15B]/50
                transition-all duration-300
              "
            >
              <img
                src="/images/Logo.png"
                alt="Triveni Bhavan Logo"
                className="
                  w-full h-full
                  object-cover
                  group-hover:scale-105
                  transition-transform duration-500
                "
              />
            </div>

            <div className="flex flex-col text-left">

              <span
                className="
                  font-heading
                  text-[12px] sm:text-[14px] lg:text-[15px]
                  font-semibold
                  tracking-[0.12em]
                  uppercase
                  text-white
                  leading-none
                "
              >
                {businessName}
              </span>

              <span
                className="
                  hidden sm:block
                  mt-1
                  text-[8px] lg:text-[9px]
                  tracking-[0.25em]
                  uppercase
                  text-white/40
                "
              >
                {tagline}
              </span>

            </div>

          </button>

          {/* --------------------------------
              DESKTOP NAV
          --------------------------------- */}

          <DesktopNav isScrolled={isScrolled} />

          {/* --------------------------------
              DESKTOP CTA
          --------------------------------- */}

          <div className="hidden lg:flex items-center gap-2">

            <button
              type="button"
              onClick={() => scrollToSection('#availability')}
              className="
                group
                flex items-center gap-2
                px-4 xl:px-5
                py-2.5
                rounded-full
                border border-white/15
                bg-white/[0.06]
                text-white
                text-[13px]
                font-medium
                backdrop-blur-md
                transition-all duration-300
                hover:bg-white/[0.12]
                hover:border-[#C6A15B]/40
                hover:text-[#C6A15B]
              "
            >
              <CalendarCheck size={15} />
              <span>Check Availability</span>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('#enquire')}
              className="
                group
                flex items-center gap-2
                px-4 xl:px-5
                py-2.5
                rounded-full
                bg-[#C6A15B]
                text-[#211B19]
                text-[13px]
                font-semibold
                transition-all duration-300
                hover:bg-[#D5B76F]
                hover:shadow-[0_8px_30px_rgba(198,161,91,0.22)]
              "
            >
              <span>Enquire Now</span>

              <span
                className="
                  flex items-center justify-center
                  w-6 h-6
                  rounded-full
                  bg-[#211B19]/10
                  group-hover:translate-x-0.5
                  transition-transform
                "
              >
                <ArrowUpRight size={14} />
              </span>
            </button>

          </div>

          {/* --------------------------------
              MOBILE MENU BUTTON
          --------------------------------- */}

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="
              lg:hidden
              flex items-center justify-center
              w-10 h-10
              rounded-xl
              bg-white/[0.06]
              border border-white/[0.08]
              text-white
              hover:bg-white/[0.10]
              hover:text-[#C6A15B]
              active:scale-95
              transition-all duration-200
            "
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <div
              className={`
                transition-transform duration-300
                ${mobileOpen ? 'rotate-90' : ''}
              `}
            >
              {mobileOpen ? (
                <X size={21} strokeWidth={1.8} />
              ) : (
                <Menu size={21} strokeWidth={1.8} />
              )}
            </div>
          </button>

          {/* --------------------------------
              MOBILE MENU
          --------------------------------- */}

          <MobileNav
            isOpen={mobileOpen}
            onClose={() => setMobileOpen(false)}
          />

        </div>
      </div>
    </header>
  )
}