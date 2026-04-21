import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { toast } from "sonner"

import { createNoteFn } from "@/api/notes"
import { notesKeys } from "@/lib/query-keys/notes"
import type { CreateNoteSchema } from "../schema"

export function useCreateNoteMutation() {
  const createNoteServerFn = useServerFn(createNoteFn)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateNoteSchema) => {
      return await createNoteServerFn({ data })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: notesKeys.list._def })
      toast.success("Note created successfully")
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })
}
