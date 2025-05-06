import { Suspense } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import DashboardHeader from "@/components/dashboard-header"
import OverviewCards from "@/components/overview-cards"
import MarksProgressionChart from "@/components/marks-progression-chart"
import SubjectPerformanceChart from "@/components/subject-performance-chart"
import CorrectVsIncorrectChart from "@/components/correct-vs-incorrect-chart"
import UpcomingTests from "@/components/upcoming-tests"
import WeakTopicsHighlight from "@/components/weak-topics-highlight"
import LoadingSpinner from "@/components/loading-spinner"
import { getTestsData } from "@/lib/data"

export default async function DashboardPage() {
  const testsData = await getTestsData()

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <DashboardHeader />

        <Suspense fallback={<LoadingSpinner />}>
          <OverviewCards testsData={testsData} />
        </Suspense>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Suspense fallback={<LoadingSpinner />}>
            <MarksProgressionChart testsData={testsData} />
          </Suspense>

          <Suspense fallback={<LoadingSpinner />}>
            <CorrectVsIncorrectChart testsData={testsData} />
          </Suspense>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <SubjectPerformanceChart testsData={testsData} />
        </Suspense>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Suspense fallback={<LoadingSpinner />}>
            <UpcomingTests testsData={testsData} />
          </Suspense>

          <Suspense fallback={<LoadingSpinner />}>
            <WeakTopicsHighlight testsData={testsData} />
          </Suspense>
        </div>
      </div>
    </DashboardLayout>
  )
}
