import { Suspense } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import NotesList from "@/components/notes-list"
import LoadingSpinner from "@/components/loading-spinner"
import { getTestsWithNotes } from "@/lib/data"

export default async function NotesPage() {
  const testsWithNotes = await getTestsWithNotes()

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Study Notes</h1>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <NotesList testsWithNotes={testsWithNotes} />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}
