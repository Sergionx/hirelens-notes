import {
  MoreVertical,
  Edit,
  ArchiveRestore,
  Archive,
  Trash2,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

import type { Note } from "@/features/notes/schema"

interface NoteCardProps {
  note: Note
  onEdit: (note: Note) => void
  onDelete: (id: number) => void
  onArchive?: (id: number) => void
  onUnarchive: (id: number) => void
}

export function NoteCard({
  note,
  onEdit,
  onDelete,
  onArchive,
  onUnarchive,
}: NoteCardProps) {
  return (
    <Card className="relative flex h-full flex-col">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex flex-1 items-center gap-2 overflow-hidden">
          {note.isArchived && (
            <HugeiconsIcon
              icon={Archive}
              className="h-4 w-4 shrink-0 text-muted-foreground"
            />
          )}
          <CardTitle className="truncate text-lg leading-tight font-bold">
            {note.title}
          </CardTitle>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <HugeiconsIcon icon={MoreVertical} className="h-4 w-4" />
              </Button>
            }
          ></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(note)}>
              <HugeiconsIcon icon={Edit} className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            {note.isArchived ? (
              <DropdownMenuItem onClick={() => onUnarchive(note.id)}>
                <HugeiconsIcon icon={ArchiveRestore} className="mr-2 h-4 w-4" />
                <span>Unarchive</span>
              </DropdownMenuItem>
            ) : (
              onArchive && (
                <DropdownMenuItem onClick={() => onArchive(note.id)}>
                  <HugeiconsIcon icon={Archive} className="mr-2 h-4 w-4" />
                  <span>Archive</span>
                </DropdownMenuItem>
              )
            )}
            <DropdownMenuItem
              onClick={() => onDelete(note.id)}
              className="text-red-600 focus:text-red-600"
            >
              <HugeiconsIcon icon={Trash2} className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <p className="line-clamp-6 text-sm whitespace-pre-wrap text-muted-foreground">
          {note.content}
        </p>

        {note.categories && note.categories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {note.categories.map((category) => (
              <Badge
                key={category.id}
                variant="secondary"
                className="px-1.5 py-0 text-[10px]"
              >
                {category.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end pt-0">
        <span className="text-xs text-muted-foreground">
          {new Date(note.updatedAt).toLocaleDateString()}
        </span>
      </CardFooter>
    </Card>
  )
}
