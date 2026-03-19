import { useAuthQuery } from '@nhost/react-apollo'
import { ComponentProps, useState } from 'react'
import { VISITORS } from '../../graphql'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '../atoms/Badge'
import { displayUserRole } from '../../utils/general'
import { Modal } from '@8thday/react'
import { VisitorAnswersByUserFetched } from './VisitorAnswerFetched'
import { Users } from '../../gql/graphql'

export interface VisitorListProps extends ComponentProps<'div'> {}

export const VisitorList = ({ className = '', ...props }: VisitorListProps) => {
  const { data } = useAuthQuery(VISITORS)

  const [showAnswersForUser, setShowAnswersForUser] = useState<Partial<Users> | null>(null)

  return (
    <div className={`${className}`} {...props}>
      <ul>
        {data?.users.map((u) => (
          <li key={u.id} className="m-2 rounded border p-2 shadow-sm">
            <p className="flex justify-between text-sm font-semibold">
              {u.displayName}
              <Badge className="ml-2" color={u.defaultRole === 'user' ? 'secondary' : 'primary'} shadow size="small">
                {displayUserRole(u.defaultRole)}
              </Badge>
            </p>
            <div className="flex items-end justify-between">
              <em className="text-xs font-light">{u.email}</em>
              <em className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(u.lastSeen), { addSuffix: true })}
              </em>
            </div>
            <button
              className="text-xs text-primary-400 hover:text-primary-500 focus:underline focus:outline-none"
              onClick={() => setShowAnswersForUser(u)}
            >
              Survey Responses
            </button>
          </li>
        ))}
        {showAnswersForUser && (
          <Modal onClose={() => setShowAnswersForUser(null)}>
            <VisitorAnswersByUserFetched key={showAnswersForUser?.id} user={showAnswersForUser} />
          </Modal>
        )}
      </ul>
    </div>
  )
}
