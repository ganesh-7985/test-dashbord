import { notFound } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import TestDetails from "@/components/test-details"
import { getTestByCode, getTestsData } from "@/lib/data"

export async function generateStaticParams() {
  const tests = await getTestsData()

  return tests.map((test) => ({
    testCode: test.testCode,
  }))
}

export default async function TestPage({ params }) {
  const test = await getTestByCode(params.testCode)

  if (!test) {
    notFound()
  }

  return (
    <DashboardLayout>
      <TestDetails test={test} />
    </DashboardLayout>
  )
}
