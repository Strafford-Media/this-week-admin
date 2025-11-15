import { Button, ButtonProps, Modal, Select, TextInput } from '@8thday/react'
import { ChevronRightIcon, PencilIcon, PlusCircleIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useAuthQuery } from '@nhost/react-apollo'
import clsx from 'clsx'
import React, { ComponentProps, useState } from 'react'
import { BREADCRUMBS } from '../../graphql'

export interface BreadcrumbsEditorProps extends ComponentProps<'div'> {
  breadcrumbs: { href?: string; label: string }[]
  businessName: string
  slug: string
  onSave(breadcrumbs: { href?: string; label: string }[]): void
}

export const BreadcrumbsEditor = ({
  className = '',
  breadcrumbs = [],
  businessName,
  onSave,
  ...props
}: BreadcrumbsEditorProps) => {
  const [editingIndex, setEditingIndex] = useState(-1)
  const [href, setHref] = useState('')
  const [label, setLabel] = useState('')

  const onCreate = (bc: { href?: string; label: string }, i: number) => {
    const newBCs = [...breadcrumbs.slice(0, i), bc, ...breadcrumbs.slice(i)]

    onSave(newBCs)
  }

  const onDelete = (i: number) => {
    const newBCs = [...breadcrumbs.slice(0, i), ...breadcrumbs.slice(i + 1)]

    onSave(newBCs)
  }

  const onUpdate = (bc: { href?: string; label: string }, i: number) => {
    const newBCs = [...breadcrumbs.slice(0, i), bc, ...breadcrumbs.slice(i + 1)]

    onSave(newBCs)
  }

  return (
    <div className={`${className}`} {...props}>
      <h5 className="font-medium text-gray-700">Breadcrumbs</h5>
      <ol className="flex flex-wrap items-center gap-2.5 py-2">
        <li className="flex opacity-80">
          <div>
            <div className="font-semibold text-red-500">Home</div>
            <div className="text-xs text-gray-500">/</div>
          </div>
          <div className="flex-center ml-2 self-stretch">
            <AddBreadCrumbButton onCreate={(bc) => onCreate(bc, 0)} />
          </div>
        </li>
        {breadcrumbs?.map(({ href, label }, i) => (
          <li key={label + i} className="flex">
            <div
              className="cursor-pointer"
              onClick={() => {
                setHref(href ?? '')
                setLabel(label ?? '')
                setEditingIndex(i)
              }}
            >
              <div className={clsx('flex items-center font-semibold', href && 'text-red-500')}>
                {label}
                <button
                  className="ml-2 h-4 w-4 text-gray-400/60 hover:text-red-500 focus:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(i)
                  }}
                >
                  <TrashIcon />
                </button>
              </div>
              <div className="text-xs text-gray-500">{href}</div>
            </div>
            <div className="flex-center ml-2 self-stretch">
              <AddBreadCrumbButton onCreate={(bc) => onCreate(bc, i + 1)} />
            </div>
          </li>
        ))}
        {businessName && (
          <li className="flex opacity-80">
            <div>
              <div className="font-semibold">{businessName}</div>
              <div className="text-xs text-gray-500">(current page)</div>
            </div>
          </li>
        )}
      </ol>
      {editingIndex > -1 && (
        <Modal portal onClose={() => setEditingIndex(-1)}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()

              if (!label) return

              onUpdate({ href, label }, editingIndex)
              setEditingIndex(-1)
              setHref('')
              setLabel('')
            }}
          >
            <h3>Edit Breadcrumb</h3>
            <TextInput label="Label" value={label} onChange={(e) => setLabel(e.target.value)} autoFocus required />
            <TextInput
              label="HREF"
              value={href}
              onChange={(e) => setHref(e.target.value)}
              PreText="https://thisweekhawaii.com"
              placeholder=" (none)"
              description="Optional"
            />
            <div className="mt-4 flex gap-2">
              <SelectPresetBreadcrumb
                onSelected={(bc) => {
                  setHref(bc.href ?? '')
                  setLabel(bc.label ?? '')
                }}
              />
              <Button type="submit" variant="primary" PreIcon={PencilIcon}>
                Update
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

interface AddBreadCrumbButtonProps extends ComponentProps<'button'> {
  onCreate(breadcrumb: { href?: string; label: string }): void
}

const AddBreadCrumbButton = ({ className = '', onCreate, ...props }: AddBreadCrumbButtonProps) => {
  const [open, setOpen] = useState(false)
  const [href, setHref] = useState('')
  const [label, setLabel] = useState('')

  return (
    <button
      className={clsx(className, 'flex-center group rounded p-1 hover:bg-gray-200 focus:bg-gray-200')}
      {...props}
      onClick={() => setOpen(true)}
    >
      <ChevronRightIcon className={clsx('h-5 w-5 group-hover:hidden group-focus:hidden')} />
      <PlusCircleIcon className={clsx('hidden h-5 w-5 group-hover:block group-focus:block')} />
      {open && (
        <Modal portal onClose={() => setOpen(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()

              if (!label) return

              onCreate({ href, label })
              setOpen(false)
              setHref('')
              setLabel('')
            }}
          >
            <h3>New Breadcrumb</h3>
            <TextInput label="Label" value={label} onChange={(e) => setLabel(e.target.value)} autoFocus required />
            <TextInput
              label="HREF"
              value={href}
              onChange={(e) => setHref(e.target.value)}
              PreText="https://thisweekhawaii.com"
              placeholder=" (none)"
              description="Optional"
            />
            <div className="mt-4 flex gap-2">
              <SelectPresetBreadcrumb
                onSelected={(bc) => {
                  setHref(bc.href ?? '')
                  setLabel(bc.label ?? '')
                }}
              />
              <Button type="submit" variant="primary" PreIcon={PlusIcon}>
                Create
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </button>
  )
}

interface SelectPresetBreadcrumbProps extends Omit<ButtonProps, 'ref'> {
  onSelected(bc: { href?: string; label: string }): void
}

const SelectPresetBreadcrumb = ({ onSelected, children, onClick, ...props }: SelectPresetBreadcrumbProps) => {
  const [open, setOpen] = useState(false)

  const { data } = useAuthQuery(BREADCRUMBS, { fetchPolicy: 'cache-and-network' })

  const availableBreadcrumbs =
    data?.listing
      .flatMap((l) => (Array.isArray(l.breadcrumbs) ? l.breadcrumbs : []))
      .filter(removeDupedBreadcrumbs()) ?? []

  return (
    <>
      <Button
        {...props}
        onClick={(e) => {
          onClick?.(e)
          setOpen(true)
        }}
      >
        {children || 'Copy Existing Breadcrumb'}
      </Button>
      {open && (
        <Modal
          portal
          onClose={() => {
            setOpen(false)
          }}
        >
          <h4>Choose Existing Breadcrumb</h4>
          <ul className="mt-4 min-w-96 overflow-y-auto">
            {availableBreadcrumbs.map(({ href, label }) => (
              <li
                key={href + label}
                role="button"
                className="flex flex-col gap-y-1 p-2 hover:bg-gray-100"
                onClick={() => {
                  onSelected({ href, label })
                  setOpen(false)
                }}
              >
                <p className={href ? 'text-red-500' : ''}>{label}</p>
                <em className="text-xs text-gray-500">{href || '(none)'}</em>
              </li>
            ))}
          </ul>
        </Modal>
      )}
    </>
  )
}

const removeDupedBreadcrumbs = () => {
  const cache: Record<string, 1> = {}

  return ({ href, label }: { href: string; label: string }) => {
    if (cache[href + label]) return false
    cache[href + label] = 1
    return true
  }
}
