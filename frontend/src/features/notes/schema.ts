import { z } from "zod"

import { categorySchema } from "../categories/schema"

export const noteSchema = z.object({
  id: z.number(),
  title: z.string().min(1, "Title is required").max(255),
  content: z.string().min(1, "Content is required"),
  isArchived: z.boolean(),
  categories: z.array(categorySchema).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Note = z.infer<typeof noteSchema>

export const CreateNoteSchema = noteSchema.pick({
  title: true,
  content: true,
}).extend({
  categoryIds: z.array(z.number()),
})

export type CreateNoteSchema = z.infer<typeof CreateNoteSchema>

export const UpdateNoteSchema = CreateNoteSchema.partial()

export type UpdateNoteSchema = z.infer<typeof UpdateNoteSchema>

export const NotesQuerySchema = z.object({
  archived: z.boolean().optional(),
  categoryIds: z.array(z.number()).optional(),
})

export type NotesQuerySchema = z.infer<typeof NotesQuerySchema>
