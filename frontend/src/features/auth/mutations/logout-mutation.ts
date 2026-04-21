import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { isRedirect } from "@tanstack/react-router"

import { logoutFn } from "@/api/auth"
import { authKeys } from "@/lib/query-keys/auth"

export function useLogoutMutation() {
  const logoutMutationFn = useServerFn(logoutFn)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await logoutMutationFn()
    },
    onSuccess: async () => {
      // Typically clear queries on logout
      await queryClient.invalidateQueries({ queryKey: authKeys.me.queryKey })
      queryClient.clear()
    },
    onError: async (err) => {
      if (isRedirect(err)) {
        await queryClient.invalidateQueries({ queryKey: authKeys.me.queryKey })
        throw err
      }
    },
  })
}
