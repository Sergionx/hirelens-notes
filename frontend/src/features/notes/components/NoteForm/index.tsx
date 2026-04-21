import { useForm } from "@tanstack/react-form"

import { useCreateNoteMutation } from "@/features/notes/mutations/create-note-mutation"
import { useUpdateNoteMutation } from "@/features/notes/mutations/update-note-mutation"
import { CreateNoteSchema, type Note } from "@/features/notes/schema"

import { useCategoriesQuery } from "@/features/categories/queries/categories-query"

import { Button } from "@ui/button"
import { Input } from "@ui/input"
import { Textarea } from "@ui/textarea"
import { Field, FieldLabel, FieldError, FieldGroup } from "@ui/field"
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
  useComboboxAnchor,
} from "@ui/combobox"

import type { Category } from "@/features/categories/schema"

interface NoteFormProps {
  noteToEdit?: Note
  onSuccess?: () => void
}

export function NoteForm({ noteToEdit, onSuccess }: NoteFormProps) {
  const createNoteMutation = useCreateNoteMutation()
  const updateNoteMutation = useUpdateNoteMutation()
  const categoriesQuery = useCategoriesQuery()

  const comboboxAnchor = useComboboxAnchor()

  const isEditing = !!noteToEdit

  const form = useForm({
    defaultValues: {
      title: noteToEdit?.title ?? "",
      content: noteToEdit?.content ?? "",
      categoryIds: noteToEdit?.categories?.map((c) => c.id) ?? [],
    },
    validators: {
      onSubmit: CreateNoteSchema,
    },
    onSubmit: async ({ value }) => {
      if (isEditing && noteToEdit) {
        await updateNoteMutation.mutateAsync({
          id: noteToEdit.id,
          data: value,
        })
      } else {
        await createNoteMutation.mutateAsync(value)
      }
      onSuccess?.()
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      <FieldGroup>
        <form.Field
          name="title"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Note title"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />

        <form.Field
          name="content"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Content</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Note content"
                  rows={5}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />

        {categoriesQuery.status === "pending" ? (
          <p>Loading categories...</p>
        ) : categoriesQuery.status === "error" ? (
          <p>Error loading categories</p>
        ) : (
          <form.Field
            name="categoryIds"
            children={(field) => {
              return (
                <Field>
                  <FieldLabel>Categories</FieldLabel>
                  <Combobox
                    multiple
                    value={categoriesQuery.data.filter((c) =>
                      field.state.value.includes(c.id)
                    )}
                    items={categoriesQuery.data}
                    onValueChange={(val) =>
                      field.handleChange(val.map((c) => c.id))
                    }
                    filter={(val, query) =>
                      val.name.toLowerCase().includes(query.toLowerCase())
                    }
                  >
                    <ComboboxChips ref={comboboxAnchor}>
                      <ComboboxValue>
                        {(values: Category[]) => (
                          <>
                            {values.map((val) => (
                              <ComboboxChip key={val.id}>
                                {val.name}
                              </ComboboxChip>
                            ))}
                            <ComboboxChipsInput
                              placeholder="Select categories..."
                              aria-label="Input"
                            />
                          </>
                        )}
                      </ComboboxValue>
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
                </Field>
              )
            }}
          />
        )}
      </FieldGroup>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit} className="w-full">
            {isSubmitting
              ? isEditing
                ? "Updating..."
                : "Creating..."
              : isEditing
                ? "Update Note"
                : "Create Note"}
          </Button>
        )}
      />
    </form>
  )
}
