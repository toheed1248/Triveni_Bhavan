import { useState } from 'react'
import {
  Send,
  CheckCircle,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
} from 'lucide-react'

const eventTypes = [
  'Wedding',
  'Reception',
  'Family Celebration',
  'Religious Event',
  'Corporate Event',
  'Other',
]

const venuePreferences = [
  'Open Hall',
  'Closed / Banquet Hall',
  'Temple / Mandir',
  'No Preference',
]

const facilityOptions = [
  'Open Hall',
  'Closed / Banquet Hall',
  'Rooms',
  'Parking',
]

export default function EnquiryForm() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    eventType: '',
    bookingFrom: '',
    bookingTo: '',
    guestCount: '',
    venuePreference: '',
    facilities: [],
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => {
      const next = { ...prev, [name]: value }

      if (name === 'bookingFrom' && prev.bookingTo && value && value > prev.bookingTo) {
        next.bookingTo = ''
      }

      return next
    })

    if (errorMessage) setErrorMessage('')
  }

  const handleFacilityToggle = (facility) => {
    setForm((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (form.bookingTo && form.bookingFrom && form.bookingTo < form.bookingFrom) {
      setErrorMessage('Booking end date cannot be before the start date.')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          eventType: form.eventType,
          bookingFrom: form.bookingFrom,
          bookingTo: form.bookingTo,
          guestCount: form.guestCount ? Number(form.guestCount) : undefined,
          preferredVenue: form.venuePreference,
          requiredFacilities: form.facilities,
          message: form.message,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setSubmitted(true)
      } else {
        setErrorMessage(data.message || 'Something went wrong. Please try again.')
      }
    } catch {
      setErrorMessage('Unable to connect to the server. Please try again later.')
    } finally {
      setSubmitting(false)
    }
  }

  const todayStr = new Date().toISOString().split('T')[0]

  /* =========================================================
     SUCCESS
  ========================================================== */

  if (submitted) {
    return (
      <section
        id="enquire"
        className="relative overflow-hidden bg-[#F7F3ED] py-20 sm:py-24 lg:py-28"
      >
        <div className="mx-auto max-w-2xl px-5 text-center sm:px-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#C6A15B]/10">
            <CheckCircle
              size={42}
              className="text-[#8E6F35]"
            />
          </div>

          <h2 className="mt-7 font-serif text-4xl text-[#211B19] sm:text-5xl">
            Thank You!
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#211B19]/55 sm:text-base">
            Your enquiry has been received. Our team will
            contact you shortly to discuss your event.
          </p>

          <button
            onClick={() => {
              setSubmitted(false)

              setForm({
                name: '',
                phone: '',
                email: '',
                eventType: '',
                bookingFrom: '',
                bookingTo: '',
                guestCount: '',
                venuePreference: '',
                facilities: [],
                message: '',
              })
            }}
            className="
              mt-8
              inline-flex items-center gap-2
              rounded-full
              bg-[#42151F]
              px-6 py-3
              text-sm font-semibold
              text-white
              transition
              hover:bg-[#5A1E2B]
            "
          >
            Submit Another Enquiry
            <ArrowUpRight size={15} />
          </button>
        </div>
      </section>
    )
  }

  return (
    <section
      id="enquire"
      className="
        relative overflow-hidden
        bg-[#F7F3ED]
        py-20 sm:py-24 lg:py-32
      "
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#C6A15B]/8 blur-[110px]" />

        <div className="absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-[#42151F]/5 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mx-auto mb-14 max-w-3xl text-center sm:mb-16">

          <div
            className="
              mb-5 inline-flex items-center gap-2
              rounded-full
              border border-[#C6A15B]/25
              bg-white/60
              px-4 py-2
              text-[10px] font-semibold
              uppercase tracking-[0.22em]
              text-[#8E6F35]
              backdrop-blur-md
            "
          >
            <Mail size={13} />
            Get In Touch
          </div>

          <h2
            className="
              font-serif
              text-4xl
              leading-[1.05]
              tracking-tight
              text-[#211B19]
              sm:text-5xl
              lg:text-6xl
            "
          >
            Let's plan your
            <span className="block text-[#8E6F35]">
              special day.
            </span>
          </h2>

          <p
            className="
              mx-auto mt-6 max-w-2xl
              text-sm leading-7
              text-[#211B19]/55
              sm:text-base
            "
          >
            Tell us about your event and our team will
            get back to you with pricing and availability.
          </p>
        </div>

        {/* =====================================================
            FORM + MAP
        ====================================================== */}

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">

          {/* ===================================================
              FORM
          ================================================== */}

          <form
            onSubmit={handleSubmit}
            className="
              rounded-[2rem]
              border border-[#211B19]/8
              bg-white
              p-5
              shadow-[0_25px_70px_rgba(33,27,25,0.07)]
              sm:p-7
              lg:p-9
            "
          >

            {/* Form heading */}

            <div className="mb-8">

              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8E6F35]">
                Event Details
              </p>

              <h3 className="mt-2 font-serif text-2xl text-[#211B19] sm:text-3xl">
                Request Pricing
              </h3>

            </div>

            {/* Error message */}

            {errorMessage && (
              <div
                className="
                  mb-6 flex items-start gap-3
                  rounded-xl
                  border border-red-200
                  bg-red-50
                  px-4 py-3
                "
              >
                <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">

              {/* Name */}

              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#211B19]/55">
                  Full Name
                  <span className="ml-1 text-[#8E6F35]">*</span>
                </label>

                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="
                    h-13 w-full
                    rounded-xl
                    border border-[#211B19]/10
                    bg-[#F7F3ED]/50
                    px-4
                    text-sm text-[#211B19]
                    outline-none
                    transition
                    placeholder:text-[#211B19]/30
                    hover:border-[#C6A15B]/40
                    focus:border-[#C6A15B]
                    focus:ring-4
                    focus:ring-[#C6A15B]/10
                  "
                />
              </div>

              {/* Phone */}

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#211B19]/55">
                  Phone Number
                  <span className="ml-1 text-[#8E6F35]">*</span>
                </label>

                <input
                  type="tel"
                  name="phone"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  className="
                    h-13 w-full
                    rounded-xl
                    border border-[#211B19]/10
                    bg-[#F7F3ED]/50
                    px-4
                    text-sm text-[#211B19]
                    outline-none
                    transition
                    placeholder:text-[#211B19]/30
                    hover:border-[#C6A15B]/40
                    focus:border-[#C6A15B]
                    focus:ring-4
                    focus:ring-[#C6A15B]/10
                  "
                />
              </div>

              {/* Email */}

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#211B19]/55">
                  Email
                  <span className="ml-1 text-[9px] normal-case tracking-normal text-[#211B19]/30">
                    Optional
                  </span>
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="
                    h-13 w-full
                    rounded-xl
                    border border-[#211B19]/10
                    bg-[#F7F3ED]/50
                    px-4
                    text-sm text-[#211B19]
                    outline-none
                    transition
                    placeholder:text-[#211B19]/30
                    hover:border-[#C6A15B]/40
                    focus:border-[#C6A15B]
                    focus:ring-4
                    focus:ring-[#C6A15B]/10
                  "
                />
              </div>

              {/* Event Type */}

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#211B19]/55">
                  Event Type
                  <span className="ml-1 text-[#8E6F35]">*</span>
                </label>

                <select
                  name="eventType"
                  required
                  value={form.eventType}
                  onChange={handleChange}
                  className="
                    h-13 w-full
                    appearance-none
                    rounded-xl
                    border border-[#211B19]/10
                    bg-[#F7F3ED]/50
                    px-4
                    text-sm text-[#211B19]
                    outline-none
                    transition
                    hover:border-[#C6A15B]/40
                    focus:border-[#C6A15B]
                    focus:ring-4
                    focus:ring-[#C6A15B]/10
                  "
                >
                  <option value="">
                    Select event type
                  </option>

                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Booking From */}

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#211B19]/55">
                  Booking From
                  <span className="ml-1 text-[#8E6F35]">*</span>
                </label>

                <input
                  type="date"
                  name="bookingFrom"
                  required
                  min={todayStr}
                  value={form.bookingFrom}
                  onChange={handleChange}
                  className="
                    h-13 w-full
                    rounded-xl
                    border border-[#211B19]/10
                    bg-[#F7F3ED]/50
                    px-4
                    text-sm text-[#211B19]
                    outline-none
                    transition
                    [color-scheme:light]
                    hover:border-[#C6A15B]/40
                    focus:border-[#C6A15B]
                    focus:ring-4
                    focus:ring-[#C6A15B]/10
                  "
                />
              </div>

              {/* Booking To */}

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#211B19]/55">
                  Booking To
                  <span className="ml-1 text-[#8E6F35]">*</span>
                </label>

                <input
                  type="date"
                  name="bookingTo"
                  required
                  min={form.bookingFrom || todayStr}
                  value={form.bookingTo}
                  onChange={handleChange}
                  className="
                    h-13 w-full
                    rounded-xl
                    border border-[#211B19]/10
                    bg-[#F7F3ED]/50
                    px-4
                    text-sm text-[#211B19]
                    outline-none
                    transition
                    [color-scheme:light]
                    hover:border-[#C6A15B]/40
                    focus:border-[#C6A15B]
                    focus:ring-4
                    focus:ring-[#C6A15B]/10
                  "
                />
              </div>

              {/* Guest Count */}

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#211B19]/55">
                  Approximate Guest Count
                </label>

                <input
                  type="number"
                  name="guestCount"
                  min="1"
                  value={form.guestCount}
                  onChange={handleChange}
                  placeholder="e.g. 200"
                  className="
                    h-13 w-full
                    rounded-xl
                    border border-[#211B19]/10
                    bg-[#F7F3ED]/50
                    px-4
                    text-sm text-[#211B19]
                    outline-none
                    transition
                    placeholder:text-[#211B19]/30
                    hover:border-[#C6A15B]/40
                    focus:border-[#C6A15B]
                    focus:ring-4
                    focus:ring-[#C6A15B]/10
                  "
                />
              </div>

              {/* Venue */}

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#211B19]/55">
                  Venue Preference
                </label>

                <select
                  name="venuePreference"
                  value={form.venuePreference}
                  onChange={handleChange}
                  className="
                    h-13 w-full
                    appearance-none
                    rounded-xl
                    border border-[#211B19]/10
                    bg-[#F7F3ED]/50
                    px-4
                    text-sm text-[#211B19]
                    outline-none
                    transition
                    hover:border-[#C6A15B]/40
                    focus:border-[#C6A15B]
                    focus:ring-4
                    focus:ring-[#C6A15B]/10
                  "
                >
                  <option value="">
                    Select venue preference
                  </option>

                  {venuePreferences.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              {/* Facilities */}

              <div className="sm:col-span-2">

                <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.12em] text-[#211B19]/55">
                  Required Facilities
                </label>

                <div className="flex flex-wrap gap-2">

                  {facilityOptions.map((facility) => {
                    const selected =
                      form.facilities.includes(facility)

                    return (
                      <button
                        key={facility}
                        type="button"
                        onClick={() =>
                          handleFacilityToggle(facility)
                        }
                        className={`
                          rounded-full
                          border
                          px-4 py-2
                          text-xs font-medium
                          transition-all duration-200
                          ${
                            selected
                              ? 'border-[#C6A15B] bg-[#C6A15B] text-[#211B19] shadow-sm'
                              : 'border-[#211B19]/10 bg-[#F7F3ED]/40 text-[#211B19]/55 hover:border-[#C6A15B]/50 hover:text-[#211B19]'
                          }
                        `}
                      >
                        {facility}
                      </button>
                    )
                  })}

                </div>
              </div>

              {/* Message */}

              <div className="sm:col-span-2">

                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#211B19]/55">
                  Additional Message
                </label>

                <textarea
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your event..."
                  className="
                    w-full
                    resize-none
                    rounded-xl
                    border border-[#211B19]/10
                    bg-[#F7F3ED]/50
                    px-4 py-3
                    text-sm text-[#211B19]
                    outline-none
                    transition
                    placeholder:text-[#211B19]/30
                    hover:border-[#C6A15B]/40
                    focus:border-[#C6A15B]
                    focus:ring-4
                    focus:ring-[#C6A15B]/10
                  "
                />

              </div>
            </div>

            {/* Submit */}

            <div className="mt-7">

              <button
                type="submit"
                disabled={submitting}
                className="
                  group
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  gap-2.5
                  rounded-xl
                  bg-[#42151F]
                  px-7 py-4
                  text-sm font-semibold
                  text-white
                  shadow-[0_10px_30px_rgba(66,21,31,0.12)]
                  transition-all duration-300
                  hover:bg-[#5A1E2B]
                  hover:shadow-[0_15px_40px_rgba(66,21,31,0.18)]
                  active:scale-[0.99]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  sm:w-auto
                "
              >
                {submitting
                  ? 'Submitting...'
                  : 'Submit Enquiry'}

                {!submitting && (
                  <Send
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                )}
              </button>

            </div>
          </form>

          {/* ===================================================
              MAP
          ================================================== */}

          <div
            className="
              relative
              min-h-[420px]
              overflow-hidden
              rounded-[2rem]
              border border-[#211B19]/10
              bg-[#211B19]
              shadow-[0_25px_70px_rgba(33,27,25,0.1)]
              lg:min-h-0
            "
          >

            {/* Map */}

            <iframe
              src="https://www.google.com/maps/embed?pb=!4v1789832884176!6m8!1m7!1skIIySh0J9wwzPsCg9U7X-A!2m2!1d28.00434124422664!2d74.95583697706087!3f282.87982!4f0!5f0.7820865974627469"
              width="600"
              height="450"
              style={{
                border: 0,
              }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              className="
                absolute inset-0
                h-full w-full
                border-0
                grayscale-[15%]
                transition-all duration-700
                hover:grayscale-0
              "
            />

            {/* Map label */}

            <div
              className="
                pointer-events-none
                absolute left-4 top-4
                sm:left-5 sm:top-5
              "
            >
              <div
                className="
                  flex items-center gap-3
                  rounded-2xl
                  border border-white/15
                  bg-[#211B19]/75
                  px-4 py-3
                  text-white
                  shadow-lg
                  backdrop-blur-xl
                "
              >
                <div
                  className="
                    flex h-9 w-9
                    items-center justify-center
                    rounded-xl
                    bg-[#E4C77E]
                    text-[#42151F]
                  "
                >
                  <MapPin size={17} />
                </div>

                <div>
                  <p className="text-xs font-semibold">
                    Triveni Bhavan
                  </p>

                  <p className="mt-0.5 text-[10px] text-white/50">
                    Find us on the map
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom contact panel */}

            <div
              className="
                absolute bottom-4 left-4 right-4
                sm:bottom-5 sm:left-5 sm:right-5
              "
            >
              <div
                className="
                  rounded-2xl
                  border border-white/10
                  bg-[#211B19]/80
                  p-4
                  backdrop-blur-xl
                "
              >

                <div className="flex items-center gap-3">

                  <div
                    className="
                      flex h-9 w-9
                      items-center justify-center
                      rounded-xl
                      bg-white/10
                      text-[#E4C77E]
                    "
                  >
                    <MapPin size={16} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white">
                      Triveni Bhavan
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-white/45">
                      View our location and surroundings
                    </p>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            CONTACT STRIP
        ====================================================== */}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">

          <div
            className="
              flex items-center gap-4
              rounded-2xl
              border border-[#211B19]/8
              bg-white
              p-5
            "
          >
            <div
              className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-xl
                bg-[#F7F3ED]
                text-[#8E6F35]
              "
            >
              <Phone size={17} />
            </div>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#211B19]/35">
                Call Us
              </p>

              <p className="mt-1 text-sm font-semibold text-[#211B19]">
                Discuss your event with us
              </p>
            </div>
          </div>

          <div
            className="
              flex items-center gap-4
              rounded-2xl
              border border-[#211B19]/8
              bg-white
              p-5
            "
          >
            <div
              className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-xl
                bg-[#F7F3ED]
                text-[#8E6F35]
              "
            >
              <Mail size={17} />
            </div>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#211B19]/35">
                Enquiries
              </p>

              <p className="mt-1 text-sm font-semibold text-[#211B19]">
                We will get back to you shortly
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
