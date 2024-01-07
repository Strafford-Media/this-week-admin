import React, { ReactNode } from 'react'
import { BuildingStorefrontIcon, MegaphoneIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { NavLink, Outlet, useSearchParams } from 'react-router-dom'
import { useAuthenticationStatus } from '@nhost/react'
import { LoginScreen } from './components/molecules/LoginScreen'
import { LoadingScreen } from './components/molecules/LoadingScreen'
import { IconType, Modal } from '@8thday/react'
import { CategoryManager } from './components/molecules/CategoryManager'

export const App = () => {
  const { isAuthenticated, isLoading } = useAuthenticationStatus()
  const [searchParams, setSearchParams] = useSearchParams()

  const manageCategories = !!searchParams.get('manage-categories')

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <LoginScreen />
  }

  return (
    <>
      <main className={`max-w-screen flex h-content flex-col pb-16 sm:pb-0 sm:pt-16`}>
        <Outlet />
        {manageCategories && (
          <Modal onClose={() => setSearchParams((s) => (s.delete('manage-categories'), s))}>
            <CategoryManager />
          </Modal>
        )}
      </main>
      <nav className="max-w-screen fixed bottom-0 z-40 flex h-16 w-full items-stretch justify-evenly bg-primary-50 transition-all duration-300 [view-transition-name:header-nav] sm:top-0 sm:justify-end">
        <h1 className="mr-auto hidden items-center p-2 text-center text-lg font-bold leading-4 text-primary-500 sm:flex md:p-4 md:text-xl">
          This Week Admin
        </h1>
        <TWHNavLink to="/ads" icon={MegaphoneIcon} label="Ads" />
        <TWHNavLink to="/listings" icon={BuildingStorefrontIcon} label="Listings" />
        <TWHNavLink to="/profile" icon={UserCircleIcon} label="Profile" />
      </nav>
    </>
  )
}

interface TWHNavLinkProps {
  to: string
  className?: string
  icon?: IconType
  label: ReactNode
}

const TWHNavLink = ({ label, icon: Icon, className = '', to }: TWHNavLinkProps) => (
  <NavLink
    className={({ isActive }) =>
      clsx(
        `flex-center grow flex-col whitespace-nowrap text-primary-400 transition-all duration-300 focus:outline-none sm:grow-0 sm:flex-row sm:px-4`,
        className,
        isActive ? 'bg-primary-200 text-primary-600' : 'hover:bg-primary-100 focus:bg-primary-100',
      )
    }
    to={to}
  >
    {Icon && <Icon className="h-8 w-8" />}
    <span className="text-[11px] sm:ml-2 sm:text-sm md:text-base">{label}</span>
  </NavLink>
)
