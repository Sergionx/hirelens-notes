import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { toast } from "sonner"

import { updateNoteFn } from "@/api/notes"
import { notesKeys } from "@/lib/query-keys/notes"

import type { UpdateNoteSchema } from "../schema"

export function useUpdateNoteMutation() {
  const updateNoteServerFn = useServerFn(updateNoteFn)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: UpdateNoteSchema
    }) => {
      return await updateNoteServerFn({ data: { id, data } })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesKeys.list._def })
      toast.success("Note updated")
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })
}
