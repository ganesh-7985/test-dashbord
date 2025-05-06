"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts"

export default function SubjectPerformanceChart({ testsData }) {
  // Group tests by subject
  const subjectGroups = testsData.reduce((acc, test) => {
    if (!acc[test.subject]) {
      acc[test.subject] = []
    }
    acc[test.subject].push(test)
    return acc
  }, {})

  // Calculate average performance by subject
  const subjectPerformance = Object.entries(subjectGroups).map(([subject, tests]) => {
    const completedTests = tests.filter((test) => test.marksObtained !== null)
    const avgPercentage =
      completedTests.length > 0
        ? completedTests.reduce((sum, test) => sum + (test.marksObtained / test.maxMarks) * 100, 0) /
          completedTests.length
        : 0

    return {
      subject,
      performance: avgPercentage,
      testsCompleted: completedTests.length,
      totalTests: tests.length,
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subject Performance</CardTitle>
        <CardDescription>Strengths and weaknesses across subjects</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {subjectPerformance.some((item) => item.performance > 0) ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={subjectPerformance}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <Radar
                name="Performance"
                dataKey="performance"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">No subject performance data yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
