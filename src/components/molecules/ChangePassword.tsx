import { Button, TextInput } from '@8thday/react'
import { ClockIcon } from '@heroicons/react/24/outline'
import { useChangePassword, ChangePasswordHookResult } from '@nhost/react'
import React, { ComponentProps, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export interface ChangePasswordProps extends ComponentProps<'div'> {}

export const ChangePassword = ({ className = '', ...props }: ChangePasswordProps) => {
  const ref = useRef<HTMLInputElement>(null)
  const [newPassword, setNewPassword] = useState('')

  const { changePassword, error, isError, isSuccess, isLoading } = useChangePassword() as ChangePasswordHookResult & {
    isLoading: boolean
  }

  const goTo = useNavigate()

  useEffect(() => {
    if (ref.current) {
      ref.current.focus()
    }
  }, [])

  return (
    <div className={`${className} p-4 fixed inset-0 z-50 bg-white/80 flex-center`} {...props}>
      <form
        className="max-w-full min-w-md p-4 space-y-4 shadow-xl rounded-md"
        onSubmit={async (e) => {
          e.preventDefault()
          e.stopPropagation()

          if (newPassword) {
            await changePassword(newPassword)
          }
        }}
      >
        <h3>Change your password</h3>
        <TextInput
          ref={ref}
          label="New Password"
          type="password"
          errorMessage={isError && error?.message}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <div className="flex space-x-4">
          <Button
            PostIcon={isLoading ? ClockIcon : undefined}
            spin
            variant="primary"
            disabled={!newPassword}
            type="submit"
          >
            Save
          </Button>
          <Button variant="dismissive" onClick={() => goTo('..')}>
            Cancel
          </Button>
        </div>
        {isSuccess && <p className="text-green-500">Password successfully changed!</p>}
      </form>
    </div>
  )
}
