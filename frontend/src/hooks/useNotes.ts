import { api } from '@/integrations/convex/api'
import { useMutation, useQuery } from 'convex/react'

export function useNotes() {
  const notes = useQuery(api.notes.list)
  const createNote = useMutation(api.notes.create)
  const updateNote = useMutation(api.notes.update)
  const deleteNote = useMutation(api.notes.remove)

  return {
    notes,
    isLoading: notes === undefined,
    createNote,
    updateNote,
    deleteNote,
  }
}

export function useNote(id: string) {
  const note = useQuery(api.notes.get, { id: id as any })
  return {
    note,
    isLoading: note === undefined,
  }
}
