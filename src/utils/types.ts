import HomeIcon from '@heroicons/react/24/outline/HomeIcon'
import { Visitor_Answer, Visitor_Question } from '../gql/graphql'

declare global {
  interface Set<T> {
    union(other: Set<T>): Set<T>
    intersection(other: Set<T>): Set<T>
    difference(other: Set<T>): Set<T>
    symmetricDifference(other: Set<T>): Set<T>
    isSubsetOf(other: Set<T>): boolean
    isSupersetOf(other: Set<T>): boolean
    isDisjointFrom(other: Set<T>): boolean
  }
}

declare module '@8thday/react' {
  interface ButtonVariants {
    'destructive-outline': string
    'secondary-outline': string
    'secondary-amber-outline': string
  }
}

export type IconType = typeof HomeIcon

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[] ? DeepPartial<U>[] : T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export interface BookingLink {
  type: 'affiliate' | 'direct'
  provider: 'fareharbor'
  companyName: string
  items: string[]
}

export interface TextQuestion extends Partial<Visitor_Question> {
  id: number
  label: string
  question_type: 'text'
  active: boolean
  metadata: TextMetadata
}

export interface NumberQuestion extends Partial<Visitor_Question> {
  id: number
  label: string
  question_type: 'number'
  active: boolean
  metadata: NumberMetadata
}

export interface CheckboxQuestion extends Partial<Visitor_Question> {
  id: number
  label: string
  question_type: 'checkbox'
  active: boolean
  metadata: CheckboxMetadata
}

export interface ChoiceQuestion extends Partial<Visitor_Question> {
  id: number
  label: string
  question_type: 'choice'
  active: boolean
  metadata: ChoiceMetadata
}

export type ValidatedVisitorQuestion = TextQuestion | NumberQuestion | CheckboxQuestion | ChoiceQuestion

export interface TextAnswer extends Partial<Visitor_Answer> {
  id: number
  question_id: number
  answer: {
    rawAnswer: string
    questionType: 'text'
    originalLabel: string
  }
}

export interface NumberAnswer extends Partial<Visitor_Answer> {
  id: number
  question_id: number
  answer: {
    rawAnswer: string
    questionType: 'number'
    originalLabel: string
  }
}

export interface CheckboxAnswer extends Partial<Visitor_Answer> {
  id: number
  question_id: number
  answer: {
    rawAnswer: boolean
    questionType: 'checkbox'
    originalLabel: string
  }
}

export interface ChoiceAnswer extends Partial<Visitor_Answer> {
  id: number
  question_id: number
  answer: {
    rawAnswer: string[]
    questionType: 'choice'
    originalLabel: string
  }
}

export type ValidatedVisitorAnswer = TextAnswer | NumberAnswer | CheckboxAnswer | ChoiceAnswer

export interface DefaultMetadata {
  required?: boolean
  description?: string
}

export interface TextMetadata extends DefaultMetadata {
  defaultValue?: string
  longform?: boolean
  placeholder?: string
}

export interface NumberMetadata extends DefaultMetadata {
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  placeholder?: string | number
}

export interface ChoiceMetadata extends DefaultMetadata {
  choices: { label: string; defaultChecked: boolean }[]
  multiple?: boolean
}

export interface CheckboxMetadata extends DefaultMetadata {
  defaultValue?: boolean
}
