import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { toast } from "sonner"

import { archiveNoteFn } from "@/api/notes"
import { notesKeys } from "@/lib/query-keys/notes"

export function useArchiveNoteMutation() {
  const archiveNoteServerFn = useServerFn(archiveNoteFn)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      return await archiveNoteServerFn({ data: { id } })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesKeys.list._def })
      toast.success("Note archived")
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })
}
