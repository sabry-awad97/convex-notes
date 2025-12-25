import { Button } from '@/components/ui/button'
import { useNotes } from '@/hooks/useNotes'
import { createFileRoute } from '@tanstack/react-router'
import { FileText, Loader2, Pencil, PlusIcon, Trash2 } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: NotesApp,
})

function NotesApp() {
  const { notes, isLoading, createNote, updateNote, deleteNote } = useNotes()
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleCreate = async () => {
    if (!title.trim() || !content.trim()) return
    await createNote({ title, content })
    setTitle('')
    setContent('')
    setIsCreating(false)
  }

  const handleUpdate = async (id: string) => {
    if (!title.trim() || !content.trim()) return
    await updateNote({ id: id as any, title, content })
    setTitle('')
    setContent('')
    setEditingId(null)
  }

  const handleDelete = async (id: string) => {
    await deleteNote({ id: id as any })
  }

  const startEdit = (note: any) => {
    setEditingId(note._id)
    setTitle(note.title)
    setContent(note.content)
    setIsCreating(false)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setIsCreating(false)
    setTitle('')
    setContent('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-4">
            📝 Convex Notes
          </h1>
          <p className="text-slate-400 text-lg">
            Self-hosted • Real-time • Rust + React
          </p>
        </div>

        {/* Create Button */}
        {!isCreating && !editingId && (
          <div className="flex justify-center mb-8">
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-105"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              New Note
            </Button>
          </div>
        )}

        {/* Create/Edit Form */}
        {(isCreating || editingId) && (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-slate-700/50 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4">
              {isCreating ? '✨ Create New Note' : '✏️ Edit Note'}
            </h2>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-700/50 text-white placeholder-slate-400 rounded-xl px-4 py-3 mb-4 border border-slate-600/50 focus:border-purple-500 focus:outline-none transition-colors"
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full bg-slate-700/50 text-white placeholder-slate-400 rounded-xl px-4 py-3 mb-4 border border-slate-600/50 focus:border-purple-500 focus:outline-none transition-colors resize-none"
            />
            <div className="flex gap-3">
              <Button
                onClick={() =>
                  editingId ? handleUpdate(editingId) : handleCreate()
                }
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-2 rounded-xl transition-all duration-300"
              >
                {editingId ? 'Update' : 'Create'}
              </Button>
              <Button
                onClick={cancelEdit}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 px-6 py-2 rounded-xl transition-all duration-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Notes List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            <span className="ml-3 text-slate-400">Loading notes...</span>
          </div>
        ) : notes?.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">
              No notes yet. Create your first one!
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {notes?.map((note) => (
              <div
                key={note._id}
                className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-lg hover:border-purple-500/50 transition-all duration-300 group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {note.title}
                    </h3>
                    <p className="text-slate-400 whitespace-pre-wrap">
                      {note.content}
                    </p>
                    <p className="text-slate-600 text-sm mt-3">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => startEdit(note)}
                      variant="ghost"
                      size="icon"
                      className="text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-xl"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(note._id)}
                      variant="ghost"
                      size="icon"
                      className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
