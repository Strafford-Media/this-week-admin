import { Transition } from '@headlessui/react'
import { CheckCircleIcon, ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import React, { ReactNode } from 'react'
import t from 'react-hot-toast'

interface ToastProps {
  message?: ReactNode
  description?: ReactNode
}

export const toast = {
  success: ({ message, description }: ToastProps = {}) =>
    t.custom(({ id, visible }) => (
      <SimpleToast visible={visible} type="success" toastId={id} message={message} description={description} />
    )),
  error: ({ message, description }: ToastProps = {}) =>
    t.custom(
      ({ id, visible }) => (
        <SimpleToast visible={visible} type="error" toastId={id} message={message} description={description} />
      ),
      {
        duration: 60000,
      }
    ),
}

interface SimpleToastProps extends ToastProps {
  toastId: string
  type: 'success' | 'error'
  visible?: boolean
}

const SimpleToast = ({ message, description, toastId, type, visible = false }: SimpleToastProps) => {
  const title = message || (type === 'success' ? 'Success!' : 'Error...')

  return (
    <Transition
      appear
      show={visible}
      enter="duration-300"
      enterFrom="opacity-0 translate-x-full"
      enterTo="opacity-100 translate-x-0"
      leave="duration-700"
      leaveFrom="opacity-100 translate-x-0"
      leaveTo="opacity-0 translate-x-full"
      className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {type === 'success' && <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />}
            {type === 'error' && <ExclamationCircleIcon className="h-6 w-6 text-red-500" aria-hidden="true" />}
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900">{title}</p>
            {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              type="button"
              className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              onClick={() => t.dismiss(toastId)}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  )
}
