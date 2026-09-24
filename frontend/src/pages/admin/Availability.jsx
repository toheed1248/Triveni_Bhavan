import { useState, useEffect } from 'react'
import api from '../../services/api'
import {
  Search,
  Calendar,
  CheckCircle2,
  XCircle,
  Loader2,
  Grid3X3,
} from 'lucide-react'

const VENUES = [
  'Open Hall',
  'Closed / Banquet Hall',
  'Temple / Mandir',
  'Rooms',
]

const venueColor = {
  'Open Hall': 'bg-blue-50 border-blue-100 text-blue-700',
  'Closed / Banquet Hall': 'bg-purple-50 border-purple-100 text-purple-700',
  'Temple / Mandir': 'bg-amber-50 border-amber-100 text-amber-700',
  Rooms: 'bg-green-50 border-green-100 text-green-700',
}

export default function Availability() {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState(null)
  const [resultError, setResultError] = useState(null)

  const [gridDateFrom, setGridDateFrom] = useState('')
  const [gridDateTo, setGridDateTo] = useState('')
  const [gridData, setGridData] = useState([])
  const [gridLoading, setGridLoading] = useState(false)

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    setGridDateFrom(today)
    setGridDateTo(today)
  }, [])

  const todayStr = new Date().toISOString().slice(0, 10)

  const checkAvailability = async (e) => {
    e.preventDefault()

    if (dateTo && dateFrom && dateTo < dateFrom) {
      setResultError('Till date cannot be earlier than from date.')
      return
    }

    setChecking(true)
    setResult(null)
    setResultError(null)

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
        ? `from ${new Date(dateFrom).toLocaleDateString('en-IN')} to ${new Date(dateTo).toLocaleDateString('en-IN')}`
        : `on ${new Date(dateFrom).toLocaleDateString('en-IN')}`

      setResult({
        available: allAvailable,
        venues,
        bookedVenues,
        message: allAvailable
          ? `All venues are available ${dateLabel}.`
          : `Booked ${dateLabel}: ${bookedVenues.join(', ')}.`,
      })
    } catch (e) {
      setResultError(
        e.response?.data?.message || 'Failed to check availability'
      )
    } finally {
      setChecking(false)
    }
  }

  const fetchGrid = async () => {
    if (!gridDateFrom) return

    setGridLoading(true)

    try {
      const params = { dateFrom: gridDateFrom }
      if (gridDateTo) params.dateTo = gridDateTo

      const res = await api.get('/availability/date', { params })

      setGridData(res.data.venues || [])
    } catch {
      setGridData([])
    } finally {
      setGridLoading(false)
    }
  }

  useEffect(() => {
    if (gridDateFrom) {
      fetchGrid()
    }
  }, [gridDateFrom, gridDateTo])

  const inputClass =
    'w-full px-3.5 py-2.5 bg-white border border-[#E8E3E0] rounded-xl text-sm text-[#211B19] focus:outline-none focus:ring-2 focus:ring-[#5A1E2B]/10 focus:border-[#5A1E2B] transition-all'

  return (
    <div className="min-h-full space-y-6 bg-[#F7F7F5] text-[#211B19]">
      {/* Page Header */}
      <div>
        <div className="mb-1 flex items-center gap-2">
          <span className="h-7 w-1 rounded-full bg-[#C6A15B]" />
          <h2 className="font-heading text-2xl font-bold text-[#42151F]">
            Availability
          </h2>
        </div>

        <p className="text-sm text-[#6B6B6B]">
          Check venue availability for date range
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Check */}
        <div className="rounded-2xl border border-[#E8E3E0] bg-white p-6 shadow-sm">
          <h3 className="mb-5 flex items-center gap-2 font-heading text-lg font-semibold text-[#42151F]">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5A1E2B]/5">
              <Search size={17} className="text-[#5A1E2B]" />
            </span>
            Check Date Availability
          </h3>

          <form onSubmit={checkAvailability} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-xs font-semibold text-[#42151F]">
                  From Date
                </label>

                <div className="relative">
                  <Calendar
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9592]"
                  />

                  <input
                    type="date"
                    required
                    value={dateFrom}
                    min={todayStr}
                    onChange={(e) => {
                      const from = e.target.value
                      setDateFrom(from)
                      if (dateTo && dateTo < from) setDateTo('')
                    }}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-[#42151F]">
                  Till Date
                </label>

                <div className="relative">
                  <Calendar
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9592]"
                  />

                  <input
                    type="date"
                    required
                    value={dateTo}
                    min={dateFrom || todayStr}
                    onChange={(e) => setDateTo(e.target.value)}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={checking}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5A1E2B] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#42151F] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {checking ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Search size={15} />
              )}
              Check Availability
            </button>
          </form>

          {resultError && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-3.5 text-sm text-red-700">
              <XCircle size={17} className="mt-0.5 shrink-0" />
              <span>{resultError}</span>
            </div>
          )}

          {result && (
            <div
              className={`mt-5 rounded-2xl border p-4 ${
                result.available
                  ? 'border-emerald-100 bg-emerald-50'
                  : 'border-red-100 bg-red-50'
              }`}
            >
              <div className="mb-4 flex items-start gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    result.available ? 'bg-emerald-100' : 'bg-red-100'
                  }`}
                >
                  {result.available ? (
                    <CheckCircle2
                      size={19}
                      className="text-emerald-700"
                    />
                  ) : (
                    <XCircle size={19} className="text-red-700" />
                  )}
                </div>

                <div>
                  <p
                    className={`text-base font-semibold ${
                      result.available
                        ? 'text-emerald-800'
                        : 'text-red-800'
                    }`}
                  >
                    {result.available ? 'All Available' : 'Partially Booked'}
                  </p>

                  <p className="mt-0.5 text-sm text-[#6B6B6B]">
                    {result.message}
                  </p>
                </div>
              </div>

              {result.venues.length > 0 && (
                <div className="space-y-2">
                  {result.venues.map((v) => (
                    <div
                      key={v.venue}
                      className="flex items-center justify-between rounded-xl border border-[#E8E3E0] bg-white px-3.5 py-2.5"
                    >
                      <span className="text-sm font-medium text-[#211B19]">
                        {v.venue}
                      </span>

                      <span
                        className={`text-xs font-semibold ${
                          v.available
                            ? 'text-emerald-700'
                            : 'text-red-700'
                        }`}
                      >
                        {v.available ? 'Available' : 'Booked'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Venue Grid */}
        <div className="rounded-2xl border border-[#E8E3E0] bg-white p-6 shadow-sm">
          <h3 className="mb-5 flex items-center gap-2 font-heading text-lg font-semibold text-[#42151F]">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5A1E2B]/5">
              <Grid3X3 size={17} className="text-[#5A1E2B]" />
            </span>
            Daily Venue Grid
          </h3>

          <div className="mb-5">
            <label className="mb-2 block text-xs font-semibold text-[#42151F]">
              Select Date Range
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <Calendar
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9592]"
                />

                <input
                  type="date"
                  value={gridDateFrom}
                  onChange={(e) => {
                    const from = e.target.value
                    setGridDateFrom(from)
                    if (gridDateTo && gridDateTo < from) setGridDateTo(from)
                  }}
                  className={`${inputClass} pl-10`}
                />
              </div>

              <div className="relative">
                <Calendar
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9592]"
                />

                <input
                  type="date"
                  value={gridDateTo}
                  min={gridDateFrom}
                  onChange={(e) => setGridDateTo(e.target.value)}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
          </div>

          {gridLoading ? (
            <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-[#E8E3E0] bg-[#FAF9F7]">
              <Loader2
                size={27}
                className="animate-spin text-[#5A1E2B]"
              />
              <p className="mt-3 text-sm text-[#6B6B6B]">
                Checking venue availability...
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {VENUES.map((venue) => {
                const venueData = Array.isArray(gridData)
                  ? gridData.find((item) => item.venue === venue)
                  : null

                const isAvailable = venueData
                  ? venueData.available
                  : true

                return (
                  <div
                    key={venue}
                    className={`rounded-xl border p-3.5 ${venueColor[venue]}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                        <span className="text-sm font-semibold">
                          {venue}
                        </span>
                      </div>

                      <span
                        className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                          isAvailable
                            ? 'border-emerald-100 bg-white text-emerald-700'
                            : 'border-red-100 bg-white text-red-700'
                        }`}
                      >
                        {isAvailable ? 'Available' : 'Booked'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-[#C6A15B]/30" />
    </div>
  )
}
