import z from "zod"

export const notesQueryparams = z.object({
  categoryIds: z.array(z.number()).optional(),
})
