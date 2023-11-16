import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from '../utils/toasts'

export const useQueryToaster = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const error = searchParams.get('oauth_error') || searchParams.get('app_error')

    if (error) {
      let message = 'Error'
      let description = ''

      switch (error) {
        case 'failed_to_authorize':
          description = 'The authorization was successfully rejected.'
          break
        case 'failed_to_obtain_token':
        case 'failed_to_link_business':
        case 'no_code_received':
        default:
          description = error
      }

      setTimeout(() => {
        toast.error({ message, description })
      }, 1000)

      searchParams.delete('oauth_error')
      searchParams.delete('app_error')
      setSearchParams(searchParams, { replace: true })
    }

    const success = searchParams.get('success')

    if (success) {
      let message = 'Success!'
      let description = ''

      switch (success) {
        case 'square_link':
          description = 'Your Square account is all hooked up!'
          break
        default:
          description = ''
      }

      setTimeout(() => {
        toast.success({ message, description })
      }, 1000)

      searchParams.delete('success')
      setSearchParams(searchParams, { replace: true })
    }
  }, [searchParams])
}
