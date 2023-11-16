import { ArrowPathIcon, CheckIcon, FaceFrownIcon, RocketLaunchIcon } from '@heroicons/react/24/outline'
import { useResetPassword, useSignInEmailPassword } from '@nhost/react'
import React, { useRef, useState } from 'react'
import { Button } from '@8thday/react'

export const LoginScreen = () => {
  const emailRef = useRef<HTMLInputElement>(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [missingEmail, setMissingEmail] = useState(false)

  const { signInEmailPassword, isSuccess, isError, isLoading, error } = useSignInEmailPassword()

  const { error: resetError, resetPassword } = useResetPassword()

  return (
    <main className="h-screen bg-gray-50">
      <div className="flex min-h-full flex-col justify-center py-6 sm:py-12 sm:px-6 lg:px-8">
        <div className="mx-1 sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-primary-800">
            Sign in to your account
          </h2>
          <div className="py-8 px-4">
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()

                if (email && password) {
                  signInEmailPassword(email, password)
                }
              }}
            >
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    ref={emailRef}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                    value={email}
                    onChange={(e) => {
                      if (missingEmail) {
                        setMissingEmail(false)
                      }

                      setEmail(e.target.value)
                    }}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center">
                <div className="text-sm">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!email) {
                        emailRef.current?.focus()
                        setMissingEmail(true)
                      } else {
                        setMissingEmail(false)
                        resetPassword(email, { redirectTo: '/profile/change-password' })
                      }
                    }}
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    Forgot your password?
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={!email || !password}
                spin={isLoading}
                PostIcon={
                  isLoading ? ArrowPathIcon : isSuccess ? CheckIcon : isError ? FaceFrownIcon : RocketLaunchIcon
                }
              >
                Sign in
              </Button>
              {isError && (
                <p className="text-red-600 mt-4">
                  {error?.message ||
                    'There was a problem logging you in. Please try again or use the "forgot password" option.'}
                </p>
              )}
              {resetError && (
                <p className="text-red-600 mt-4">
                  {resetError.message ||
                    'There was a problem sending the reset password link. Please email 8thdaydev@gmail.com for support.'}
                </p>
              )}
              {isSuccess && <p className="text-emerald-500 mt-4">You're in!</p>}
              {missingEmail && <p className="text-gray-600 mt-4">Please enter your email and try again.</p>}
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
