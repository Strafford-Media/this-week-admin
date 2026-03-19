import { Button } from '@8thday/react'
import { useNhostClient, useSendVerificationEmail, useSignOut, useUserData } from '@nhost/react'
import { ComponentProps } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Badge } from '../atoms/Badge'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { displayUserRole } from '../../utils/general'
import { toast } from '../../utils/toasts'
import { UPDATE_USER_METADATA } from '../../graphql/mutations'

export interface ProfileProps extends ComponentProps<'div'> {}

export const Profile = ({ className = '', ...props }: ProfileProps) => {
  const nhost = useNhostClient()
  const user = useUserData()

  const { sendEmail } = useSendVerificationEmail()
  const { signOut } = useSignOut()

  const goTo = useNavigate()

  if (!user) return null

  return (
    <div className={`${className} flex h-contentD flex-col items-center gap-y-8 pt-8`} {...props}>
      <div className="flex flex-col items-center gap-4 p-2">
        <div className="aspect-square h-36">
          <img
            src={user.avatarUrl?.includes('gravatar.com') ? `${user.avatarUrl}&s=500` : user.avatarUrl}
            alt="profile gravatar"
            className="h-full w-full rounded-lg"
          />
        </div>
        <h3
          className="-mb-3 cursor-pointer"
          onClick={async () => {
            const newName = prompt('Change your username:')

            if (newName) {
              await nhost.graphql.request(UPDATE_USER_METADATA, { id: user.id, metadata: {}, displayName: newName })
              nhost.auth.refreshSession()
            }
          }}
        >
          {user.displayName}
        </h3>
        <Badge color="primary" shadow size="large">
          {displayUserRole(user.defaultRole)}
        </Badge>
        <div className="flex flex-col p-2 sm:p-0">
          <span className="inline-flex text-sm text-gray-400">
            Email address
            {user.emailVerified ? (
              <Badge className="ml-auto" color="green">
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
      </div>
      <div className="flex gap-x-4">
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
      <Outlet />
    </div>
  )
}
