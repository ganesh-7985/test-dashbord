import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function UpcomingTests({ testsData }) {
  // Get pending tests (tests with no marks)
  const pendingTests = testsData
    .filter((test) => test.marksObtained === null)
    .sort((a, b) => a.testCode.localeCompare(b.testCode))
    .slice(0, 5) // Show only the first 5 pending tests

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Tests</CardTitle>
        <CardDescription>Tests that need to be completed</CardDescription>
      </CardHeader>
      <CardContent>
        {pendingTests.length > 0 ? (
          <div className="space-y-4">
            {pendingTests.map((test) => (
              <div key={test.testCode} className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{test.testName}</span>
                    <Badge variant="outline">{test.subject}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {test.testCode} • {test.maxMarks} marks
                  </p>
                </div>
                <Link href={`/tests/${test.testCode}`}>
                  <Button variant="ghost" size="icon">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}

            {pendingTests.length < testsData.filter((test) => test.marksObtained === null).length && (
              <Link href="/tests">
                <Button variant="link" className="w-full">
                  View all pending tests
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-muted-foreground">All tests completed!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
