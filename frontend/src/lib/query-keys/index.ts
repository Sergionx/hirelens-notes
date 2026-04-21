import { mergeQueryKeys } from "@lukemorales/query-key-factory"

import { authKeys } from "./auth"
import { notesKeys } from "./notes"
import { categoriesKeys } from "./categories"

export const queryKeys = mergeQueryKeys(authKeys, notesKeys, categoriesKeys)
