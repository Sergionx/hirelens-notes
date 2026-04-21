import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

import { loginFn } from "@/api/auth"

import { userQueryOptions } from "../queries/user-query"

import type { LoginSchema } from "../components/LoginForm/schema"

export function useLoginMutation() {
  const loginMutationFn = useServerFn(loginFn)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (data: LoginSchema) => {
      const res = await loginMutationFn({ data })
      if (res?.error) throw new Error(res.error)

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
