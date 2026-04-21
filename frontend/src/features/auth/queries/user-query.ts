import { queryOptions } from "@tanstack/react-query"

import { getCurrentUserFn } from "@/api/auth"
import { authKeys } from "@/lib/query-keys/auth"

export const userQueryOptions = queryOptions({
  queryKey: authKeys.me.queryKey,
  queryFn: () => getCurrentUserFn(),
})
