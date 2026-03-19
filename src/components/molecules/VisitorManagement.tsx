import React, { ComponentProps } from 'react'
import { NavLink } from 'react-router-dom'

export interface VisitorManagementProps extends ComponentProps<'div'> {}

export const VisitorManagement = ({ className = '', ...props }: VisitorManagementProps) => {
  return (
    <div className={`${className} flex-center h-contentD flex-wrap gap-2`} {...props}>
      <NavLink
        className="flex-center h-40 w-40 rounded-md border-primary-500 bg-white text-center font-semibold text-primary-500 shadow-md ring-primary-300 hover:scale-105 focus:outline-none focus:ring"
        to="visitors"
      >
        Visitors
      </NavLink>
      <NavLink
        className="flex-center h-40 w-40 rounded-md border-primary-500 bg-white text-center font-semibold text-primary-500 shadow-md ring-primary-300 hover:scale-105 focus:outline-none focus:ring"
        to="registration-questions"
      >
        Registration Questions
      </NavLink>
      <NavLink
        className="flex-center h-40 w-40 rounded-md border-primary-500 bg-white text-center font-semibold text-primary-500 shadow-md ring-primary-300 hover:scale-105 focus:outline-none focus:ring"
        to="survey-responses"
      >
        Survey Responses
      </NavLink>
    </div>
  )
}
