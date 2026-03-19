import React, { ComponentProps, Fragment } from 'react'
import { VisitorAnswerDisplay } from './VisitorAnswers'
import { useAuthQuery } from '@nhost/react-apollo'
import { REGISTRATION_QUESTIONS, VISITOR_ANSWERS_BY_USER_ID } from '../../graphql'
import { parseQuestionMetadata } from '../../utils/registration-questions'
import { ValidatedVisitorQuestion } from '../../utils/types'
import { Users } from '../../gql/graphql'

export interface VisitorAnswerFetchedProps extends ComponentProps<'div'> {
  user: Partial<Users>
}

export const VisitorAnswersByUserFetched = ({ className = '', user, ...props }: VisitorAnswerFetchedProps) => {
  const { data: questionData } = useAuthQuery(REGISTRATION_QUESTIONS, { fetchPolicy: 'cache-first' })

  const questionMap =
    questionData?.visitor_question.reduce<Record<number, ValidatedVisitorQuestion>>((m, q) => {
      const validatedQuestion = parseQuestionMetadata(q)
      if (!validatedQuestion) return m
      return { ...m, [q.id]: validatedQuestion }
    }, {}) ?? {}

  const { data: answerData } = useAuthQuery(VISITOR_ANSWERS_BY_USER_ID, {
    variables: { userId: user?.id },
    skip: !user?.id,
    fetchPolicy: 'cache-and-network',
  })

  const answerList = answerData?.visitor_answer.filter((a) => questionMap[a.question_id]) ?? []

  if (!user?.id) return null

  return (
    <div className={`${className} flex flex-col`} {...props}>
      <h3>Survey Responses</h3>
      <p className="mb-4 text-sm text-gray-600">
        From <strong>{user.displayName || user.email}</strong> {user.displayName && `(${user.email})`}
      </p>
      {answerList.map((answer, i) => (
        <Fragment key={answer.id}>
          {i !== 0 && <hr className="my-2" />}
          <VisitorAnswerDisplay answer={answer} question={questionMap[answer.question_id]} />
        </Fragment>
      ))}
      {!answerList.length && <p className="my-8 text-center italic text-gray-500">No responses provided yet.</p>}
    </div>
  )
}
