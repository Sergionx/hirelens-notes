import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { toast } from "sonner"

import { unarchiveNoteFn } from "@/api/notes"
import { notesKeys } from "@/lib/query-keys/notes"

export function useUnarchiveNoteMutation() {
  const unarchiveNoteServerFn = useServerFn(unarchiveNoteFn)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      return await unarchiveNoteServerFn({ data: { id } })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesKeys.list._def })
      toast.success("Note unarchived")
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })
}
