import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { isRedirect } from "@tanstack/react-router"

import { signupFn } from "@/api/auth"
import { authKeys } from "@/lib/query-keys/auth"

import type { SignupSchema } from "../components/SignupForm/schema"

export function useSignupMutation() {
  const signupMutationFn = useServerFn(signupFn)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: SignupSchema) => {
      const res = await signupMutationFn({ data })
      if (res?.error) {
        throw new Error(res.error)
      }
      return res
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.me.queryKey })
    },
    onError: async (err) => {
      if (isRedirect(err)) {
        await queryClient.invalidateQueries({ queryKey: authKeys.me.queryKey })
        throw err
      }
    },
  })
}
