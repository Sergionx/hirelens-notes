import { mergeQueryKeys } from "@lukemorales/query-key-factory"

import { authKeys } from "./auth"
import { notesKeys } from "./notes"

export const queries = mergeQueryKeys(authKeys, notesKeys)
