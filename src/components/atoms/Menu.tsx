import React, { ComponentProps, useState, ReactNode, useId } from 'react'
import { useFloating, offset, flip, shift, autoUpdate, Placement } from '@floating-ui/react-dom'
import { IconButton } from './IconButton'
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import { useEventListener } from '@8thday/react'

export interface MenuItem {
  label: ReactNode
  onClick(): void
  disabled?: boolean
}

export interface MenuProps extends Omit<ComponentProps<'button'>, 'ref'> {
  placement?: Placement
  listItems: MenuItem[]
  showAlways?: boolean
}

const UP = -1
const DOWN = 1

export const Menu = ({ className = '', placement, listItems, showAlways = false, ...props }: MenuProps) => {
  const menuId = useId()
  const [show, setShow] = useState(false)
  const { refs, floatingStyles } = useFloating<HTMLButtonElement>({
    strategy: 'absolute',
    placement: placement || 'bottom-end',
    middleware: [offset(1), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  })

  useEventListener('click', (e) => {
    if (!(e.target instanceof Node)) return

    if (show && !refs.reference.current?.contains(e.target) && !refs.floating.current?.contains(e.target)) {
      setShow(false)
    }
  })

  return (
    <>
      <IconButton
        ref={refs.setReference}
        icon={EllipsisVerticalIcon}
        srLabel="Image Options"
        className={clsx(className, {
          'duration-300 hover:opacity-100 focus:opacity-100 sm:opacity-0': !showAlways,
          'sm:opacity-100': show,
        })}
        {...props}
        onClick={() => setShow((s) => !s)}
        onKeyDown={(e) => {
          switch (e.key) {
            case 'ArrowDown':
              e.preventDefault()
              if (!show) {
                setShow(true)
              }
              return setTimeout(() => {
                rotateFocus(listItems, -1, DOWN, menuId, refs.reference.current)
              }, 16)
            case 'ArrowUp':
              e.preventDefault()
              if (!show) {
                setShow(true)
              }
              return setTimeout(() => {
                rotateFocus(listItems, listItems.length, UP, menuId, refs.reference.current)
              }, 16)

            case 'Escape':
              return setShow(false)
          }
        }}
      />
      <ul
        className={clsx(`max-h-[40vh] overflow-y-auto rounded-md bg-white shadow-lg duration-300`, {
          'invisible opacity-0': !show,
          'visible opacity-100': show,
        })}
        ref={refs.setFloating}
        style={floatingStyles}
      >
        {listItems.map((l, i) => (
          <li
            id={`${menuId}-${i}`}
            className={clsx(`group/menu-item cursor-pointer px-2 py-1 focus:outline-none`, {
              'text-gray-500 opacity-60': l.disabled,
              'hover:bg-primary-100 focus:bg-primary-200': !l.disabled,
            })}
            tabIndex={l.disabled ? undefined : 0}
            onClick={!l.disabled ? l.onClick : undefined}
            key={i}
            onKeyDown={(e) => {
              switch (e.key) {
                case 'ArrowDown':
                  e.preventDefault()
                  return rotateFocus(listItems, i, DOWN, menuId, refs.reference.current)
                case 'ArrowUp':
                  e.preventDefault()
                  return rotateFocus(listItems, i, UP, menuId, refs.reference.current)
                case 'Escape':
                  return setShow(false)
                case 'Enter':
                  return !l.disabled && l?.onClick()
              }
            }}
          >
            {l.label}
          </li>
        ))}
      </ul>
    </>
  )
}

function rotateFocus(
  menuItems: MenuItem[],
  index: number,
  upOrDown: 1 | -1,
  menuId: string,
  menuRef: HTMLElement | null,
): void {
  let currentIndex = index
  do {
    currentIndex += upOrDown
    if (!menuItems[currentIndex]) {
      return menuRef?.focus()
    }

    if (!menuItems[currentIndex].disabled) {
      return document.getElementById(`${menuId}-${currentIndex}`)?.focus?.()
    }
  } while (menuItems[currentIndex])
}
