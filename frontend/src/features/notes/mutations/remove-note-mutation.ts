import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { toast } from "sonner"

import { removeNoteFn } from "@/api/notes"
import { notesKeys } from "@/lib/query-keys/notes"

export function useRemoveNoteMutation() {
  const removeNoteServerFn = useServerFn(removeNoteFn)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      return await removeNoteServerFn({ data: { id } })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: notesKeys.list._def,
        refetchType: "all",
      })
      toast.success("Note deleted")
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })
}
