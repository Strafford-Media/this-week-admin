import { Button } from '@8thday/react'
import { useSendVerificationEmail, useUserData } from '@nhost/react'
import React, { ComponentProps } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Badge } from '../atoms/Badge'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { capitalize } from '../../utils/general'
import { toast } from '../../utils/toasts'

export interface ProfileProps extends ComponentProps<'div'> {}

export const Profile = ({ className = '', ...props }: ProfileProps) => {
  const user = useUserData()

  const { sendEmail } = useSendVerificationEmail()

  const goTo = useNavigate()

  if (!user) return null

  return (
    <div className={`${className}`} {...props}>
      <div className="flex sm:flex-row flex-col p-2 gap-2">
        <div className="h-36 self-center aspect-square">
          <img src={user.avatarUrl} alt="profile gravatar" className="h-full w-full rounded-lg" />
        </div>
        <div className="flex flex-col justify-between self-stretch">
          <h3 className="flex-center">
            {user.displayName}
            <Badge className="ml-2" color="primary" shadow size="large">
              {capitalize(user.defaultRole)}
            </Badge>
          </h3>
          <div className="flex flex-col mt-8 sm:mt-0 p-2 sm:p-0">
            <span className="text-gray-400 text-sm">
              Email address
              {user.emailVerified ? (
                <Badge className="ml-2" color="green">
                  Verified
                  <CheckCircleIcon className="h-4 w-4 -mr-2 ml-1" />
                </Badge>
              ) : (
                <Badge
                  onClick={async () => {
                    if (user.email) {
                      const sent = await sendEmail(user.email)

                      if (sent.isSent) {
                        toast.success({ message: 'Verification email sent!' })
                      } else if (sent.error) {
                        toast.error({ message: 'Problem sending email', description: sent.error.message })
                      }
                    }
                  }}
                  role="button"
                  shadow
                  className="ml-2"
                  color="red"
                >
                  Unverified
                  <XCircleIcon className="h-4 w-4 -mr-2 ml-1" />
                </Badge>
              )}
            </span>
            <span>{user.email}</span>
          </div>
          <Button
            className="self-start"
            onClick={() => {
              goTo('change-password')
            }}
          >
            Change Password
          </Button>
        </div>
      </div>
      <Outlet />
    </div>
  )
}
