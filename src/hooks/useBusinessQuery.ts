import { DocumentNode, QueryHookOptions, SubscriptionHookOptions, TypedDocumentNode } from '@apollo/client'
import { useAuthQuery, useAuthSubscription } from '@nhost/react-apollo'
import { useBusinessId } from './useBusinessId'

export const useBusinessQuery = <First = any>(
  query: DocumentNode | TypedDocumentNode<First, any>,
  options?: QueryHookOptions<First, any> | undefined
) => {
  const businessId = useBusinessId()

  return useAuthQuery(query, {
    ...options,
    variables: { ...options?.variables, businessId },
    skip: !businessId || options?.skip,
  })
}

export const useBusinessSubscription = <First = any>(
  query: DocumentNode | TypedDocumentNode<First, any>,
  options?: SubscriptionHookOptions<First, any> | undefined
) => {
  const businessId = useBusinessId()

  return useAuthSubscription(query, {
    ...options,
    variables: { ...options?.variables, businessId },
    skip: !businessId || options?.skip,
  })
}
