import { useNhostClient } from '@nhost/react'
import { ValidatedVisitorQuestion } from '../utils/types'
import { useRef, useState } from 'react'
import { UPDATE_VISITOR_QUESTION } from '../graphql'
import { toast } from '@8thday/react'

export const useEditableVisitorQuestion = <T extends ValidatedVisitorQuestion>(question: T) => {
  const nhost = useNhostClient()

  const [editableQuestion, setEditableQuestion] = useState(question)
  const editedRef = useRef(question)
  editedRef.current = editableQuestion

  const timeoutIdRef = useRef<Record<string, number>>({})
  const debounceUpdate = (key: string, value: any) => {
    if (!key || typeof value === 'undefined') return

    setEditableQuestion((q) => ({ ...q, [key]: value }))

    clearTimeout(timeoutIdRef.current[key])
    timeoutIdRef.current[key] = window.setTimeout(async () => {
      const res = nhost.graphql
        .request(UPDATE_VISITOR_QUESTION, { id: question.id, set: { [key]: value } })
        .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

      if (res instanceof Error) {
        return toast.warn({ message: `Unable to save changes to question ${question.id}` })
      }
    }, 400)
  }

  return [editableQuestion, debounceUpdate, setEditableQuestion] as const
}
