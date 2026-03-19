import { Button } from '@8thday/react'
import { useSendVerificationEmail, useSignOut, useUserData } from '@nhost/react'
import { ComponentProps } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Badge } from '../atoms/Badge'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { displayUserRole } from '../../utils/general'
import { toast } from '../../utils/toasts'

export interface ProfileProps extends ComponentProps<'div'> {}

export const Profile = ({ className = '', ...props }: ProfileProps) => {
  const user = useUserData()

  const { sendEmail } = useSendVerificationEmail()
  const { signOut } = useSignOut()

  const goTo = useNavigate()

  if (!user) return null

  return (
    <div className={`${className}`} {...props}>
      <div className="flex flex-col gap-2 p-2 sm:flex-row">
        <div className="aspect-square h-36 self-center">
          <img
            src={user.avatarUrl?.includes('gravatar.com') ? `${user.avatarUrl}&s=500` : user.avatarUrl}
            alt="profile gravatar"
            className="h-full w-full rounded-lg"
          />
        </div>
        <div className="flex flex-col justify-between self-stretch">
          <h3 className="flex-center">
            {user.displayName}
            <Badge className="ml-2" color="primary" shadow size="large">
              {displayUserRole(user.defaultRole)}
            </Badge>
          </h3>
          <div className="mt-8 flex flex-col p-2 sm:mt-0 sm:p-0">
            <span className="text-sm text-gray-400">
              Email address
              {user.emailVerified ? (
                <Badge className="ml-2" color="green">
                  Verified
                  <CheckCircleIcon className="-mr-2 ml-1 h-4 w-4" />
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
                  <XCircleIcon className="-mr-2 ml-1 h-4 w-4" />
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
          <Button
            variant="dismissive"
            className="self-start"
            onClick={() => {
              signOut()
            }}
          >
            Sign Out
          </Button>
        </div>
      </div>
      <Outlet />
    </div>
  )
}
