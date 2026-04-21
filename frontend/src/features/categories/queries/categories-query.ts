import { queryOptions, useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/lib/query-keys"
import { findAllCategoriesFn } from "@/api/categories"

export function getCategoriesQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.categories.list.queryKey,
    queryFn: () => findAllCategoriesFn(),
  })
}

export function useCategoriesQuery() {
  return useQuery(getCategoriesQueryOptions())
}