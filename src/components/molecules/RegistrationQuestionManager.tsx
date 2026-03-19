import { useAuthQuery } from '@nhost/react-apollo'
import React, { ComponentProps, useState } from 'react'
import { CREATE_VISITOR_QUESTION, REGISTRATION_QUESTIONS, UPDATE_VISITOR_QUESTIONS } from '../../graphql'
import { Button, Modal, TextInput, toast } from '@8thday/react'
import { ArrowDownIcon, ArrowUpIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useNhostClient } from '@nhost/react'
import { CreateVisitorQuestionMutationVariables, Visitor_Question_Insert_Input } from '../../gql/graphql'
import { VisitorQuestion } from './VisitorQuestion'
import clsx from 'clsx'

export interface RegistrationQuestionManagerProps extends ComponentProps<'div'> {}

export const RegistrationQuestionManager = ({ className = '', ...props }: RegistrationQuestionManagerProps) => {
  const nhost = useNhostClient()

  const { data, refetch, updateQuery } = useAuthQuery(REGISTRATION_QUESTIONS)

  const [newQuestion, setNewQuestion] = useState<Visitor_Question_Insert_Input | null>(null)

  const moveQuestion = async (id: number, direction: 'up' | 'down') => {
    if (!id || (direction !== 'up' && direction !== 'down')) return

    const currentOrder = [...(data?.visitor_question ?? [])].map((q, i) => ({
      id: q.id,
      newOrder: i,
      originalOrder: q.order,
    }))

    const index = currentOrder.findIndex((q) => q.id === id)

    if (index === -1) return

    const otherIndex = direction === 'up' ? index - 1 : index + 1
    const otherGroup = currentOrder[otherIndex]

    if (!otherGroup) return
    ;[otherGroup.newOrder, currentOrder[index].newOrder] = [currentOrder[index].newOrder, otherGroup.newOrder]

    updateQuery(({ visitor_question, ...data }) => ({
      ...data,
      visitor_question: visitor_question
        .map((v) => {
          v.order = currentOrder.find((q) => q.id === v.id)?.newOrder ?? v.order

          return v
        })
        .sort((a, b) => a.order - b.order),
    }))

    const res = await nhost.graphql
      .request(UPDATE_VISITOR_QUESTIONS, {
        updates: currentOrder
          .filter((q) => q.newOrder !== q.originalOrder)
          .map((q) => ({ where: { id: { _eq: q.id } }, _set: { order: q.newOrder } })),
      })
      .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

    if (res instanceof Error) {
      return toast.error({ message: 'Unable to reorder question.' })
    }

    await refetch()
  }

  return (
    <div className={`${className} flex h-contentD flex-col`} {...props}>
      <div className="flex shrink-0 flex-wrap items-center gap-2 p-2 shadow-sm">
        <div className="grow">
          <h2>Registration Questions</h2>
          <p className="text-sm text-gray-500">Configure the form that greets new subscribers.</p>
        </div>
        <Button
          className="shrink-0"
          PreIcon={PlusIcon}
          onClick={() => setNewQuestion({ question_type: '', label: '' })}
        >
          New Question
        </Button>
      </div>
      <ul className="min-h-0 grow overflow-y-auto pb-4">
        {data?.visitor_question.map((q, i, l) => (
          <li
            key={q.id}
            className="grid grid-cols-[1fr_theme(spacing.6)] gap-1 border-b p-2 transition-all even:bg-gray-200"
          >
            <VisitorQuestion question={q} refetch={refetch} />
            <div className="flex flex-col justify-between place-self-stretch opacity-40 focus-within:opacity-100 hover:opacity-100">
              <Button
                type="button"
                className={clsx('min-h-6', i === 0 && 'invisible')}
                variant="dismissive"
                PreIcon={ArrowUpIcon}
                onClick={() => moveQuestion(q.id, 'up')}
                disabled={i === 0}
              />
              <Button
                type="button"
                className={clsx('min-h-6', i === l.length - 1 && 'invisible')}
                variant="dismissive"
                PreIcon={ArrowDownIcon}
                onClick={() => moveQuestion(q.id, 'down')}
                disabled={i === l.length - 1}
              />
            </div>
          </li>
        ))}
      </ul>
      {newQuestion && (
        <Modal onClose={() => setNewQuestion(null)}>
          <form
            className="flex-center flex-col gap-4"
            onSubmit={async (e) => {
              e.preventDefault()

              if (!newQuestion.label || !newQuestion.question_type) return

              newQuestion.metadata = { choices: newQuestion.question_type === 'choice' ? [] : undefined }
              newQuestion.order =
                Math.max(...(data?.visitor_question.filter((q) => q.active).map((q) => q.order) ?? [])) + 1

              const res = await nhost.graphql
                .request(CREATE_VISITOR_QUESTION, { input: newQuestion })
                .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

              if (res instanceof Error) {
                return toast.error({ message: 'Could not create question...', description: res.message })
              }

              setNewQuestion(null)
              await refetch()

              setTimeout(() => {
                if (res.data?.insert_visitor_question_one?.id) {
                  document.getElementById(`question-${res.data.insert_visitor_question_one.id}-label`)?.focus()
                }
              }, 10)
            }}
          >
            <h3>What would you like to ask new website visitors?</h3>
            <TextInput
              className="w-full"
              label="Question Label"
              labelClass="text-center"
              value={newQuestion.label ?? ''}
              onChange={(e) =>
                setNewQuestion((q) => ({ question_type: q?.question_type ?? '', label: e.target.value }))
              }
              collapseDescriptionArea
            />
            <div className="grid grid-cols-2 items-center justify-stretch gap-2 md:grid-cols-4">
              <label className="col-span-full text-center">Question Type</label>
              <Button
                type="button"
                variant={newQuestion.question_type === 'text' ? 'primary' : 'secondary-outline'}
                onClick={() => setNewQuestion((q) => ({ label: q?.label ?? '', question_type: 'text' }))}
              >
                Text Input
              </Button>
              <Button
                type="button"
                variant={newQuestion.question_type === 'number' ? 'primary' : 'secondary-outline'}
                onClick={() => setNewQuestion((q) => ({ label: q?.label ?? '', question_type: 'number' }))}
              >
                Number Input
              </Button>
              <Button
                type="button"
                variant={newQuestion.question_type === 'checkbox' ? 'primary' : 'secondary-outline'}
                onClick={() => setNewQuestion((q) => ({ label: q?.label ?? '', question_type: 'checkbox' }))}
              >
                Check Box
              </Button>
              <Button
                type="button"
                variant={newQuestion.question_type === 'choice' ? 'primary' : 'secondary-outline'}
                onClick={() => setNewQuestion((q) => ({ label: q?.label ?? '', question_type: 'choice' }))}
              >
                Multiple Choice
              </Button>
            </div>
            <Button type="submit" variant="primary" disabled={!newQuestion.label || !newQuestion.question_type}>
              Create
            </Button>
          </form>
        </Modal>
      )}
    </div>
  )
}
