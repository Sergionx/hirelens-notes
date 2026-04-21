import { z } from "zod"

export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const createCategorySchema = categorySchema.pick({ name: true })

export type Category = z.infer<typeof categorySchema>
export type CreateCategory = z.infer<typeof createCategorySchema>
