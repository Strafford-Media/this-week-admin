import React, { ComponentProps } from 'react'
import { Visitor_Answer } from '../../gql/graphql'
import {
  CheckboxAnswer,
  CheckboxQuestion,
  ChoiceAnswer,
  ChoiceQuestion,
  NumberAnswer,
  NumberQuestion,
  TextAnswer,
  TextQuestion,
  ValidatedVisitorQuestion,
} from '../../utils/types'
import { validateAnswer } from '../../utils/registration-questions'
import { CheckIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { formatDate } from '../../utils/general'

export interface VisitorAnswerDisplayProps extends ComponentProps<'div'> {
  answer: Partial<Visitor_Answer>
  question: ValidatedVisitorQuestion
  userMapping?: Record<string, string>
  hideLabel?: boolean
}

export const VisitorAnswerDisplay = ({ answer, question, ...props }: VisitorAnswerDisplayProps) => {
  const validatedAnswer = validateAnswer(answer)

  if (!validatedAnswer) return null

  switch (validatedAnswer.answer.questionType) {
    case 'text':
      return <TextAnswerDisplay answer={answer as TextAnswer} question={question as TextQuestion} {...props} />
    case 'number':
      return <NumberAnswerDisplay answer={answer as NumberAnswer} question={question as NumberQuestion} {...props} />
    case 'checkbox':
      return (
        <CheckboxAnswerDisplay answer={answer as CheckboxAnswer} question={question as CheckboxQuestion} {...props} />
      )
    case 'choice':
      return <ChoiceAnswerDisplay answer={answer as ChoiceAnswer} question={question as ChoiceQuestion} {...props} />
  }
}

export interface TextAnswerDisplayProps extends VisitorAnswerDisplayProps {
  answer: TextAnswer
  question: TextQuestion
}

export const TextAnswerDisplay = ({
  className = '',
  answer,
  question,
  userMapping,
  hideLabel = false,
  ...props
}: TextAnswerDisplayProps) => {
  return (
    <div className={`${className}`} {...props}>
      <AnswerMetadataDisplay
        created_at={answer.created_at}
        label={question.label}
        originalLabel={answer.answer.originalLabel}
        hideLabel={hideLabel}
        userDisplayName={userMapping?.[answer.user_id]}
      />
      <p>{answer.answer.rawAnswer}</p>
    </div>
  )
}

export interface NumberAnswerDisplayProps extends VisitorAnswerDisplayProps {
  answer: NumberAnswer
  question: NumberQuestion
}

export const NumberAnswerDisplay = ({
  className = '',
  answer,
  question,
  userMapping,
  hideLabel = false,
  ...props
}: NumberAnswerDisplayProps) => {
  return (
    <div className={`${className}`} {...props}>
      <AnswerMetadataDisplay
        created_at={answer.created_at}
        label={question.label}
        originalLabel={answer.answer.originalLabel}
        hideLabel={hideLabel}
        userDisplayName={userMapping?.[answer.user_id]}
      />
      <p className="text-lg">{answer.answer.rawAnswer}</p>
    </div>
  )
}

export interface CheckboxAnswerDisplayProps extends VisitorAnswerDisplayProps {
  answer: CheckboxAnswer
  question: CheckboxQuestion
}

export const CheckboxAnswerDisplay = ({
  className = '',
  answer,
  question,
  userMapping,
  hideLabel = false,
  ...props
}: CheckboxAnswerDisplayProps) => {
  return (
    <div className={`${className}`} {...props}>
      <AnswerMetadataDisplay
        created_at={answer.created_at}
        label={question.label}
        originalLabel={answer.answer.originalLabel}
        hideLabel={hideLabel}
        userDisplayName={userMapping?.[answer.user_id]}
      />
      <p className="text-lg">{answer.answer.rawAnswer ? 'Yes' : 'No'}</p>
    </div>
  )
}

export interface ChoiceAnswerDisplayProps extends VisitorAnswerDisplayProps {
  answer: ChoiceAnswer
  question: ChoiceQuestion
}

export const ChoiceAnswerDisplay = ({
  className = '',
  answer,
  question,
  userMapping,
  hideLabel = false,
  ...props
}: ChoiceAnswerDisplayProps) => {
  const choicesSet = new Set(question.metadata.choices.map((c) => c.label))
  const answerSet = new Set(answer.answer.rawAnswer)

  const outdatedAnswers = answerSet.difference(choicesSet)

  return (
    <div className={`${className}`} {...props}>
      <AnswerMetadataDisplay
        created_at={answer.created_at}
        label={question.label}
        originalLabel={answer.answer.originalLabel}
        hideLabel={hideLabel}
        userDisplayName={userMapping?.[answer.user_id]}
      />
      <div className="flex flex-wrap items-start justify-between gap-2">
        {question.metadata.choices.map((choice) => (
          <div className="flex-center flex-col">
            <label>{choice.label}</label>
            <div
              className={clsx(
                'h-5 w-5 rounded-sm border-2 p-px text-primary-500',
                answerSet.has(choice.label) && 'border-primary-400',
              )}
            >
              {answerSet.has(choice.label) && <CheckIcon />}
            </div>
          </div>
        ))}
        {[...outdatedAnswers].map((outdatedLabel) => (
          <div className="flex-center flex-col opacity-50">
            <label>{outdatedLabel}</label>
            <div className="h-5 w-5 rounded-sm border-2 p-px">
              <CheckIcon />
            </div>
            <span className="text-[10px] italic text-gray-500">Outdated</span>
          </div>
        ))}
      </div>
    </div>
  )
}

interface AnswerMetadataDisplayProps {
  created_at?: string
  hideLabel?: boolean
  label?: string
  originalLabel?: string
  userDisplayName?: string
}
const AnswerMetadataDisplay = ({
  created_at,
  hideLabel = false,
  label,
  originalLabel,
  userDisplayName,
}: AnswerMetadataDisplayProps) => {
  return (
    <>
      {!hideLabel && <label className="text-gray-600">{label}</label>}
      {(userDisplayName || created_at) && (
        <p className="flex text-xs text-gray-800">
          {userDisplayName && <strong>{userDisplayName}</strong>}
          {created_at && <em className="ml-auto">{formatDate(created_at)}</em>}
        </p>
      )}
      {label !== originalLabel && originalLabel && (
        <p className="mb-2 text-xs text-gray-400">
          <em>
            <strong>Original Question: </strong>"{originalLabel}"
          </em>
        </p>
      )}
    </>
  )
}
