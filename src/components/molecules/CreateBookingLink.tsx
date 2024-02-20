import { Button } from '@8thday/react'
import React, { ComponentProps } from 'react'

export interface CreateBookingLinkProps extends ComponentProps<'div'> {
  onCreate(type: 'fareharbor-item' | 'fareharbor-grid' | 'external'): void
  onCancel?(): void
}

export const CreateBookingLink = ({ className = '', onCreate, onCancel, ...props }: CreateBookingLinkProps) => {
  return (
    <div className={`${className} flex-center flex-col`} {...props}>
      <Button variant="primary" className="mb-2" onClick={() => onCreate('fareharbor-item')}>
        Single Fareharbor Item
      </Button>
      <em className="mb-6">Open a booking portal in a lightframe for one specific item.</em>
      <Button variant="primary" className="mb-2" onClick={() => onCreate('fareharbor-grid')}>
        Fareharbor Grid
      </Button>
      <em className="mb-6">Displays a grid of items from a specific Fareharbor "flow."</em>
      <Button variant="primary" className="mb-2" onClick={() => onCreate('external')}>
        External Booking Link
      </Button>
      <em className="mb-6">Send the user to any website to complete their booking process.</em>
      <Button variant="dismissive" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  )
}
