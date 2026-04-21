import { createQueryKeys } from "@lukemorales/query-key-factory"

import type { NotesQuerySchema } from "@/features/notes/schema"

export const notesKeys = createQueryKeys("notes", {
  list: (filters: NotesQuerySchema) => ({
    queryKey: [filters],
  }),
  detail: (id: number) => ({
    queryKey: [id],
  }),
})
