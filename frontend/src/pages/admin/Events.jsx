import { useState, useEffect, useCallback } from 'react'
import api from '../../services/api'
import {
  Plus, Search, Filter, ChevronLeft, ChevronRight, X, Pencil, Trash2,
  Calendar, Clock, MapPin, Users, Loader2, Inbox, Save, Download
} from 'lucide-react'

const STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled']

const EVENT_TYPES = ['Wedding', 'Reception', 'Family Celebration', 'Religious Event', 'Other']

const VENUES = ['Open Hall', 'Closed / Banquet Hall', 'Temple / Mandir', 'Rooms', 'Other']

const statusColor = {
  Pending: 'bg-blue-50 text-blue-700 border border-blue-100',
  Confirmed: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  Completed: 'bg-gray-100 text-gray-700 border border-gray-200',
  Cancelled: 'bg-red-50 text-red-700 border border-red-100',
}

const emptyForm = {
  eventName: '',
  eventType: '',
  eventFromDate: '',
  eventToDate: '',
  startTime: '',
  endTime: '',
  venue: '',
  guestCount: '',
  status: 'Pending',
}

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [venueFilter, setVenueFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [cancelling, setCancelling] = useState(null)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = { page, limit: 10 }
      if (search) params.search = search
      if (venueFilter) params.venue = venueFilter
      if (dateFilter) params.date = dateFilter
      const res = await api.get('/events', { params })
      const d = res.data.data
      setEvents(d.events || d || [])
      setTotalPages(d.totalPages || 1)
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }, [page, search, venueFilter, dateFilter])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  useEffect(() => { setPage(1) }, [search, venueFilter, dateFilter])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const openEdit = (ev) => {
    setEditing(ev)
    const fromDate = ev.eventFromDate ? ev.eventFromDate.slice(0, 10) : (ev.eventDate ? ev.eventDate.slice(0, 10) : '')
    const toDate = ev.eventToDate ? ev.eventToDate.slice(0, 10) : fromDate
    setForm({
      eventName: ev.eventName || '',
      eventType: ev.eventType || '',
      eventFromDate: fromDate,
      eventToDate: toDate,
      startTime: ev.startTime || '',
      endTime: ev.endTime || '',
      venue: ev.venue || '',
      guestCount: ev.guestCount || '',
      status: ev.status || 'Pending',
    })
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()

    if (form.eventToDate && form.eventFromDate && form.eventToDate < form.eventFromDate) {
      setError('Event end date cannot be before start date.')
      return
    }

    setSaving(true)
    setError(null)
    try {
      const payload = {
        eventName: form.eventName,
        eventType: form.eventType,
        eventFromDate: form.eventFromDate || undefined,
        eventToDate: form.eventToDate || form.eventFromDate || undefined,
        eventDate: form.eventFromDate || undefined,
        startTime: form.startTime,
        endTime: form.endTime,
        venue: form.venue,
        guestCount: form.guestCount ? Number(form.guestCount) : 1,
        status: form.status,
      }
      if (editing) {
        await api.put(`/events/${editing._id}`, payload)
      } else {
        await api.post('/events', payload)
      }
      setShowModal(false)
      fetchEvents()
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save event')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = async (ev) => {
    if (!confirm('Cancel this event?')) return
    setCancelling(ev._id)
    try {
      await api.put(`/events/${ev._id}`, { status: 'Cancelled' })
      fetchEvents()
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to cancel event')
    } finally {
      setCancelling(null)
    }
  }

  const handleDownloadReport = async () => {
    try {
      const res = await api.get('/events/report')
      const { data: events, summary } = res.data

      const header = [
        'Event Name',
        'Type',
        'From Date',
        'To Date',
        'Start Time',
        'End Time',
        'Venue',
        'Guest Count',
        'Status',
        'Created At',
      ]

      const rows = events.map((e) => {
        const fromDate = e.eventFromDate
          ? new Date(e.eventFromDate).toLocaleDateString('en-IN')
          : e.eventDate
            ? new Date(e.eventDate).toLocaleDateString('en-IN')
            : ''
        const toDate = e.eventToDate
          ? new Date(e.eventToDate).toLocaleDateString('en-IN')
          : fromDate
        return [
          e.eventName,
          e.eventType,
          fromDate,
          toDate,
          e.startTime || '',
          e.endTime || '',
          e.venue || '',
          e.guestCount || '',
          e.status,
          e.createdAt
            ? new Date(e.createdAt).toLocaleDateString('en-IN')
            : '',
        ]
      })

      const statusLines = Object.entries(summary.statusCounts)
        .map(([s, c]) => `${s}: ${c}`)
        .join(', ')

      const csvContent = [
        `"TRIVENI BHAVAN - ALL EVENTS REPORT"`,
        `"Generated: ${new Date().toLocaleString('en-IN')}"`,
        `"Total Events: ${summary.total}"`,
        `"Status Breakdown: ${statusLines}"`,
        '',
        header.map((h) => `"${h}"`).join(','),
        ...rows.map((r) =>
          r.map((v) => `"${v}"`).join(',')
        ),
      ].join('\n')

      const blob = new Blob([csvContent], {
        type: 'text/csv;charset=utf-8;',
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `events-report-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (e) {
      setError(
        e.response?.data?.message ||
          'Failed to generate report'
      )
    }
  }

  return (
    <div className="min-h-full bg-[#F7F7F5] text-[#211B19] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2"><span className="h-7 w-1 rounded-full bg-[#C6A15B] rounded-full" /><h2 className="font-heading text-2xl font-bold text-[#42151F]">Events</h2></div>
          <p className="text-sm text-[#6B6B6B] mt-1">Manage your events and bookings</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadReport}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#E8E3E0] bg-white text-[#5A1E2B] font-semibold rounded-lg text-sm hover:bg-[#F6E9EC] transition-colors"
          >
            <Download size={16} />
            Download All Events
          </button>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#5A1E2B] text-white font-semibold rounded-lg text-sm hover:bg-[#42151F] transition-colors"
          >
            <Plus size={16} />
            Create Event
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">
          <X size={16} className="shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)}><X size={14} /></button>
        </div>
      )}

      <div className="bg-white border border-[#E8E3E0] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9592]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8E3E0] rounded-lg text-sm text-[#211B19] placeholder:text-[#9A9592] focus:outline-none focus:border-[#5A1E2B]"
          />
        </div>
        <div className="relative">
          <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9592]" />
          <select
            value={venueFilter}
            onChange={(e) => setVenueFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 bg-white border border-[#E8E3E0] rounded-lg text-sm text-[#211B19] appearance-none focus:outline-none focus:border-[#5A1E2B]"
          >
            <option value="">All Venues</option>
            {VENUES.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
        <div className="relative">
          <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9592]" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-white border border-[#E8E3E0] rounded-lg text-sm text-[#211B19] focus:outline-none focus:border-[#5A1E2B]"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-[#5A1E2B]" />
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-[#211B19]/40">
          <Inbox size={48} className="mb-3" />
          <p className="text-lg font-medium">No events found</p>
          <p className="text-sm mt-1">Create your first event to get started</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-[#E8E3E0]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FAF9F7] border-b border-[#E8E3E0]">
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#211B19]/50 uppercase tracking-wider">Event Name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#211B19]/50 uppercase tracking-wider hidden md:table-cell">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#211B19]/50 uppercase tracking-wider">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#211B19]/50 uppercase tracking-wider hidden sm:table-cell">Time</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#211B19]/50 uppercase tracking-wider hidden lg:table-cell">Venue</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#211B19]/50 uppercase tracking-wider hidden xl:table-cell">Guests</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#211B19]/50 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[#211B19]/50 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E3E0]">
                {events.map((ev) => (
                  <tr key={ev._id} className="hover:bg-[#FAF9F7]/50 transition-colors">
                    <td className="px-4 py-3 text-[#211B19] font-medium">{ev.eventName}</td>
                    <td className="px-4 py-3 text-[#211B19]/60 hidden md:table-cell">{ev.eventType}</td>
                    <td className="px-4 py-3 text-[#211B19]/60">{ev.eventFromDate ? `${new Date(ev.eventFromDate).toLocaleDateString()}` : ev.eventDate ? new Date(ev.eventDate).toLocaleDateString() : '—'}{ev.eventToDate && ev.eventToDate !== ev.eventFromDate ? ` — ${new Date(ev.eventToDate).toLocaleDateString()}` : ''}</td>
                    <td className="px-4 py-3 text-[#211B19]/60 hidden sm:table-cell">{ev.startTime && ev.endTime ? `${ev.startTime} – ${ev.endTime}` : '—'}</td>
                    <td className="px-4 py-3 text-[#211B19]/60 hidden lg:table-cell">{ev.venue}</td>
                    <td className="px-4 py-3 text-[#211B19]/60 hidden xl:table-cell">{ev.guestCount || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[ev.status] || 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                        {ev.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(ev)}
                          className="p-1.5 rounded-lg hover:bg-[#5A1E2B]/5 text-[#211B19]/50 hover:text-[#5A1E2B] transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        {ev.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleCancel(ev)}
                            disabled={cancelling === ev._id}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-[#211B19]/50 hover:text-red-400 transition-colors disabled:opacity-50"
                          >
                            {cancelling === ev._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#211B19]/40">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-[#E8E3E0] text-[#211B19]/50 hover:bg-[#5A1E2B]/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-[#E8E3E0] text-[#211B19]/50 hover:bg-[#5A1E2B]/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#211B19]/45" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg bg-white border border-[#E8E3E0] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E3E0]">
              <h3 className="font-heading text-lg font-semibold text-[#211B19]">
                {editing ? 'Edit Event' : 'Create Event'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-[#5A1E2B]/5 text-[#211B19]/50 transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-medium text-[#211B19]/50 mb-1.5">Event Name</label>
                <input
                  type="text"
                  required
                  value={form.eventName}
                  onChange={(e) => setForm({ ...form, eventName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#FAF9F7] border border-[#E8E3E0] rounded-lg text-sm text-[#211B19] placeholder:text-[#9A9592] focus:outline-none focus:border-[#5A1E2B]"
                  placeholder="e.g. Wedding Reception"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#211B19]/50 mb-1.5">Event Type</label>
                  <select
                    required
                    value={form.eventType}
                    onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF9F7] border border-[#E8E3E0] rounded-lg text-sm text-[#211B19] appearance-none focus:outline-none focus:border-[#5A1E2B]"
                  >
                    <option value="">Select type</option>
                    {EVENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#211B19]/50 mb-1.5">Event From Date</label>
                  <input
                    type="date"
                    required
                    value={form.eventFromDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      const from = e.target.value
                      setForm((prev) => ({
                        ...prev,
                        eventFromDate: from,
                        eventToDate: prev.eventToDate && prev.eventToDate < from ? '' : prev.eventToDate,
                      }))
                    }}
                    className="w-full px-4 py-2.5 bg-[#FAF9F7] border border-[#E8E3E0] rounded-lg text-sm text-[#211B19] focus:outline-none focus:border-[#5A1E2B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#211B19]/50 mb-1.5">Event To Date</label>
                  <input
                    type="date"
                    required
                    value={form.eventToDate}
                    min={form.eventFromDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setForm({ ...form, eventToDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF9F7] border border-[#E8E3E0] rounded-lg text-sm text-[#211B19] focus:outline-none focus:border-[#5A1E2B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#211B19]/50 mb-1.5">Start Time</label>
                  <input
                    type="time"
                    required
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF9F7] border border-[#E8E3E0] rounded-lg text-sm text-[#211B19] focus:outline-none focus:border-[#5A1E2B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#211B19]/50 mb-1.5">End Time</label>
                  <input
                    type="time"
                    required
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF9F7] border border-[#E8E3E0] rounded-lg text-sm text-[#211B19] focus:outline-none focus:border-[#5A1E2B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#211B19]/50 mb-1.5">Venue</label>
                  <select
                    required
                    value={form.venue}
                    onChange={(e) => setForm({ ...form, venue: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF9F7] border border-[#E8E3E0] rounded-lg text-sm text-[#211B19] appearance-none focus:outline-none focus:border-[#5A1E2B]"
                  >
                    <option value="">Select venue</option>
                    {VENUES.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#211B19]/50 mb-1.5">Guest Count</label>
                  <input
                    type="number"
                    min="0"
                    value={form.guestCount}
                    onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF9F7] border border-[#E8E3E0] rounded-lg text-sm text-[#211B19] placeholder:text-[#9A9592] focus:outline-none focus:border-[#5A1E2B]"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#211B19]/50 mb-1.5">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#FAF9F7] border border-[#E8E3E0] rounded-lg text-sm text-[#211B19] appearance-none focus:outline-none focus:border-[#5A1E2B]"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-[#E8E3E0] text-[#211B19]/70 rounded-lg text-sm hover:bg-[#5A1E2B]/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#5A1E2B] text-white font-semibold rounded-lg text-sm hover:bg-[#42151F] transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
