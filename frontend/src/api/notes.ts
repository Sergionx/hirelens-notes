import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"

import { authenticatedFetch } from "@/lib/config/fetch"
import {
  CreateNoteSchema,
  type Note,
  UpdateNoteSchema,
  NotesQuerySchema,
} from "@/features/notes/schema"

export const findAllNotesFn = createServerFn({ method: "GET" })
  .inputValidator((data: NotesQuerySchema) => NotesQuerySchema.parse(data))
  .handler(async ({ data }) => {
    const params = new URLSearchParams()
    if (data.archived !== undefined)
      params.append("archived", String(data.archived))

    if (data.categoryIds && data.categoryIds.length > 0)
      params.append("categoryIds", data.categoryIds.join(","))

    const query = params.toString() ? `?${params.toString()}` : ""
    const res = await authenticatedFetch<Note[]>(`/notes${query}`)

    if (!res.success) throw new Error(res.message)
    return res.data
  })

export const findOneNoteFn = createServerFn({ method: "GET" })
  .inputValidator((data: { id: number }) =>
    z.object({ id: z.number() }).parse(data)
  )
  .handler(async ({ data: { id } }) => {
    const res = await authenticatedFetch<Note>(`/notes/${id}`)

    if (!res.success) throw new Error(res.message)
    return res.data
  })

export const createNoteFn = createServerFn({ method: "POST" })
  .inputValidator((data: any) => CreateNoteSchema.parse(data))
  .handler(async ({ data }) => {
    const res = await authenticatedFetch<Note>(`/notes`, {
      method: "POST",
      body: data,
    })

    if (!res.success) throw new Error(res.message)
    return res.data
  })

export const updateNoteFn = createServerFn({ method: "POST" })
  .inputValidator((data: any) =>
    z.object({ id: z.number(), data: UpdateNoteSchema }).parse(data)
  )
  .handler(async ({ data: { id, data } }) => {
    const res = await authenticatedFetch<Note>(`/notes/${id}`, {
      method: "PATCH",
      body: data,
    })

    if (!res.success) throw new Error(res.message)
    return res.data
  })

export const removeNoteFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number }) =>
    z.object({ id: z.number() }).parse(data)
  )
  .handler(async ({ data: { id } }) => {
    const res = await authenticatedFetch<void>(`/notes/${id}`, {
      method: "DELETE",
    })

    if (!res.success) throw new Error(res.message)
    return res.data
  })

export const archiveNoteFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number }) =>
    z.object({ id: z.number() }).parse(data)
  )
  .handler(async ({ data: { id } }) => {
    const res = await authenticatedFetch<Note>(`/notes/${id}/archive`, {
      method: "PATCH",
    })

    if (!res.success) throw new Error(res.message)
    return res.data
  })

export const unarchiveNoteFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number }) =>
    z.object({ id: z.number() }).parse(data)
  )
  .handler(async ({ data: { id } }) => {
    const res = await authenticatedFetch<Note>(`/notes/${id}/unarchive`, {
      method: "PATCH",
    })

    if (!res.success) throw new Error(res.message)
    return res.data
  })
