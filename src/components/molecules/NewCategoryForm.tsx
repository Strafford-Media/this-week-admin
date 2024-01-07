import { Button, TextInput, Toggle, toast } from '@8thday/react'
import React, { ComponentProps, useEffect, useRef, useState } from 'react'
import { CREATE_CATEGORY } from '../../graphql'
import { useNhostClient } from '@nhost/react'
import clsx from 'clsx'

export interface NewCategoryFormProps extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  onCreate(id: number): void
}

export const NewCategoryForm = ({ className = '', onCreate, ...props }: NewCategoryFormProps) => {
  const nhost = useNhostClient()
  const ref = useRef<HTMLInputElement>(null)

  const [newCategoryName, setNewCategoryName] = useState('')
  const [isPrimary, setIsPrimary] = useState(false)

  useEffect(() => {
    if (ref.current) {
      ref.current.focus()
    }
  }, [])

  return (
    <form
      className={clsx(className, 'max-w-full space-y-4 rounded-md bg-white p-4 md:w-md')}
      onSubmit={async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!newCategoryName) return

        const res = await nhost.graphql
          .request(CREATE_CATEGORY, { label: newCategoryName.trim().toLowerCase(), isPrimary })
          .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

        if (res instanceof Error) {
          console.error(res)
          return toast.error({ message: 'An unexpected error occurred', description: res.message })
        }

        if (res.error) {
          console.error(res)
          const description = !Array.isArray(res.error)
            ? res.error.message
            : res.error[0].extensions.code === 'constraint-violation'
              ? `Category "${newCategoryName}" already exists`
              : 'An unexpected error occurred.'
          return toast.error({ message: 'Unable to Create Category', description })
        }

        if (!res.data.insert_category_tag_one?.id) {
          console.error(res)
          return toast.error({ message: 'Unable to Create Category', description: 'An unexpected error occurred.' })
        }

        onCreate(res.data.insert_category_tag_one.id)
        setNewCategoryName('')
        setIsPrimary(false)
      }}
      {...props}
    >
      <h3 className="text-center">New Category</h3>
      <TextInput
        ref={ref}
        label="Category Tag Label"
        value={newCategoryName}
        onChange={(e) => setNewCategoryName(e.target.value)}
        collapseDescriptionArea
      />
      <Toggle
        className="my-4"
        checked={isPrimary}
        setChecked={setIsPrimary}
        rightLabel="Primary Category"
        rightDescription="Include this category in website navigation"
      />
      <div className="flex gap-2">
        <Button type="submit" variant="primary" disabled={!newCategoryName}>
          Create Category
        </Button>
        {(newCategoryName || isPrimary) && (
          <Button
            type="button"
            variant="dismissive"
            onClick={() => {
              setNewCategoryName('')
              setIsPrimary(false)
            }}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
