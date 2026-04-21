import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"

import { notesQueryparams } from "./-queryParams"

import { useRemoveNoteMutation } from "@/features/notes/mutations/remove-note-mutation"
import { useUnarchiveNoteMutation } from "@/features/notes/mutations/unarchive-note-mutation"
import { getNotesQueryOptions } from "@/features/notes/queries/notes-query"
import {
  getCategoriesQueryOptions,
  useCategoriesQuery,
} from "@/features/categories/queries/categories-query"

import { NoteForm } from "@/features/notes/components/NoteForm"
import { NoteCard } from "@/features/notes/components/NoteCard"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@ui/dialog"

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  ComboboxClear,
  useComboboxAnchor,
} from "@ui/combobox"

import type { Note } from "@/features/notes/schema"
import type { Category } from "@/features/categories/schema"

export const Route = createFileRoute("/_protected/notes/archived")({
  validateSearch: (search) => notesQueryparams.parse(search),
  loaderDeps: ({ search }) => ({ search }),
  loader: ({ context, deps }) => {
    context.queryClient.ensureQueryData(
      getNotesQueryOptions({ archived: true, ...deps.search })
    )

    context.queryClient.ensureQueryData(getCategoriesQueryOptions())
  },
  component: ArchivedNotesList,
})

function ArchivedNotesList() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const { data: notes } = useSuspenseQuery(
    getNotesQueryOptions({ archived: true, ...search })
  )
  const [isOpen, setIsOpen] = useState(false)
  const [noteToEdit, setNoteToEdit] = useState<Note | undefined>()

  const comboboxAnchor = useComboboxAnchor()

  const categoriesQuery = useCategoriesQuery()

  const unarchiveMutation = useUnarchiveNoteMutation()
  const removeMutation = useRemoveNoteMutation()

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setNoteToEdit(undefined)
    }
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h3 className="text-2xl font-bold">Archived Notes</h3>
        {categoriesQuery.data && categoriesQuery.data.length > 0 && (
          <div className="mt-2">
            <Combobox
              multiple
              value={categoriesQuery.data.filter((c) =>
                search.categoryIds?.includes(c.id)
              )}
              items={categoriesQuery.data}
              onValueChange={(val) => {
                navigate({
                  search: (prev) => ({
                    ...prev,
                    categoryIds:
                      val.length > 0 ? val.map((c) => c.id) : undefined,
                  }),
                })
              }}
              filter={(val, query) =>
                val.name.toLowerCase().includes(query.toLowerCase())
              }
            >
              <ComboboxChips
                ref={comboboxAnchor}
                className="max-w-md bg-transparent p-1 shadow-none focus-within:ring-0"
              >
                <ComboboxValue>
                  {(values: Category[]) => (
                    <>
                      {values.map((val) => (
                        <ComboboxChip key={val.id}>{val.name}</ComboboxChip>
                      ))}
                      <ComboboxChipsInput placeholder="Filter by categories..." />
                    </>
                  )}
                </ComboboxValue>
                <ComboboxClear />
              </ComboboxChips>

              <ComboboxContent anchor={comboboxAnchor}>
                <ComboboxList>
                  {(category: Category) => (
                    <ComboboxItem key={category.id} value={category}>
                      {category.name}
                    </ComboboxItem>
                  )}
                </ComboboxList>
                <ComboboxEmpty>No categories found.</ComboboxEmpty>
              </ComboboxContent>
            </Combobox>
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          <NoteForm
            noteToEdit={noteToEdit}
            onSuccess={() => handleOpenChange(false)}
          />
        </DialogContent>
      </Dialog>

      {notes.length === 0 ? (
        <p className="text-muted-foreground">No archived notes found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onUnarchive={(id) => unarchiveMutation.mutate(id)}
              onDelete={(id) => {
                if (confirm("Are you sure you want to delete this note?")) {
                  removeMutation.mutate(id)
                }
              }}
              onEdit={(note) => {
                setNoteToEdit(note)
                setIsOpen(true)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
