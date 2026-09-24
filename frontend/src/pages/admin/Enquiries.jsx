import { useState, useEffect, useCallback } from 'react'
import api from '../../services/api'
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Mail,
  Phone,
  Calendar,
  Users,
  MapPin,
  Clock,
  StickyNote,
  Archive,
  Eye,
  Loader2,
  Inbox,
  MessageCircle,
  Send,
  Download,
  Trash2,
} from 'lucide-react'

const STATUSES = [
  'New',
  'Contacted',
  'Quoted',
  'Confirmed',
  'Closed',
  'Cancelled',
]

const statusColor = {
  New: 'bg-blue-50 text-blue-700 border border-blue-100',
  Contacted: 'bg-amber-50 text-amber-700 border border-amber-100',
  Quoted: 'bg-purple-50 text-purple-700 border border-purple-100',
  Confirmed: 'bg-green-50 text-green-700 border border-green-100',
  Closed: 'bg-gray-100 text-gray-700 border border-gray-200',
  Cancelled: 'bg-red-50 text-red-700 border border-red-100',
}

const quickMessages = [
  'Namaste! Thank you for your enquiry about {eventType} at Triveni Bhavan. We would be happy to assist you. Please let us know a convenient time to discuss.',
  'Hi {name}, your {eventType} enquiry for {guestCount} guests has been received. Our team will get back to you shortly with pricing details.',
  'Thank you for choosing Triveni Bhavan! We have availability for your {eventType}. Would you like to schedule a venue visit?',
]

function ActionLink({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A1E2B] transition-colors hover:text-[#42151F]"
    >
      {children}
    </button>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F6E9EC]">
        <Icon size={15} className="text-[#5A1E2B]" />
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-[#8A8582]">
          {label}
        </p>

        <p className="mt-0.5 break-words text-sm font-medium text-[#211B19]">
          {value || 'Not specified'}
        </p>
      </div>
    </div>
  )
}

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [selected, setSelected] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const [updateStatus, setUpdateStatus] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [archiving, setArchiving] = useState(false)

  const [whatsappMessage, setWhatsappMessage] = useState('')
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false)
  const [showQuickMessages, setShowQuickMessages] = useState(false)

  const fetchEnquiries = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = {
        page,
        limit: 10,
      }

      if (search) params.search = search
      if (statusFilter) params.status = statusFilter

      const res = await api.get('/enquiries', { params })

      setEnquiries(res.data.data || [])
      setTotalPages(res.data.pagination?.pages || 1)
    } catch (e) {
      setError(
        e.response?.data?.message ||
          'Failed to load enquiries'
      )
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter])

  useEffect(() => {
    fetchEnquiries()
  }, [fetchEnquiries])

  useEffect(() => {
    setPage(1)
  }, [search, statusFilter])

  const viewDetail = async (enquiry) => {
    setSelected(enquiry)
    setDetailLoading(true)

    setAdminNotes(enquiry.adminNotes || '')
    setUpdateStatus(enquiry.status || 'New')
    setWhatsappMessage('')
    setShowQuickMessages(false)

    try {
      const res = await api.get(`/enquiries/${enquiry._id}`)
      const data = res.data.data

      setSelected(data)
      setAdminNotes(data.adminNotes || '')
      setUpdateStatus(data.status || 'New')
    } catch {
      // Keep existing row data as fallback.
    } finally {
      setDetailLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!selected) return

    setSaving(true)

    try {
      await api.patch(`/enquiries/${selected._id}`, {
        status: updateStatus,
        adminNotes,
      })

      setSelected({
        ...selected,
        status: updateStatus,
        adminNotes,
      })

      fetchEnquiries()
    } catch (e) {
      setError(
        e.response?.data?.message ||
          'Failed to update enquiry'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleArchive = async () => {
    if (!selected) return

    setArchiving(true)

    try {
      await api.put(
        `/enquiries/${selected._id}/archive`
      )

      setSelected(null)
      fetchEnquiries()
    } catch (e) {
      setError(
        e.response?.data?.message ||
          'Failed to archive enquiry'
      )
    } finally {
      setArchiving(false)
    }
  }

  const fillQuickMessage = (template) => {
    if (!selected) return

    const bookingRange =
      selected.bookingFrom && selected.bookingTo
        ? `${new Date(selected.bookingFrom).toLocaleDateString('en-IN')} to ${new Date(selected.bookingTo).toLocaleDateString('en-IN')}`
        : 'the selected dates'

    const message = template
      .replace('{name}', selected.name || 'there')
      .replace(
        '{eventType}',
        selected.eventType || 'event'
      )
      .replace(
        '{guestCount}',
        selected.guestCount || 'your'
      )
      .replace('{bookingRange}', bookingRange)

    setWhatsappMessage(message)
    setShowQuickMessages(false)
  }

  const handleSendWhatsApp = async () => {
    if (!selected || !whatsappMessage.trim()) return

    setSendingWhatsApp(true)

    try {
      const res = await api.post(
        `/enquiries/${selected._id}/send-whatsapp`,
        {
          message: whatsappMessage.trim(),
        }
      )

      const { waUrl } = res.data.data

      setEnquiries((prev) =>
        prev.map((item) =>
          item._id === selected._id
            ? {
                ...item,
                status:
                  item.status === 'New'
                    ? 'Contacted'
                    : item.status,
              }
            : item
        )
      )

      setSelected((prev) => ({
        ...prev,
        status:
          prev.status === 'New'
            ? 'Contacted'
            : prev.status,
        whatsappMessages: [
          ...(prev.whatsappMessages || []),
          {
            message: whatsappMessage.trim(),
            sentAt: new Date().toISOString(),
          },
        ],
      }))

      setWhatsappMessage('')

      window.open(waUrl, '_blank')
    } catch (e) {
      setError(
        e.response?.data?.message ||
          'Failed to send WhatsApp message'
      )
    } finally {
      setSendingWhatsApp(false)
    }
  }

  const handleDelete = async () => {
    if (!selected) return

    const confirmed = window.confirm(
      `Are you sure you want to delete the enquiry from "${selected.name}"? This action cannot be undone.`
    )
    if (!confirmed) return

    try {
      await api.delete(`/enquiries/${selected._id}`)
      setSelected(null)
      fetchEnquiries()
    } catch (e) {
      setError(
        e.response?.data?.message ||
          'Failed to delete enquiry'
      )
    }
  }

  const handleDownloadReport = async () => {
    try {
      const res = await api.get('/enquiries/report')
      const { data: enquiries, summary } = res.data

      const header = [
        'Name',
        'Phone',
        'Email',
        'Event Type',
        'Booking From',
        'Booking To',
        'Guest Count',
        'Venue',
        'Facilities',
        'Message',
        'Status',
        'Created At',
      ]

      const rows = enquiries.map((e) => [
        e.name,
        e.phone,
        e.email || '',
        e.eventType,
        e.bookingFrom
          ? new Date(e.bookingFrom).toLocaleDateString('en-IN')
          : '',
        e.bookingTo
          ? new Date(e.bookingTo).toLocaleDateString('en-IN')
          : '',
        e.guestCount || '',
        e.preferredVenue || '',
        (e.requiredFacilities || []).join('; '),
        (e.message || '').replace(/"/g, '""'),
        e.status,
        e.createdAt
          ? new Date(e.createdAt).toLocaleDateString('en-IN')
          : '',
      ])

      const statusLines = Object.entries(summary.statusCounts)
        .map(([s, c]) => `${s}: ${c}`)
        .join(', ')

      const csvContent = [
        `"TRIVENI BHAVAN - ALL ENQUIRIES REPORT"`,
        `"Generated: ${new Date().toLocaleString('en-IN')}"`,
        `"Total Enquiries: ${summary.total}"`,
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
      link.download = `enquiries-report-${new Date().toISOString().slice(0, 10)}.csv`
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
    <div className="space-y-6">
      {/* =========================================
          HEADER
      ========================================== */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#C6A15B]">
            Customer Management
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-[#211B19] sm:text-3xl">
            Enquiries
          </h1>

          <p className="mt-1 text-sm text-[#6B6B6B]">
            Manage customer enquiries and follow-ups
          </p>
        </div>

        <button
          onClick={handleDownloadReport}
          className="inline-flex items-center gap-2 rounded-xl border border-[#E8E3E0] bg-white px-4 py-2.5 text-sm font-semibold text-[#5A1E2B] shadow-sm transition-colors hover:bg-[#F6E9EC] hover:text-[#42151F]"
        >
          <Download size={15} />
          All Enquiries Report
        </button>
      </div>

      {/* =========================================
          ERROR
      ========================================== */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <X size={17} className="mt-0.5 shrink-0" />

          <span className="flex-1">
            {error}
          </span>

          <button
            onClick={() => setError(null)}
            className="rounded-lg p-1 transition-colors hover:bg-red-100"
            aria-label="Close error"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* =========================================
          SEARCH + FILTER
      ========================================== */}
      <div className="rounded-2xl border border-[#E8E3E0] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8582]"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by name, phone or email..."
              className="w-full rounded-xl border border-[#E8E3E0] bg-[#F7F7F5] py-2.5 pl-10 pr-4 text-sm text-[#211B19] outline-none transition-all placeholder:text-[#A19B97] focus:border-[#5A1E2B] focus:bg-white focus:ring-2 focus:ring-[#5A1E2B]/10"
            />
          </div>

          {/* Status */}
          <div className="relative w-full md:w-52">
            <Filter
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8582]"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="w-full appearance-none rounded-xl border border-[#E8E3E0] bg-[#F7F7F5] py-2.5 pl-10 pr-8 text-sm text-[#211B19] outline-none transition-all focus:border-[#5A1E2B] focus:bg-white focus:ring-2 focus:ring-[#5A1E2B]/10"
            >
              <option value="">
                All Statuses
              </option>

              {STATUSES.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* =========================================
          TABLE
      ========================================== */}
      {loading ? (
        <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-[#E8E3E0] bg-white">
          <div className="flex flex-col items-center gap-3">
            <Loader2
              size={30}
              className="animate-spin text-[#5A1E2B]"
            />

            <p className="text-sm text-[#6B6B6B]">
              Loading enquiries...
            </p>
          </div>
        </div>
      ) : enquiries.length === 0 ? (
        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-[#E8E3E0] bg-white text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F6E9EC]">
            <Inbox
              size={25}
              className="text-[#5A1E2B]"
            />
          </div>

          <p className="text-base font-semibold text-[#211B19]">
            No enquiries found
          </p>

          <p className="mt-1 max-w-sm text-sm text-[#6B6B6B]">
            Try adjusting your search or status
            filter.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-[#E8E3E0] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-sm">
                <thead>
                  <tr className="border-b border-[#E8E3E0] bg-[#F7F7F5]">
                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#6B6B6B]">
                      Name
                    </th>

                    <th className="hidden px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#6B6B6B] md:table-cell">
                      Phone
                    </th>

                    <th className="hidden px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#6B6B6B] lg:table-cell">
                      Email
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#6B6B6B]">
                      Event
                    </th>

                    <th className="hidden px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#6B6B6B] sm:table-cell">
                      Date
                    </th>

                    <th className="hidden px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#6B6B6B] lg:table-cell">
                      Guests
                    </th>

                    <th className="hidden px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#6B6B6B] xl:table-cell">
                      Venue
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#6B6B6B]">
                      Status
                    </th>

                    <th className="hidden px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#6B6B6B] lg:table-cell">
                      Created
                    </th>

                    <th className="px-4 py-3" />
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E8E3E0]">
                  {enquiries.map((enquiry) => (
                    <tr
                      key={enquiry._id}
                      className="transition-colors hover:bg-[#FCFAF9]"
                    >
                      <td className="px-4 py-4">
                        <p className="font-semibold text-[#211B19]">
                          {enquiry.name}
                        </p>
                      </td>

                      <td className="hidden px-4 py-4 text-[#6B6B6B] md:table-cell">
                        {enquiry.phone}
                      </td>

                      <td className="hidden max-w-[220px] truncate px-4 py-4 text-[#6B6B6B] lg:table-cell">
                        {enquiry.email || '—'}
                      </td>

                      <td className="px-4 py-4 text-[#6B6B6B]">
                        {enquiry.eventType || '—'}
                      </td>

                      <td className="hidden px-4 py-4 text-[#6B6B6B] sm:table-cell">
                        {enquiry.bookingFrom
                          ? `${new Date(enquiry.bookingFrom).toLocaleDateString('en-IN')}${enquiry.bookingTo ? ' — ' + new Date(enquiry.bookingTo).toLocaleDateString('en-IN') : ''}`
                          : '—'}
                      </td>

                      <td className="hidden px-4 py-4 text-[#6B6B6B] lg:table-cell">
                        {enquiry.guestCount || '—'}
                      </td>

                      <td className="hidden px-4 py-4 text-[#6B6B6B] xl:table-cell">
                        {enquiry.preferredVenue ||
                          '—'}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                            statusColor[
                              enquiry.status
                            ] ||
                            'border border-gray-200 bg-gray-100 text-gray-700'
                          }`}
                        >
                          {enquiry.status}
                        </span>
                      </td>

                      <td className="hidden px-4 py-4 text-xs text-[#8A8582] lg:table-cell">
                        {enquiry.createdAt
                          ? new Date(
                              enquiry.createdAt
                            ).toLocaleDateString(
                              'en-IN'
                            )
                          : '—'}
                      </td>

                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() =>
                            viewDetail(enquiry)
                          }
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#E8E3E0] text-[#6B6B6B] transition-all hover:border-[#D9C5CA] hover:bg-[#F6E9EC] hover:text-[#5A1E2B]"
                          aria-label="View enquiry"
                        >
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between rounded-2xl border border-[#E8E3E0] bg-white px-4 py-3">
              <p className="text-xs text-[#6B6B6B]">
                Page {page} of {totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setPage((current) =>
                      Math.max(1, current - 1)
                    )
                  }
                  disabled={page === 1}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8E3E0] text-[#6B6B6B] transition-colors hover:bg-[#F6E9EC] hover:text-[#5A1E2B] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeft size={16} />
                </button>

                <button
                  onClick={() =>
                    setPage((current) =>
                      Math.min(
                        totalPages,
                        current + 1
                      )
                    )
                  }
                  disabled={page === totalPages}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8E3E0] text-[#6B6B6B] transition-colors hover:bg-[#F6E9EC] hover:text-[#5A1E2B] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* =========================================
          DETAIL DRAWER
      ========================================== */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <button
            type="button"
            aria-label="Close enquiry details"
            className="absolute inset-0 bg-[#211B19]/35 backdrop-blur-[2px]"
            onClick={() => setSelected(null)}
          />

          {/* Drawer */}
          <aside className="relative flex h-full w-full max-w-xl flex-col border-l border-[#E8E3E0] bg-white shadow-2xl">
            {/* Drawer Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E8E3E0] bg-white px-5 py-4 sm:px-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#C6A15B]">
                  Customer Enquiry
                </p>

                <h3 className="mt-1 text-lg font-bold text-[#211B19]">
                  Enquiry Details
                </h3>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E8E3E0] text-[#6B6B6B] transition-colors hover:bg-[#F6E9EC] hover:text-[#5A1E2B]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Content */}
            {detailLoading ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <Loader2
                    size={28}
                    className="animate-spin text-[#5A1E2B]"
                  />

                  <p className="text-sm text-[#6B6B6B]">
                    Loading enquiry...
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                <div className="space-y-7 p-5 sm:p-6">
                  {/* Customer */}
                  <div>
                    <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#8A8582]">
                      Customer Information
                    </h4>

                    <div className="space-y-4">
                      <InfoRow
                        icon={Mail}
                        label="Name"
                        value={selected.name}
                      />

                      <InfoRow
                        icon={Phone}
                        label="Phone"
                        value={selected.phone}
                      />

                      <InfoRow
                        icon={Mail}
                        label="Email"
                        value={selected.email}
                      />
                    </div>
                  </div>

                  {/* Event */}
                  <div className="border-t border-[#E8E3E0] pt-6">
                    <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#8A8582]">
                      Event Information
                    </h4>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <InfoRow
                        icon={Calendar}
                        label="Event Type"
                        value={selected.eventType}
                      />

                      <InfoRow
                        icon={Clock}
                        label="Booking Dates"
                        value={
                          selected.bookingFrom
                            ? `${new Date(selected.bookingFrom).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}${selected.bookingTo ? ' — ' + new Date(selected.bookingTo).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              }) : ''}`
                            : 'Not specified'
                        }
                      />

                      <InfoRow
                        icon={Users}
                        label="Guest Count"
                        value={
                          selected.guestCount
                            ? `${selected.guestCount} guests`
                            : 'Not specified'
                        }
                      />

                      <InfoRow
                        icon={MapPin}
                        label="Preferred Venue"
                        value={
                          selected.preferredVenue ||
                          'Not specified'
                        }
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="border-t border-[#E8E3E0] pt-6">
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#8A8582]">
                      Status
                    </label>

                    <select
                      value={updateStatus}
                      onChange={(e) =>
                        setUpdateStatus(
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-[#E8E3E0] bg-[#F7F7F5] px-4 py-2.5 text-sm text-[#211B19] outline-none transition-all focus:border-[#5A1E2B] focus:bg-white focus:ring-2 focus:ring-[#5A1E2B]/10"
                    >
                      {STATUSES.map((status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#8A8582]">
                      Admin Notes
                    </label>

                    <textarea
                      value={adminNotes}
                      onChange={(e) =>
                        setAdminNotes(
                          e.target.value
                        )
                      }
                      rows={4}
                      placeholder="Add notes about this enquiry..."
                      className="w-full resize-none rounded-xl border border-[#E8E3E0] bg-[#F7F7F5] px-4 py-3 text-sm text-[#211B19] outline-none transition-all placeholder:text-[#A19B97] focus:border-[#5A1E2B] focus:bg-white focus:ring-2 focus:ring-[#5A1E2B]/10"
                    />
                  </div>

                  {/* Save */}
                  <button
                    onClick={handleUpdate}
                    disabled={saving}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5A1E2B] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#42151F] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2
                        size={15}
                        className="animate-spin"
                      />
                    ) : (
                      <StickyNote size={15} />
                    )}

                    {saving
                      ? 'Saving...'
                      : 'Save Changes'}
                  </button>

                  {/* WhatsApp */}
                  <div className="border-t border-[#E8E3E0] pt-6">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8A8582]">
                        <MessageCircle
                          size={15}
                          className="text-green-600"
                        />
                        WhatsApp
                      </label>

                      <button
                        onClick={() =>
                          setShowQuickMessages(
                            !showQuickMessages
                          )
                        }
                        className="text-xs font-semibold text-[#5A1E2B] hover:text-[#42151F]"
                      >
                        {showQuickMessages
                          ? 'Hide'
                          : 'Quick Messages'}
                      </button>
                    </div>

                    {/* Quick Messages */}
                    {showQuickMessages && (
                      <div className="mb-3 space-y-2">
                        {quickMessages.map(
                          (template, index) => (
                            <button
                              key={index}
                              onClick={() =>
                                fillQuickMessage(
                                  template
                                )
                              }
                              className="w-full rounded-xl border border-[#E8E3E0] bg-[#F7F7F5] p-3 text-left text-xs leading-relaxed text-[#6B6B6B] transition-colors hover:border-[#D9C5CA] hover:bg-[#F6E9EC] hover:text-[#5A1E2B]"
                            >
                              {template.length > 100
                                ? `${template.substring(
                                    0,
                                    100
                                  )}...`
                                : template}
                            </button>
                          )
                        )}
                      </div>
                    )}

                    <textarea
                      value={whatsappMessage}
                      onChange={(e) =>
                        setWhatsappMessage(
                          e.target.value
                        )
                      }
                      rows={5}
                      placeholder="Type your WhatsApp message here..."
                      className="w-full resize-none rounded-xl border border-[#E8E3E0] bg-[#F7F7F5] px-4 py-3 text-sm text-[#211B19] outline-none transition-all placeholder:text-[#A19B97] focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/10"
                    />

                    <button
                      onClick={handleSendWhatsApp}
                      disabled={
                        sendingWhatsApp ||
                        !whatsappMessage.trim()
                      }
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#168A4A] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#11733D] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {sendingWhatsApp ? (
                        <Loader2
                          size={15}
                          className="animate-spin"
                        />
                      ) : (
                        <Send size={15} />
                      )}

                      {sendingWhatsApp
                        ? 'Sending...'
                        : 'Send WhatsApp Message'}
                    </button>

                    {/* WhatsApp History */}
                    {selected.whatsappMessages
                      ?.length > 0 && (
                      <div className="mt-5 space-y-2">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8A8582]">
                          Sent Messages
                        </p>

                        {selected.whatsappMessages.map(
                          (message, index) => (
                            <div
                              key={index}
                              className="rounded-xl border border-green-100 bg-green-50 p-3"
                            >
                              <p className="text-xs leading-relaxed text-[#355B45]">
                                {message.message}
                              </p>

                              <p className="mt-2 text-[10px] text-[#6B8A76]">
                                {new Date(
                                  message.sentAt
                                ).toLocaleString(
                                  'en-IN'
                                )}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  {/* Archive + Delete */}
                  <div className="border-t border-[#E8E3E0] pt-6 space-y-3">
                    <button
                      onClick={handleArchive}
                      disabled={archiving}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {archiving ? (
                        <Loader2
                          size={15}
                          className="animate-spin"
                        />
                      ) : (
                        <Archive size={15} />
                      )}

                      {archiving
                        ? 'Archiving...'
                        : 'Archive Enquiry'}
                    </button>

                    <button
                      onClick={handleDelete}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-300 bg-white px-4 py-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
                    >
                      <Trash2 size={15} />
                      Delete Enquiry
                    </button>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  )
}