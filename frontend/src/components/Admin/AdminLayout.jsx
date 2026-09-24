import { useState } from 'react'
import {
  Outlet,
  NavLink,
  useNavigate,
  useLocation,
} from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

import {
  LayoutDashboard,
  Mail,
  Calendar,
  CalendarCheck,
  Image,
  Star,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
  UserCog,
} from 'lucide-react'

const NAV = [
  {
    to: '/admin',
    icon: LayoutDashboard,
    label: 'Dashboard',
    end: true,
  },
  {
    to: '/admin/enquiries',
    icon: Mail,
    label: 'Enquiries',
  },
  {
    to: '/admin/events',
    icon: Calendar,
    label: 'Events',
  },
  {
    to: '/admin/availability',
    icon: CalendarCheck,
    label: 'Availability',
  },
  {
    to: '/admin/gallery',
    icon: Image,
    label: 'Gallery',
  },
  {
    to: '/admin/reviews',
    icon: Star,
    label: 'Reviews',
  },
  {
    to: '/admin/settings',
    icon: Settings,
    label: 'Settings',
  },
]

const PAGE_TITLES = {
  '/admin': 'Dashboard',
  '/admin/enquiries': 'Enquiries',
  '/admin/events': 'Events',
  '/admin/availability': 'Availability',
  '/admin/gallery': 'Gallery',
  '/admin/reviews': 'Reviews',
  '/admin/settings': 'Settings',
  '/admin/profile': 'My Profile',
}

export default function AdminLayout() {
  const { admin, logout } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()

  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const pageTitle =
    PAGE_TITLES[location.pathname] || 'Dashboard'

  const adminInitial = (
    admin?.name || 'Admin'
  )
    .charAt(0)
    .toUpperCase()

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F5F2]">

      {/* =========================================================
          DESKTOP SIDEBAR
      ========================================================== */}

      <aside
        className={[
          `
            fixed inset-y-0 left-0 z-[60]
            flex w-[270px] flex-col
            bg-[#42151F]
            shadow-[10px_0_50px_rgba(33,27,25,0.12)]
            transition-transform duration-300 ease-out
            lg:static lg:translate-x-0
          `,
          open
            ? 'translate-x-0'
            : '-translate-x-full',
        ].join(' ')}
      >

        {/* -------------------------------------------------------
            BRAND
        -------------------------------------------------------- */}

        <div className="flex h-[76px] shrink-0 items-center border-b border-white/10 px-5">

          <div className="flex min-w-0 flex-1 items-center gap-3">

            {/* Logo */}
            <div
              className="
                relative flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-2xl
                border border-[#C6A15B]/60
                bg-[#C6A15B]/10
              "
            >
              <div
                className="
                  absolute inset-1
                  rounded-xl
                  border border-[#C6A15B]/20
                "
              />

              <span className="relative text-xs font-bold tracking-tight text-[#E4C77E]">
                TB
              </span>
            </div>

            {/* Brand */}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-white">
                Triveni Bhavan
              </p>

              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">
                Admin Dashboard
              </p>
            </div>
          </div>

          {/* Mobile close */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="
              rounded-xl p-2
              text-white/50
              transition
              hover:bg-white/10
              hover:text-white
              lg:hidden
            "
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* -------------------------------------------------------
            NAVIGATION
        -------------------------------------------------------- */}

        <nav className="flex-1 overflow-y-auto px-3 py-6">

          <div className="mb-4 px-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/30">
              Workspace
            </p>
          </div>

          <div className="space-y-1.5">

            {NAV.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `
                      group relative flex items-center gap-3
                      rounded-2xl px-3.5 py-3
                      text-sm font-medium
                      transition-all duration-200
                      ${
                        isActive
                          ? 'bg-white text-[#42151F] shadow-[0_8px_25px_rgba(0,0,0,0.12)]'
                          : 'text-white/65 hover:bg-white/[0.07] hover:text-white'
                      }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active indicator */}
                      {isActive && (
                        <span
                          className="
                            absolute left-0 top-1/2
                            h-7 w-1
                            -translate-y-1/2
                            rounded-r-full
                            bg-[#C6A15B]
                          "
                        />
                      )}

                      {/* Icon */}
                      <div
                        className={`
                          flex h-9 w-9 shrink-0
                          items-center justify-center
                          rounded-xl
                          transition
                          ${
                            isActive
                              ? 'bg-[#F7F3ED] text-[#42151F]'
                              : 'bg-white/[0.05] text-white/55 group-hover:bg-white/10 group-hover:text-[#E4C77E]'
                          }
                        `}
                      >
                        <Icon
                          size={17}
                          strokeWidth={
                            isActive ? 2.3 : 1.8
                          }
                        />
                      </div>

                      <span className="flex-1">
                        {item.label}
                      </span>

                      {isActive && (
                        <ChevronRight
                          size={15}
                          className="text-[#C6A15B]"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              )
            })}
          </div>
        </nav>

        {/* -------------------------------------------------------
            BOTTOM AREA
        -------------------------------------------------------- */}

        <div className="shrink-0 border-t border-white/10 p-3">

          {/* Profile — clickable */}
          <button
            type="button"
            onClick={() => {
              navigate('/admin/profile')
              setOpen(false)
            }}
            className="
              mb-2 flex w-full items-center gap-3
              rounded-2xl
              border border-white/[0.06]
              bg-black/10
              p-3
              text-left
              transition-all duration-200
              hover:bg-white/[0.08]
              hover:border-white/[0.12]
            "
          >
            <div
              className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-xl
                bg-[#C6A15B]/15
                text-[#E4C77E]
              "
            >
              <span className="text-xs font-bold">
                {adminInitial}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">
                {admin?.name || 'Admin'}
              </p>

              <p className="mt-1 truncate text-[10px] text-white/35">
                {admin?.email || 'Administrator'}
              </p>
            </div>

            <UserCog size={14} className="shrink-0 text-white/30" />
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="
              flex w-full items-center gap-3
              rounded-2xl px-3.5 py-3
              text-sm font-medium
              text-white/55
              transition-all duration-200
              hover:bg-white/[0.07]
              hover:text-white
            "
          >
            <div
              className="
                flex h-9 w-9
                items-center justify-center
                rounded-xl
                bg-white/[0.05]
              "
            >
              <LogOut size={17} />
            </div>

            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* =========================================================
          MOBILE OVERLAY
      ========================================================== */}

      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="
            fixed inset-0 z-50
            bg-[#211B19]/45
            backdrop-blur-sm
            lg:hidden
          "
          onClick={() => setOpen(false)}
        />
      )}

      {/* =========================================================
          MAIN
      ========================================================== */}

      <div className="flex min-w-0 flex-1 flex-col">

        {/* =======================================================
            TOP HEADER
        ======================================================== */}

        <header
          className="
            relative z-30
            flex h-[72px] shrink-0
            items-center justify-between
            border-b border-[#E7E3DF]
            bg-white/90
            px-4
            backdrop-blur-xl
            sm:px-6
            lg:px-8
          "
        >

          {/* Left */}
          <div className="flex min-w-0 items-center gap-3">

            {/* Mobile menu */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="
                flex h-10 w-10
                items-center justify-center
                rounded-xl
                border border-[#E7E3DF]
                bg-white
                text-[#42151F]
                shadow-sm
                transition
                hover:bg-[#F7F3ED]
                lg:hidden
              "
              aria-label="Open menu"
            >
              <Menu size={19} />
            </button>

            {/* Breadcrumb */}
            <div className="flex min-w-0 items-center gap-2">

              <span className="hidden text-xs font-medium text-[#A09A96] sm:block">
                Triveni Bhavan
              </span>

              <ChevronRight
                size={14}
                className="hidden text-[#C9C3BF] sm:block"
              />

              <span className="truncate text-sm font-semibold text-[#211B19]">
                {pageTitle}
              </span>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">

            {/* Desktop profile */}
            <button
              type="button"
              onClick={() => navigate('/admin/profile')}
              className="hidden text-right transition-opacity hover:opacity-80 sm:block"
            >
              <p className="text-xs font-semibold text-[#211B19]">
                {admin?.name || 'Admin'}
              </p>

              <p className="mt-1 text-[10px] text-[#99928D]">
                Administrator
              </p>
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin/profile')}
              className="
                flex h-10 w-10
                items-center justify-center
                rounded-xl
                border border-[#C6A15B]/20
                bg-[#F7F3ED]
                transition-all duration-200
                hover:border-[#C6A15B]/40
                hover:shadow-sm
              "
              aria-label="My Profile"
            >
              <span className="text-xs font-bold text-[#42151F]">
                {adminInitial}
              </span>
            </button>
          </div>
        </header>

        {/* =======================================================
            PAGE CONTENT
        ======================================================== */}

        <main
          className="
            min-h-0 flex-1
            overflow-y-auto
            bg-[#F6F5F2]
          "
        >
          <div
            className="
              min-h-full
              p-4
              sm:p-6
              lg:p-8
              xl:p-10
            "
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}