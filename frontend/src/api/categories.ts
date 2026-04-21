import { authenticatedFetch } from "@/lib/config/fetch"
import { createServerFn } from "@tanstack/react-start"

import type { Category } from "@/features/categories/schema"

export const findAllCategoriesFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const res = await authenticatedFetch<Category[]>("/categories")

    if (!res.success) throw new Error(res.message)
    return res.data
  }
)
