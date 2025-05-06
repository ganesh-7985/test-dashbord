import { Suspense } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import TestsList from "@/components/tests-list"
import LoadingSpinner from "@/components/loading-spinner"
import { getTestsData } from "@/lib/data"

export default async function TestsPage() {
  const testsData = await getTestsData()

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Mock Tests</h1>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <TestsList testsData={testsData} />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}
