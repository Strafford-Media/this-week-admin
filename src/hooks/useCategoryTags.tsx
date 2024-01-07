import { useAuthQuery } from '@nhost/react-apollo'
import React, { useContext, createContext, PropsWithChildren, useMemo } from 'react'
import { GET_CATEGORY_TAGS } from '../graphql'
import { GetCategoryTagsQuery } from '../gql/graphql'
import { QueryResult } from '@apollo/client'

export type Tag = GetCategoryTagsQuery['category_tag'][number]
type TagMap = Record<number, Tag>
type Refetcher = QueryResult<GetCategoryTagsQuery>['refetch']

interface CategoryTagContextValue {
  tags: Tag[]
  tagMap: TagMap
  refetch: Refetcher
}

const refetcherStub = (() => {}) as Refetcher

const tagContext = createContext<CategoryTagContextValue>({ tags: [], tagMap: {}, refetch: refetcherStub })
const { Provider } = tagContext

export const useCategoryTags = () => useContext(tagContext)

export const CategoryTagProvider = (props: PropsWithChildren) => {
  const { data, refetch } = useAuthQuery(GET_CATEGORY_TAGS)

  const tagMap = useMemo(
    () => data?.category_tag.reduce<TagMap>((map, item) => ({ ...map, [item.id]: item }), {}) ?? {},
    [data],
  )

  const tags = data?.category_tag ?? []

  return <Provider value={{ tagMap, tags, refetch }}>{props.children}</Provider>
}
