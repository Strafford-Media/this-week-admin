import { useAuthQuery } from '@nhost/react-apollo'
import React, { ComponentProps } from 'react'
import { ALL_ANSWERS, REGISTRATION_QUESTIONS, VISITORS } from '../../graphql'
import { validateAnswer } from '../../utils/registration-questions'
import clsx from 'clsx'
import { Button } from '@8thday/react'
import { downloadTableAsCsv } from '../../utils/general'

const thClass = 'border bg-gray-100 sticky top-0 z-10 font-medium p-2 text-gray-400 text-left'
const tdClass = 'border border-gray-200 p-2 text-gray-500'

export interface SurveyResponseGridProps extends ComponentProps<'div'> {}

export const SurveyResponseGrid = ({ className = '', ...props }: SurveyResponseGridProps) => {
  const { data: answerData } = useAuthQuery(ALL_ANSWERS)
  const { data: questionData } = useAuthQuery(REGISTRATION_QUESTIONS)
  const { data: visitorData } = useAuthQuery(VISITORS)

  const activeQuestions = questionData?.visitor_question.filter((q) => q.active) ?? []
  const inactiveQuestions = questionData?.visitor_question.filter((q) => !q.active) ?? []

  const answerMapping = answerData?.visitor_answer.reduce<
    Record<string, Record<number, (typeof answerData.visitor_answer)[number]>>
  >((m, a) => {
    m[a.user_id] ??= {}
    m[a.user_id][a.question_id] = a
    return m
  }, {})

  return (
    <div className={`${className} flex max-h-contentD flex-col gap-y-2 p-4`} {...props}>
      <div className="flex shrink-0 justify-between">
        <h2>Survey Responses</h2>
        <Button
          onClick={() => {
            downloadTableAsCsv('survey_responses')
          }}
        >
          Export CSV
        </Button>
      </div>
      <div className="grow overflow-auto">
        <table id="survey_responses" className="table-auto border-collapse text-sm">
          <thead>
            <tr>
              <th className={thClass}>Name</th>
              <th className={thClass}>Email</th>
              {activeQuestions.map((q) => (
                <th key={q.id} className={clsx(thClass, 'min-w-24 max-w-48')}>
                  {q.label}
                </th>
              ))}
              {inactiveQuestions.map((q) => (
                <th key={q.id} className={clsx(thClass, 'min-w-24 max-w-48')}>
                  (Inactive) {q.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {visitorData?.users.map(
              (u) =>
                answerMapping?.[u.id] && (
                  <tr key={u.id}>
                    <td className={tdClass}>{u.displayName}</td>
                    <td className={tdClass}>{u.email}</td>
                    {activeQuestions.map((q) => {
                      const answer = validateAnswer(answerMapping?.[u.id]?.[q.id])

                      return (
                        <td key={q.id} className={tdClass}>
                          {answer?.answer?.rawAnswer?.toString?.()}
                        </td>
                      )
                    })}
                    {inactiveQuestions.map((q) => {
                      const answer = validateAnswer(answerMapping?.[u.id]?.[q.id])

                      return (
                        <td key={q.id} className={tdClass}>
                          {answer?.answer?.rawAnswer?.toString?.()}
                        </td>
                      )
                    })}
                  </tr>
                ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
