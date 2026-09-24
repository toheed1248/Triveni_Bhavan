import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import {
  Mail,
  Calendar,
  CalendarCheck,
  Image,
  Star,
  Settings,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle2,
  Archive,
  Plus,
  CalendarDays,
} from 'lucide-react'
import StatusBadge from '../../components/Admin/StatusBadge'

const STATUSES = [
  'New',
  'Contacted',
  'Quoted',
  'Confirmed',
  'Closed',
  'Cancelled',
]

const statConfig = [
  {
    key: 'enquiries',
    icon: Mail,
    label: 'Total Enquiries',
  },
  {
    key: 'events',
    icon: Calendar,
    label: 'Total Events',
  },
  {
    key: 'upcoming',
    icon: CalendarCheck,
    label: 'Upcoming Events',
  },
  {
    key: 'gallery',
    icon: Image,
    label: 'Gallery Images',
  },
  {
    key: 'reviews',
    icon: Star,
    label: 'Total Reviews',
  },
  {
    key: 'rating',
    icon: TrendingUp,
    label: 'Average Rating',
  },
]

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-[#5A1E2B] p-5 text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/5" />

      <div className="relative">
        <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
          <Icon size={20} className="text-[#E8D5A3]" />
        </div>

        <p className="text-3xl font-bold tracking-tight">
          {value}
        </p>

        <p className="mt-1 text-sm text-white/70">
          {label}
        </p>
      </div>
    </div>
  )
}

function SectionCard({ title, action, children, className = '' }) {
  return (
    <section
      className={`rounded-2xl border border-[#E8E3E0] bg-white p-5 shadow-sm ${className}`}
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-[#211B19]">
          {title}
        </h2>

        {action}
      </div>

      {children}
    </section>
  )
}

function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F6E9EC]">
        <Icon size={22} className="text-[#5A1E2B]" />
      </div>

      <p className="text-sm font-semibold text-[#211B19]">
        {title}
      </p>

      {description && (
        <p className="mt-1 max-w-xs text-xs text-[#6B6B6B]">
          {description}
        </p>
      )}
    </div>
  )
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    const loadDashboard = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await api.get('/dashboard/summary')

        if (mounted) {
          setData(response.data?.data || null)
        }
      } catch (err) {
        if (mounted) {
          setError(
            err.response?.data?.message ||
              'Failed to load dashboard'
          )
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#E8E3E0] border-t-[#5A1E2B]" />
          <p className="text-sm text-[#6B6B6B]">
            Loading dashboard...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <p className="text-sm font-semibold text-red-700">
          Unable to load dashboard
        </p>

        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      </div>
    )
  }

  if (!data) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="No dashboard data available"
        description="Dashboard information will appear here once data is available."
      />
    )
  }

  const stats = [
    {
      ...statConfig[0],
      value: data.enquiries?.total ?? 0,
    },
    {
      ...statConfig[1],
      value: data.events?.total ?? 0,
    },
    {
      ...statConfig[2],
      value: data.events?.upcoming ?? 0,
    },
    {
      ...statConfig[3],
      value: data.gallery?.total ?? 0,
    },
    {
      ...statConfig[4],
      value: data.reviews?.total ?? 0,
    },
    {
      ...statConfig[5],
      value: data.reviews?.averageRating ?? '—',
    },
  ]

  const totalReviews = Number(data.reviews?.total || 0)

  const ratingBreakdown = data.reviews?.ratingBreakdown || {}

  const getRatingPercentage = (rating) => {
    if (!totalReviews) return 0

    const count = Number(ratingBreakdown[rating] || 0)

    return Math.min((count / totalReviews) * 100, 100)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#C6A15B]">
            Triveni Bhavan
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-[#211B19] sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-1.5 text-sm text-[#8A8582]">
            A quick overview of your venue activity and bookings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Today indicator */}
          <div className="hidden items-center gap-2.5 rounded-xl border border-[#E8E3E0] bg-white px-4 py-2.5 shadow-sm sm:flex">
            <CalendarDays size={15} className="text-[#C6A15B]" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8A8582]">
                Today
              </p>
              <p className="text-xs font-semibold text-[#211B19]">
                {new Date().toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Add Event */}
          <Link
            to="/admin/events"
            className="inline-flex items-center gap-2 rounded-xl bg-[#5A1E2B] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#42151F] hover:shadow-md"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span className="hidden sm:inline">Add Event</span>
            <span className="sm:hidden">Add</span>
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
          />
        ))}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Enquiries */}
        <SectionCard
          title="Enquiries"
          action={
            <Link
              to="/admin/enquiries"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A1E2B] transition-colors hover:text-[#42151F]"
            >
              View All
              <ArrowRight size={13} />
            </Link>
          }
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {STATUSES.map((status) => (
              <div
                key={status}
                className="rounded-xl border border-[#E8E3E0] bg-[#F7F7F5] p-3 text-center transition-colors hover:border-[#D9C5CA] hover:bg-[#F6E9EC]"
              >
                <p className="text-xl font-bold text-[#211B19]">
                  {data.enquiries?.byStatus?.[status] ?? 0}
                </p>

                <p className="mt-1 text-[11px] font-medium text-[#6B6B6B]">
                  {status}
                </p>
              </div>
            ))}
          </div>

          {data.enquiries?.recent?.length > 0 ? (
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8A8582]">
                  Recent Enquiries
                </p>

                <span className="text-xs text-[#8A8582]">
                  Latest
                </span>
              </div>

              <div className="space-y-2">
                {data.enquiries.recent.slice(0, 5).map((enquiry) => (
                  <Link
                    key={enquiry._id}
                    to="/admin/enquiries"
                    className="flex items-center justify-between gap-3 rounded-xl border border-transparent bg-[#F7F7F5] p-3 transition-all hover:border-[#E8D5A3] hover:bg-[#F6E9EC]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#211B19]">
                        {enquiry.name}
                      </p>

                      {enquiry.eventType && (
                        <p className="mt-0.5 truncate text-xs text-[#6B6B6B]">
                          {enquiry.eventType}
                        </p>
                      )}
                    </div>

                    <StatusBadge
                      status={enquiry.status}
                      size="sm"
                    />
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-5 border-t border-[#E8E3E0] pt-5">
              <p className="text-center text-xs text-[#8A8582]">
                No recent enquiries.
              </p>
            </div>
          )}
        </SectionCard>

        {/* Upcoming Events */}
        <SectionCard
          title="Upcoming Events"
          action={
            <Link
              to="/admin/events"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A1E2B] hover:text-[#42151F]"
            >
              View All
              <ArrowRight size={13} />
            </Link>
          }
        >
          {data.events?.upcomingList?.length > 0 ? (
            <div className="space-y-3">
              {data.events.upcomingList.map((event) => (
                <div
                  key={event._id}
                  className="rounded-xl border border-[#E8E3E0] bg-[#F7F7F5] p-4 transition-colors hover:border-[#D9C5CA]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#211B19]">
                        {event.eventName}
                      </p>

                      <p className="mt-1 text-xs text-[#6B6B6B]">
                        {event.eventType || 'Event'}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-[#F6E9EC] px-2.5 py-1 text-[10px] font-semibold text-[#5A1E2B]">
                      Upcoming
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#E8E3E0] pt-3">
                    <span className="text-xs text-[#6B6B6B]">
                      {event.eventFromDate
                        ? `${new Date(event.eventFromDate).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}${event.eventToDate && event.eventToDate !== event.eventFromDate ? ' — ' + new Date(event.eventToDate).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          }) : ''}`
                        : event.eventDate
                          ? new Date(event.eventDate).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Date not available'}
                    </span>

                    {event.startTime && event.endTime && (
                      <span className="text-xs text-[#6B6B6B]">
                        {event.startTime} – {event.endTime}
                      </span>
                    )}

                    {event.venue && (
                      <span className="text-xs font-semibold text-[#5A1E2B]">
                        {event.venue}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Calendar}
              title="No upcoming events"
              description="Upcoming confirmed events will appear here."
            />
          )}
        </SectionCard>

        {/* Gallery */}
        <SectionCard
          title="Gallery"
          action={
            <Link
              to="/admin/gallery"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A1E2B] hover:text-[#42151F]"
            >
              Manage
              <ArrowRight size={13} />
            </Link>
          }
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-[#E8E3E0] bg-[#F7F7F5] p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F6E9EC]">
                <Image size={19} className="text-[#5A1E2B]" />
              </div>

              <p className="text-3xl font-bold text-[#211B19]">
                {data.gallery?.published ?? 0}
              </p>

              <p className="mt-1 text-xs font-medium text-[#6B6B6B]">
                Published
              </p>
            </div>

            <div className="rounded-xl border border-[#E8E3E0] bg-[#F7F7F5] p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F0E3]">
                <Archive size={19} className="text-[#C6A15B]" />
              </div>

              <p className="text-3xl font-bold text-[#211B19]">
                {data.gallery?.archived ?? 0}
              </p>

              <p className="mt-1 text-xs font-medium text-[#6B6B6B]">
                Archived
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Reviews */}
        <SectionCard
          title="Reviews"
          action={
            <Link
              to="/admin/reviews"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A1E2B] hover:text-[#42151F]"
            >
              Manage
              <ArrowRight size={13} />
            </Link>
          }
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-[#E8E3E0] bg-[#F7F7F5] p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F6E9EC]">
                <CheckCircle2
                  size={19}
                  className="text-[#5A1E2B]"
                />
              </div>

              <p className="text-3xl font-bold text-[#211B19]">
                {data.reviews?.published ?? 0}
              </p>

              <p className="mt-1 text-xs font-medium text-[#6B6B6B]">
                Published
              </p>
            </div>

            <div className="rounded-xl border border-[#E8E3E0] bg-[#F7F7F5] p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F0E3]">
                <Star
                  size={19}
                  className="fill-[#C6A15B] text-[#C6A15B]"
                />
              </div>

              <p className="text-3xl font-bold text-[#211B19]">
                {data.reviews?.averageRating ?? '—'}
              </p>

              <p className="mt-1 text-xs font-medium text-[#6B6B6B]">
                Average Rating
              </p>
            </div>
          </div>

          {totalReviews > 0 && (
            <div className="mt-6 border-t border-[#E8E3E0] pt-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8A8582]">
                  Rating Distribution
                </p>

                <span className="text-xs text-[#6B6B6B]">
                  {totalReviews} total
                </span>
              </div>

              <div className="space-y-2.5">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = Number(
                    ratingBreakdown[rating] || 0
                  )

                  return (
                    <div
                      key={rating}
                      className="flex items-center gap-2.5"
                    >
                      <span className="w-3 text-xs font-medium text-[#6B6B6B]">
                        {rating}
                      </span>

                      <Star
                        size={12}
                        className="shrink-0 fill-[#C6A15B] text-[#C6A15B]"
                      />

                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#EDE9E6]">
                        <div
                          className="h-full rounded-full bg-[#C6A15B] transition-all duration-500"
                          style={{
                            width: `${getRatingPercentage(
                              rating
                            )}%`,
                          }}
                        />
                      </div>

                      <span className="w-6 text-right text-xs font-medium text-[#6B6B6B]">
                        {count}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </SectionCard>
      </div>

      {/* Business Settings */}
      <SectionCard title="Business Settings">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[#211B19]">
              {data.settings?.configured
                ? 'Business settings are configured.'
                : 'Business settings are not configured yet.'}
            </p>

            <p className="mt-1 text-xs text-[#6B6B6B]">
              Manage your business information, contact details,
              facilities and social links.
            </p>
          </div>

          <Link
            to="/admin/settings"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#5A1E2B] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#42151F]"
          >
            <Settings size={15} />
            Open Settings
          </Link>
        </div>
      </SectionCard>

      {/* Recent Activity */}
      {data.recentActivity?.length > 0 && (
        <SectionCard title="Recent Activity">
          <div className="space-y-2">
            {data.recentActivity.map((activity, index) => (
              <div
                key={activity._id || `${activity.date}-${index}`}
                className="flex items-center gap-3 rounded-xl border border-[#E8E3E0] bg-[#F7F7F5] p-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F6E9EC]">
                  <Clock
                    size={15}
                    className="text-[#5A1E2B]"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#211B19]">
                    {activity.title}
                  </p>

                  <p className="mt-0.5 text-xs text-[#6B6B6B]">
                    {activity.type}
                  </p>
                </div>

                <span className="shrink-0 text-xs text-[#8A8582]">
                  {activity.date
                    ? new Date(activity.date).toLocaleDateString(
                        'en-IN',
                        {
                          day: '2-digit',
                          month: 'short',
                        }
                      )
                    : '—'}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  )
}