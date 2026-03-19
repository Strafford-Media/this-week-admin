import React, { ComponentProps, SetStateAction } from 'react'
import { Visitor_Question } from '../../gql/graphql'
import { parseQuestionMetadata } from '../../utils/registration-questions'
import { CheckboxQuestion, ChoiceQuestion, NumberQuestion, TextQuestion } from '../../utils/types'
import { Button, Checkbox, TextInput, toast } from '@8thday/react'
import { useEditableVisitorQuestion } from '../../hooks/useEditableVisitorQuestion'
import clsx from 'clsx'
import { nonNumericInputsRegex } from '../../utils/general'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useNhostClient } from '@nhost/react'
import { DELETE_VISITOR_QUESTION } from '../../graphql'
import { ViewAnswersButton } from './ViewAnswersButton'

export interface VisitorQuestionProps extends ComponentProps<'div'> {
  question: Partial<Omit<Visitor_Question, 'visitor_answers_aggregate'>>
  refetch?(): any
}

export const VisitorQuestion = ({ className = '', question: questionRaw, refetch, ...props }: VisitorQuestionProps) => {
  const question = parseQuestionMetadata(questionRaw)

  if (!question) return questionRaw?.id ? <CleanUpQuestion question={questionRaw} /> : null

  switch (question.question_type) {
    case 'text':
      return <TextQuestionField question={question} refetch={refetch} />
    case 'number':
      return <NumberQuestionField question={question} refetch={refetch} />
    case 'checkbox':
      return <CheckboxQuestionField question={question} refetch={refetch} />
    case 'choice':
      return <ChoiceQuestionField question={question} refetch={refetch} />
  }
}

const CleanUpQuestion = ({ question }: { question: Partial<Visitor_Question> }) => {
  return (
    <p className="italic text-red-500">
      This question (id: {question?.id}
      {question?.label != null && ', label: '}
      {question?.label}) has malformed metadata. Contact Ben to resolve this issue.
    </p>
  )
}

interface TextQuestionFieldProps extends ComponentProps<'div'> {
  question: TextQuestion
  refetch?(): any
}

const TextQuestionField = ({ className = '', question, refetch, ...props }: TextQuestionFieldProps) => {
  const nhost = useNhostClient()
  const [editableQuestion, updater] = useEditableVisitorQuestion(question)

  return (
    <div
      className={clsx(
        'relative flex flex-wrap items-end gap-x-6 gap-y-2',
        className,
        !editableQuestion.active && 'opacity-60',
      )}
      {...props}
    >
      {!editableQuestion.active && (
        <div className="flex-center pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rotate-45 text-[5vw] font-bold tracking-widest text-red-700">
          INACTIVE
        </div>
      )}
      <h4 className="absolute -top-1 right-1">
        <em className="font-thin text-gray-500">Type:</em> Text
      </h4>
      <TextInput
        id={`question-${question.id}-label`}
        className="w-full"
        label="Question Label"
        value={editableQuestion.label}
        onChange={(e) => updater('label', e.target.value)}
        collapseDescriptionArea
        required
      />
      <TextInput
        className="w-full"
        label="Description"
        value={editableQuestion.metadata?.description ?? ''}
        onChange={(e) => updater('metadata', { ...editableQuestion.metadata, description: e.target.value })}
        placeholder="(Optional)"
        description="Provide additional help text to support the question"
      />
      <TextInput
        className="w-full"
        label="Default Value"
        value={editableQuestion.metadata?.defaultValue ?? ''}
        onChange={(e) => updater('metadata', { ...editableQuestion.metadata, defaultValue: e.target.value })}
        collapseDescriptionArea
      />
      <TextInput
        label="Placeholder"
        value={editableQuestion.metadata?.placeholder ?? ''}
        onChange={(e) => updater('metadata', { ...editableQuestion.metadata, placeholder: e.target.value })}
        collapseDescriptionArea
      />
      <Checkbox
        label="Long Form Answers"
        description="Will give the visitor a larger text area to write their answer in"
        checked={editableQuestion.metadata?.longform ?? false}
        setChecked={(c) => updater('metadata', { ...editableQuestion.metadata, longform: c })}
      />
      <Checkbox
        className="mb-5"
        label="Active"
        checked={editableQuestion.active}
        setChecked={(c) => updater('active', c)}
      />
      <Checkbox
        className="mb-5"
        label="Required"
        checked={editableQuestion.metadata.required ?? false}
        setChecked={(c) => updater('metadata', { ...editableQuestion.metadata, required: c })}
      />
      <div className="flex w-full justify-end gap-x-4">
        <Button
          variant="destructive-outline"
          PreIcon={TrashIcon}
          onClick={async () => {
            if (!confirm('Are you sure you want to delete this question? It cannot be undone.')) return

            const res = await nhost.graphql
              .request(DELETE_VISITOR_QUESTION, { id: question.id })
              .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

            if (res instanceof Error) {
              console.error(res)
              return toast.error({ message: 'Could not delete this question.' })
            }

            if (Array.isArray(res?.error) && res.error[0]?.extensions?.code === 'constraint-violation') {
              return toast.error({
                message: 'Cannot delete a question that has answers',
                description: 'But you can make the question inactive.',
              })
            }

            refetch?.()
          }}
        >
          Remove
        </Button>
        <ViewAnswersButton question={question} />
      </div>
    </div>
  )
}

interface NumberQuestionFieldProps extends ComponentProps<'div'> {
  question: NumberQuestion
  refetch?(): any
}

const NumberQuestionField = ({ className = '', question, refetch, ...props }: NumberQuestionFieldProps) => {
  const nhost = useNhostClient()
  const [editableQuestion, updater, localUpdater] = useEditableVisitorQuestion(question)

  return (
    <div
      className={clsx(
        'relative flex flex-wrap items-end gap-x-6 gap-y-2',
        className,
        !editableQuestion.active && 'opacity-60',
      )}
      {...props}
    >
      {!editableQuestion.active && (
        <div className="flex-center pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rotate-45 text-[5vw] font-bold tracking-widest text-red-700">
          INACTIVE
        </div>
      )}
      <h4 className="absolute -top-1 right-1">
        <em className="font-thin text-gray-500">Type:</em> Number
      </h4>
      <TextInput
        className="w-full"
        label="Question Label"
        value={editableQuestion.label}
        onChange={(e) => updater('label', e.target.value)}
        collapseDescriptionArea
        required
      />
      <TextInput
        className="w-full"
        label="Description"
        value={editableQuestion.metadata?.description ?? ''}
        onChange={(e) => updater('metadata', { ...editableQuestion.metadata, description: e.target.value })}
        placeholder="(Optional)"
        description="Provide additional help text to support the question"
      />
      <TextInput
        type="number"
        className="w-28"
        label="Min"
        value={editableQuestion.metadata?.min ?? ''}
        onChange={(e) => numericInputHandler(e.target.value, 'min', editableQuestion.metadata, updater, localUpdater)}
        collapseDescriptionArea
      />
      <TextInput
        type="number"
        className="w-28"
        label="Max"
        value={editableQuestion.metadata?.max ?? ''}
        onChange={(e) => numericInputHandler(e.target.value, 'max', editableQuestion.metadata, updater, localUpdater)}
        collapseDescriptionArea
      />
      <TextInput
        type="number"
        className="w-28"
        label="Step"
        value={editableQuestion.metadata?.step ?? ''}
        onChange={(e) => numericInputHandler(e.target.value, 'step', editableQuestion.metadata, updater, localUpdater)}
        collapseDescriptionArea
      />
      <TextInput
        type="number"
        className="w-28"
        label="Default Value"
        value={editableQuestion.metadata?.defaultValue ?? ''}
        onChange={(e) =>
          numericInputHandler(e.target.value, 'defaultValue', editableQuestion.metadata, updater, localUpdater)
        }
        collapseDescriptionArea
      />
      <TextInput
        label="Placeholder"
        value={editableQuestion.metadata?.placeholder ?? ''}
        onChange={(e) => updater('metadata', { ...editableQuestion.metadata, placeholder: e.target.value })}
        collapseDescriptionArea
      />
      <Checkbox label="Active" checked={editableQuestion.active} setChecked={(c) => updater('active', c)} />
      <Checkbox
        label="Required"
        checked={editableQuestion.metadata.required ?? false}
        setChecked={(c) => updater('metadata', { ...editableQuestion.metadata, required: c })}
      />
      <div className="flex w-full justify-end gap-x-4">
        <Button
          variant="destructive-outline"
          PreIcon={TrashIcon}
          onClick={async () => {
            if (!confirm('Are you sure you want to delete this question? It cannot be undone.')) return

            const res = await nhost.graphql
              .request(DELETE_VISITOR_QUESTION, { id: question.id })
              .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

            if (res instanceof Error) {
              console.error(res)
              return toast.error({ message: 'Could not delete this question.' })
            }

            if (Array.isArray(res?.error) && res.error[0]?.extensions?.code === 'constraint-violation') {
              return toast.error({
                message: 'Cannot delete a question that has answers',
                description: 'But you can make the question inactive.',
              })
            }

            refetch?.()
          }}
        >
          Remove
        </Button>
        <ViewAnswersButton question={question} />
      </div>
    </div>
  )
}

interface CheckboxQuestionFieldProps extends ComponentProps<'div'> {
  question: CheckboxQuestion
  refetch?(): any
}

const CheckboxQuestionField = ({ className = '', question, refetch, ...props }: CheckboxQuestionFieldProps) => {
  const nhost = useNhostClient()
  const [editableQuestion, updater] = useEditableVisitorQuestion(question)

  return (
    <div
      className={clsx(
        'relative flex flex-wrap items-end gap-x-6 gap-y-2',
        className,
        !editableQuestion.active && 'opacity-60',
      )}
      {...props}
    >
      {!editableQuestion.active && (
        <div className="flex-center pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rotate-45 text-[5vw] font-bold tracking-widest text-red-700">
          INACTIVE
        </div>
      )}
      <h4 className="absolute -top-1 right-1">
        <em className="font-thin text-gray-500">Type:</em> Checkbox
      </h4>
      <TextInput
        className="w-full"
        label="Question Label"
        value={editableQuestion.label}
        onChange={(e) => updater('label', e.target.value)}
        collapseDescriptionArea
        required
      />
      <TextInput
        className="w-full"
        label="Description"
        value={editableQuestion.metadata?.description ?? ''}
        onChange={(e) => updater('metadata', { ...editableQuestion.metadata, description: e.target.value })}
        placeholder="(Optional)"
        description="Provide additional help text to support the question"
      />
      <Checkbox label="Active" checked={editableQuestion.active} setChecked={(c) => updater('active', c)} />
      <Checkbox
        label="Required"
        checked={editableQuestion.metadata.required ?? false}
        setChecked={(c) => updater('metadata', { ...editableQuestion.metadata, required: c })}
      />
      <Checkbox
        label="Checked by Default"
        checked={editableQuestion.metadata.defaultValue ?? false}
        setChecked={(c) => updater('metadata', { ...editableQuestion.metadata, defaultValue: c })}
      />
      <div className="flex w-full justify-end gap-x-4">
        <Button
          variant="destructive-outline"
          PreIcon={TrashIcon}
          onClick={async () => {
            if (!confirm('Are you sure you want to delete this question? It cannot be undone.')) return

            const res = await nhost.graphql
              .request(DELETE_VISITOR_QUESTION, { id: question.id })
              .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

            if (res instanceof Error) {
              console.error(res)
              return toast.error({ message: 'Could not delete this question.' })
            }

            if (Array.isArray(res?.error) && res.error[0]?.extensions?.code === 'constraint-violation') {
              return toast.error({
                message: 'Cannot delete a question that has answers',
                description: 'But you can make the question inactive.',
              })
            }

            refetch?.()
          }}
        >
          Remove
        </Button>
        <ViewAnswersButton question={question} />
      </div>
    </div>
  )
}

interface ChoiceQuestionFieldProps extends ComponentProps<'div'> {
  question: ChoiceQuestion
  refetch?(): any
}

const ChoiceQuestionField = ({ className = '', question, refetch, ...props }: ChoiceQuestionFieldProps) => {
  const nhost = useNhostClient()
  const [editableQuestion, updater] = useEditableVisitorQuestion(question)

  return (
    <div
      className={clsx(
        'relative flex flex-wrap items-end gap-x-6 gap-y-2',
        className,
        !editableQuestion.active && 'opacity-60',
      )}
      {...props}
    >
      {!editableQuestion.active && (
        <div className="flex-center pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rotate-45 text-[5vw] font-bold tracking-widest text-red-700">
          INACTIVE
        </div>
      )}
      <h4 className="absolute -top-1 right-1">
        <em className="font-thin text-gray-500">Type:</em> Multiple Choice
      </h4>
      <TextInput
        className="w-full"
        label="Question Label"
        value={editableQuestion.label}
        onChange={(e) => updater('label', e.target.value)}
        collapseDescriptionArea
        required
      />
      <TextInput
        className="w-full"
        label="Description"
        value={editableQuestion.metadata?.description ?? ''}
        onChange={(e) => updater('metadata', { ...editableQuestion.metadata, description: e.target.value })}
        placeholder="(Optional)"
        description="Provide additional help text to support the question"
      />
      <Checkbox label="Active" checked={editableQuestion.active} setChecked={(c) => updater('active', c)} />
      <Checkbox
        label="Required"
        checked={editableQuestion.metadata.required ?? false}
        setChecked={(c) => updater('metadata', { ...editableQuestion.metadata, required: c })}
      />
      <Checkbox
        label="Multiple Answers"
        checked={editableQuestion.metadata?.multiple ?? false}
        setChecked={(c) => {
          let selected = false
          updater('metadata', {
            ...editableQuestion.metadata,
            multiple: c,
            ...(!c && {
              choices: editableQuestion.metadata.choices.map((ch) => {
                if (!selected) {
                  selected = ch.defaultChecked

                  return ch
                }

                return { ...ch, defaultChecked: false }
              }),
            }),
          })
        }}
      />
      <div className="flex w-full flex-wrap gap-4">
        {editableQuestion.metadata.choices.map((choice, index) => (
          <div key={index} className=" relative flex flex-col gap-2">
            <TextInput
              label={`Option ${index + 1}`}
              value={choice.label}
              onChange={(e) =>
                updater('metadata', {
                  ...editableQuestion.metadata,
                  choices: editableQuestion.metadata.choices.map((c, i) =>
                    i === index ? { ...c, label: e.target.value } : c,
                  ),
                })
              }
              collapseDescriptionArea
            />
            <Button
              type="button"
              variant="destructive-outline"
              className="!absolute right-0 top-0 min-h-6 px-0.5 opacity-40 hover:opacity-100 focus:opacity-100"
              PreIcon={TrashIcon}
              onClick={() =>
                updater('metadata', {
                  ...editableQuestion.metadata,
                  choices: editableQuestion.metadata.choices.filter((_, i) => index !== i),
                })
              }
            />
            <Checkbox
              label="Selected by Default"
              checked={choice.defaultChecked}
              setChecked={(checked) =>
                updater('metadata', {
                  ...editableQuestion.metadata,
                  choices: editableQuestion.metadata.choices.map((c, i) =>
                    index === i
                      ? { ...c, defaultChecked: checked }
                      : editableQuestion.metadata.multiple || !checked
                        ? c
                        : { ...c, defaultChecked: false },
                  ),
                })
              }
            />
          </div>
        ))}
        <Button
          className="self-center"
          PreIcon={PlusIcon}
          onClick={() =>
            updater('metadata', {
              ...editableQuestion.metadata,
              choices: editableQuestion.metadata.choices.concat({ label: '', defaultChecked: false }),
            })
          }
        >
          Add Choice
        </Button>
      </div>
      <div className="flex w-full justify-end gap-x-4">
        <Button
          variant="destructive-outline"
          PreIcon={TrashIcon}
          onClick={async () => {
            if (!confirm('Are you sure you want to delete this question? It cannot be undone.')) return

            const res = await nhost.graphql
              .request(DELETE_VISITOR_QUESTION, { id: question.id })
              .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

            if (res instanceof Error) {
              console.error(res)
              return toast.error({ message: 'Could not delete this question.' })
            }

            if (Array.isArray(res?.error) && res.error[0]?.extensions?.code === 'constraint-violation') {
              return toast.error({
                message: 'Cannot delete a question that has answers',
                description: 'But you can make the question inactive.',
              })
            }

            refetch?.()
          }}
        >
          Remove
        </Button>
        <ViewAnswersButton question={question} />
      </div>
    </div>
  )
}

const numericInputHandler = (
  value: string,
  key: string,
  metadata: any,
  updater: (k: string, m: any) => void,
  localUpdater: SetStateAction<any>,
) => {
  if (!value) return updater('metadata', { ...metadata, [key]: undefined })

  if (value.match(nonNumericInputsRegex)) return

  if (value.slice(1).includes('-')) return

  let periods = 0
  for (const char of value) {
    if (char === '.') {
      periods++

      if (periods > 1) return
    }
  }

  if (value.at(-1) === '.') {
    return localUpdater((q: any) => ({ ...q, metadata: { ...q.metadata, [key]: value as unknown as number } }))
  }

  const parsed = parseFloat(value)

  if (isNaN(parsed)) return

  updater('metadata', { ...metadata, [key]: parsed })
}
