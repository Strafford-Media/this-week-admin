import { useAuthQuery } from '@nhost/react-apollo'
import React, { ComponentProps } from 'react'
import { VISITOR_QUESTION_WITH_ANSWERS, VISITORS } from '../../graphql'
import { VisitorAnswerDisplay } from './VisitorAnswers'
import { parseQuestionMetadata } from '../../utils/registration-questions'

export interface VisitorAnswersByQuestionFetchedProps extends ComponentProps<'div'> {
  questionId: number
}

export const VisitorAnswersByQuestionFetched = ({
  className = '',
  questionId,
  ...props
}: VisitorAnswersByQuestionFetchedProps) => {
  const { data } = useAuthQuery(VISITOR_QUESTION_WITH_ANSWERS, { variables: { questionId } })

  const { data: visitorData } = useAuthQuery(VISITORS)

  const userMapping = visitorData?.users.reduce<Record<string, string>>(
    (map, user) => ({ ...map, [user.id]: user.displayName ?? user.email }),
    {},
  )

  if (!data?.visitor_question_by_pk) return null

  const validQuestion = parseQuestionMetadata(data.visitor_question_by_pk)

  if (!validQuestion) return null

  const answers = data?.visitor_question_by_pk?.visitor_answers ?? []

  return (
    <div className={`${className}`} {...props}>
      <h2 className="mb-2 font-normal">Survey Responses for</h2>
      <h3 className="mb-4 text-primary-700">"{data?.visitor_question_by_pk?.label}"</h3>
      <ul className="flex flex-col">
        {answers.map((va) => (
          <li className="p-2 even:bg-gray-50">
            <VisitorAnswerDisplay answer={va} question={validQuestion} hideLabel userMapping={userMapping} />
          </li>
        ))}
        {!answers.length && (
          <p className="text-center text-gray-500">
            <em>No answers provided yet.</em>
          </p>
        )}
      </ul>
    </div>
  )
}
