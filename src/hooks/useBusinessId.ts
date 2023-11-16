import { useMatch } from 'react-router-dom'

export const useBusinessId = () => {
  const { params: { businessId = '' } = {} } = useMatch({ path: '/b/:businessId', end: false }) ?? {}

  return businessId
}
