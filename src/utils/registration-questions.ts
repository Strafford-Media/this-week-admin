import { Visitor_Answer, Visitor_Question } from '../gql/graphql'
import { safeClone } from './general'
import {
  CheckboxAnswer,
  ChoiceAnswer,
  NumberAnswer,
  TextAnswer,
  ValidatedVisitorAnswer,
  ValidatedVisitorQuestion,
} from './types'

export const parseQuestionMetadata = (
  vRaw: Partial<Omit<Visitor_Question, 'visitor_answers_aggregate' | 'visitor_answers'>>,
): ValidatedVisitorQuestion | null | undefined => {
  if (!vRaw || !vRaw.question_type || !vRaw.id) return null

  const [err, v] = safeClone<ValidatedVisitorQuestion>(vRaw)

  if (err || !v) return null

  if (v.metadata?.required != null && typeof v.metadata.required !== 'boolean') {
    v.metadata.required = false
  }

  if (v.metadata?.description != null && typeof v.metadata.description !== 'string') {
    v.metadata.description = undefined
  }

  switch (v.question_type) {
    case 'text':
      v.metadata ??= {}

      if (v.metadata.defaultValue != null && typeof v.metadata.defaultValue !== 'string') {
        v.metadata.defaultValue = undefined
      }

      if (v.metadata.longform != null && typeof v.metadata.longform !== 'boolean') {
        v.metadata.longform = false
      }

      if (v.metadata.placeholder != null && typeof v.metadata.placeholder !== 'string') {
        v.metadata.placeholder = undefined
      }

      return v
    case 'number':
      v.metadata ||= {}

      if (v.metadata.defaultValue != null && typeof v.metadata.defaultValue !== 'number') {
        v.metadata.defaultValue = undefined
      }

      if (v.metadata.min != null && typeof v.metadata.min !== 'number') {
        v.metadata.min = undefined
      }

      if (v.metadata.max != null && typeof v.metadata.max !== 'number') {
        v.metadata.max = undefined
      }

      if (v.metadata.step != null && typeof v.metadata.step !== 'number') {
        v.metadata.step = undefined
      }

      if (v.metadata.placeholder != null && !['number', 'string'].includes(typeof v.metadata.placeholder)) {
        v.metadata.placeholder = undefined
      }

      return v
    case 'checkbox':
      v.metadata ||= {}

      if (v.metadata.defaultValue != null && typeof v.metadata.defaultValue !== 'boolean') {
        v.metadata.defaultValue = false
      }

      return v
    case 'choice':
      if (!v.metadata) {
        v.metadata = { choices: [] }
      }

      if (
        !Array.isArray(v.metadata.choices) ||
        v.metadata.choices.some((c: { label: string }) => typeof c?.label !== 'string')
      ) {
        v.metadata.choices = []
      }

      if (v.metadata.multiple != null && typeof v.metadata.multiple !== 'boolean') {
        v.metadata.multiple = false
      }

      return v
  }
}

export const validateAnswer = (answer?: Partial<Visitor_Answer>): ValidatedVisitorAnswer | null => {
  if (!answer?.answer || !['text', 'number', 'checkbox', 'choice'].includes(answer.answer.questionType)) return null

  switch (answer.answer.questionType) {
    case 'text':
      if (typeof answer.answer.rawAnswer !== 'string') return null
      return answer as TextAnswer
    case 'number':
      if (typeof answer.answer.rawAnswer !== 'string') return null
      return answer as NumberAnswer
    case 'checkbox':
      if (typeof answer.answer.rawAnswer !== 'boolean') return null
      return answer as CheckboxAnswer
    case 'choice':
      if (!Array.isArray(answer.answer.rawAnswer) || answer.answer.rawAnswer.some((a: string) => typeof a !== 'string'))
        return null
      return answer as ChoiceAnswer
    default:
      return null
  }
}
