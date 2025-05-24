import {
  DocumentNode,
  OperationVariables,
  SubscriptionHookOptions,
  SubscriptionResult,
  TypedDocumentNode,
} from '@apollo/client'
import { useAuthSubscription } from '@nhost/react-apollo'
import { useRef } from 'react'

export const useNoFlickerSub = <TData = any, TVariables extends OperationVariables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options: SubscriptionHookOptions<TData, TVariables> = Object.create(null),
): SubscriptionResult<TData, TVariables> => {
  const nonFlickeringCache = useRef<Record<string, TData | undefined>>({})
  const { data, error, loading, ...others } = useAuthSubscription(query, options)

  const nonFlickeringData = loading && !data && !error ? nonFlickeringCache.current.data : data
  nonFlickeringCache.current.data = nonFlickeringData

  return { data: nonFlickeringData, error, loading, ...others }
}
