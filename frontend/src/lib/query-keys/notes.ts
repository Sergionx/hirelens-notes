import { createQueryKeys } from "@lukemorales/query-key-factory"

export const notesKeys = createQueryKeys("notes", {
  all: null,
  archived: null,
  detail: (id: string) => ({
    queryKey: [id],
  }),
})
