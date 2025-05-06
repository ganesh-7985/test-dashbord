import { Suspense } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import AnalyticsHeader from "@/components/analytics-header"
import SubjectDistributionChart from "@/components/subject-distribution-chart"
import PerformanceTrendChart from "@/components/performance-trend-chart"
import TopWeakTopicsChart from "@/components/top-weak-topics-chart"
import ImprovementSuggestions from "@/components/improvement-suggestions"
import LoadingSpinner from "@/components/loading-spinner"
import { getTestsData } from "@/lib/data"

export default async function AnalyticsPage() {
  const testsData = await getTestsData()

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <AnalyticsHeader />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Suspense fallback={<LoadingSpinner />}>
            <SubjectDistributionChart testsData={testsData} />
          </Suspense>

          <Suspense fallback={<LoadingSpinner />}>
            <TopWeakTopicsChart testsData={testsData} />
          </Suspense>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <PerformanceTrendChart testsData={testsData} />
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <ImprovementSuggestions testsData={testsData} />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}
