import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

import { signupFn } from "@/api/auth"

import { userQueryOptions } from "../queries/user-query"

import type { SignupSchema } from "../components/SignupForm/schema"

export function useSignupMutation() {
  const signupMutationFn = useServerFn(signupFn)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (data: SignupSchema) => {
      const res = await signupMutationFn({ data })
      if (res?.error) {
        throw new Error(res.error)
      }
      return res
    },
    onSuccess: async () => {
      toast.success("Account created successfully")
      await queryClient.ensureQueryData(userQueryOptions)

      navigate({ to: "/notes" })
    },
    onError: async (err) => {
      toast.error((err as Error).message)
    },
  })
}
