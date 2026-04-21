import { queryOptions } from "@tanstack/react-query"

import { notesKeys } from "@/lib/query-keys/notes"
import { findAllNotesFn } from "@/api/notes"
import type { NotesQuerySchema } from "../schema"

export function getNotesQueryOptions(query: NotesQuerySchema) {
  return queryOptions({
    queryKey: notesKeys.list(query).queryKey,
    queryFn: () => findAllNotesFn({ data: query }),
  })
}
