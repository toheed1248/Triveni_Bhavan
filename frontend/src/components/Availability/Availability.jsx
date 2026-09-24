import { useState } from 'react'
import {
  Search,
  CheckCircle2,
  XCircle,
  CalendarDays,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import api from '../../services/api'

export default function Availability() {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const todayStr = new Date().toISOString().split('T')[0]

  const handleCheck = async (e) => {
    e.preventDefault()

    if (dateTo && dateFrom && dateTo < dateFrom) {
      setError('Till date cannot be earlier than from date.')
      return
    }

    setChecking(true)
    setResult(null)
    setError(null)

    try {
      const params = { dateFrom }
      if (dateTo) params.dateTo = dateTo

      const res = await api.get('/availability/date', { params })

      const venues = res.data.venues || []
      const allAvailable = venues.every((v) => v.available)
      const bookedVenues = venues
        .filter((v) => !v.available)
        .map((v) => v.venue)

      const dateLabel = dateTo && dateTo !== dateFrom
        ? `from ${new Date(dateFrom).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} to ${new Date(dateTo).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`
        : `on ${new Date(dateFrom).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`

      setResult({
        available: allAvailable,
        venues,
        bookedVenues,
        message: allAvailable
          ? `All venues are available ${dateLabel}. Submit an enquiry to confirm your booking.`
          : `Booked ${dateLabel}: ${bookedVenues.join(', ')}. Other venues may be available.`,
      })
    } catch {
      setError(
        'Unable to check availability. Please try again.'
      )
    } finally {
      setChecking(false)
    }
  }

  return (
    <section
      id="availability"
      className="
        relative overflow-hidden
        bg-[#42151F]
        py-20 sm:py-24 lg:py-32
      "
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#C6A15B]/10 blur-[120px]" />

        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-black/20 blur-[120px]" />

        <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#E4C77E]/20 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-14 lg:mb-16">

          <div
            className="
              mb-5 inline-flex items-center gap-2
              rounded-full
              border border-[#E4C77E]/20
              bg-white/[0.06]
              px-4 py-2
              text-[10px] font-semibold
              uppercase tracking-[0.22em]
              text-[#E4C77E]
              backdrop-blur-md
            "
          >
            <Sparkles size={13} />
            Plan Your Event
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
            Check availability.
            <span className="block text-[#E4C77E]">
              Choose your dates.
            </span>
          </h2>

          <p
            className="
              mx-auto mt-6 max-w-xl
              text-sm leading-7
              text-white/55
              sm:text-base
            "
          >
            Select your preferred event dates and check
            the current availability of our venue spaces.
          </p>
        </div>

        {/* =====================================================
            DATE CARD
        ====================================================== */}

        <form
          onSubmit={handleCheck}
          className="
            mx-auto max-w-2xl
            rounded-[2rem]
            border border-white/10
            bg-white/[0.07]
            p-5
            shadow-[0_30px_100px_rgba(0,0,0,0.2)]
            backdrop-blur-xl
            sm:p-7
            lg:p-8
          "
        >

          {/* Card header */}

          <div
            className="
              mb-7 flex items-center gap-4
              rounded-2xl
              border border-white/[0.07]
              bg-black/10
              p-4
            "
          >
            <div
              className="
                flex h-11 w-11 shrink-0
                items-center justify-center
                rounded-xl
                bg-[#C6A15B]/15
                text-[#E4C77E]
              "
            >
              <CalendarDays size={20} />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Select your event dates
              </p>

              <p className="mt-1 text-xs text-white/40">
                Availability is checked in real time.
              </p>
            </div>
          </div>

          {/* ===================================================
              DATE INPUTS
          ================================================== */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="event-date-from"
                className="
                  mb-2.5 block
                  text-xs font-semibold
                  uppercase tracking-[0.15em]
                  text-white/60
                "
              >
                From Date
                <span className="ml-1 text-[#E4C77E]">*</span>
              </label>

              <div className="relative">

                <CalendarDays
                  size={18}
                  className="
                    pointer-events-none
                    absolute left-4 top-1/2
                    -translate-y-1/2
                    text-[#C6A15B]
                  "
                />

                <input
                  id="event-date-from"
                  type="date"
                  required
                  value={dateFrom}
                  min={todayStr}
                  onChange={(e) => {
                    const from = e.target.value
                    setDateFrom(from)
                    if (dateTo && dateTo < from) setDateTo('')
                  }}
                  className="
                    h-14 w-full
                    appearance-none
                    rounded-2xl
                    border border-white/10
                    bg-[#211B19]/50
                    pl-12 pr-4
                    text-sm
                    font-medium
                    text-white
                    outline-none
                    transition-all duration-300
                    [color-scheme:dark]
                    placeholder:text-white/30
                    hover:border-[#C6A15B]/30
                    focus:border-[#C6A15B]/60
                    focus:bg-[#211B19]/70
                    focus:ring-4
                    focus:ring-[#C6A15B]/10
                  "
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="event-date-to"
                className="
                  mb-2.5 block
                  text-xs font-semibold
                  uppercase tracking-[0.15em]
                  text-white/60
                "
              >
                Till Date
                <span className="ml-1 text-[#E4C77E]">*</span>
              </label>

              <div className="relative">

                <CalendarDays
                  size={18}
                  className="
                    pointer-events-none
                    absolute left-4 top-1/2
                    -translate-y-1/2
                    text-[#C6A15B]
                  "
                />

                <input
                  id="event-date-to"
                  type="date"
                  required
                  value={dateTo}
                  min={dateFrom || todayStr}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="
                    h-14 w-full
                    appearance-none
                    rounded-2xl
                    border border-white/10
                    bg-[#211B19]/50
                    pl-12 pr-4
                    text-sm
                    font-medium
                    text-white
                    outline-none
                    transition-all duration-300
                    [color-scheme:dark]
                    placeholder:text-white/30
                    hover:border-[#C6A15B]/30
                    focus:border-[#C6A15B]/60
                    focus:bg-[#211B19]/70
                    focus:ring-4
                    focus:ring-[#C6A15B]/10
                  "
                />
              </div>
            </div>
          </div>

          {/* ===================================================
              CHECK BUTTON
          ================================================== */}

          <button
            type="submit"
            disabled={checking}
            className="
              group mt-5
              flex h-14 w-full
              items-center justify-center
              gap-2.5
              rounded-2xl
              bg-[#E4C77E]
              px-6
              text-sm font-bold
              text-[#211B19]
              shadow-[0_10px_30px_rgba(228,199,126,0.12)]
              transition-all duration-300
              hover:bg-white
              hover:shadow-[0_15px_40px_rgba(228,199,126,0.18)]
              active:scale-[0.99]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {checking ? (
              <>
                <span
                  className="
                    h-4 w-4
                    animate-spin
                    rounded-full
                    border-2
                    border-[#211B19]/20
                    border-t-[#211B19]
                  "
                />

                Checking Availability...
              </>
            ) : (
              <>
                Check Availability

                <Search
                  size={17}
                  className="
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                />
              </>
            )}
          </button>

          {/* ===================================================
              ERROR
          ================================================== */}

          {error && (
            <div
              className="
                mt-5
                rounded-2xl
                border border-red-400/15
                bg-red-400/[0.07]
                p-4
              "
            >
              <div className="flex items-start gap-3">

                <XCircle
                  size={18}
                  className="mt-0.5 shrink-0 text-red-300"
                />

                <p className="text-sm leading-6 text-red-200/80">
                  {error}
                </p>

              </div>
            </div>
          )}

          {/* ===================================================
              RESULT
          ================================================== */}

          {result && (
            <div
              className={`
                mt-5
                overflow-hidden
                rounded-2xl
                border
                ${
                  result.available
                    ? 'border-emerald-300/15 bg-emerald-400/[0.06]'
                    : 'border-red-300/15 bg-red-400/[0.06]'
                }
              `}
            >

              {/* Result header */}

              <div className="p-5 sm:p-6">

                <div className="flex items-start gap-4">

                  <div
                    className={`
                      flex h-11 w-11 shrink-0
                      items-center justify-center
                      rounded-xl
                      ${
                        result.available
                          ? 'bg-emerald-400/10 text-emerald-300'
                          : 'bg-red-400/10 text-red-300'
                      }
                    `}
                  >
                    {result.available ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <XCircle size={20} />
                    )}
                  </div>

                  <div className="min-w-0">

                    <p
                      className={`
                        text-base font-semibold
                        ${
                          result.available
                            ? 'text-emerald-200'
                            : 'text-red-200'
                        }
                      `}
                    >
                      {result.available
                        ? 'Venue Available'
                        : 'Partially Booked'}
                    </p>

                    <p className="mt-1.5 text-sm leading-6 text-white/50">
                      {result.message}
                    </p>

                  </div>
                </div>
              </div>

              {/* Venue list */}

              {result.venues.length > 0 && (
                <div className="border-t border-white/[0.07] p-4 sm:p-5">

                  <p
                    className="
                      mb-3 px-1
                      text-[10px] font-semibold
                      uppercase tracking-[0.18em]
                      text-white/35
                    "
                  >
                    Venue Status
                  </p>

                  <div className="grid gap-2 sm:grid-cols-2">

                    {result.venues.map((v) => (
                      <div
                        key={v.venue}
                        className={`
                          flex items-center
                          justify-between
                          gap-3
                          rounded-xl
                          border
                          px-4 py-3
                          ${
                            v.available
                              ? 'border-emerald-300/10 bg-emerald-400/[0.05]'
                              : 'border-red-300/10 bg-red-400/[0.05]'
                          }
                        `}
                      >
                        <span className="truncate text-xs font-medium text-white/65">
                          {v.venue}
                        </span>

                        <span
                          className={`
                            shrink-0
                            rounded-full
                            px-2.5 py-1
                            text-[9px] font-bold
                            uppercase tracking-[0.1em]
                            ${
                              v.available
                                ? 'bg-emerald-400/10 text-emerald-300'
                                : 'bg-red-400/10 text-red-300'
                            }
                          `}
                        >
                          {v.available
                            ? 'Available'
                            : 'Booked'}
                        </span>
                      </div>
                    ))}

                  </div>
                </div>
              )}
            </div>
          )}
        </form>

        {/* =====================================================
            BOTTOM NOTE
        ====================================================== */}

        <div className="mt-7 flex items-center justify-center gap-2 text-center">
          <span className="h-px w-8 bg-[#E4C77E]/20" />

          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/30">
            Availability is subject to booking confirmation
          </p>

          <span className="h-px w-8 bg-[#E4C77E]/20" />
        </div>
      </div>
    </section>
  )
}