"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function PerformanceTrendChart({ testsData }) {
  // Group tests by subject
  const subjectGroups = testsData.reduce((acc, test) => {
    if (!acc[test.subject]) {
      acc[test.subject] = []
    }
    acc[test.subject].push(test)
    return acc
  }, {})

  // Calculate average performance by subject over time
  const subjectPerformanceByTest = {}

  Object.entries(subjectGroups).forEach(([subject, tests]) => {
    const completedTests = tests
      .filter((test) => test.marksObtained !== null)
      .sort((a, b) => a.testCode.localeCompare(b.testCode))

    completedTests.forEach((test) => {
      const testCode = test.testCode
      if (!subjectPerformanceByTest[testCode]) {
        subjectPerformanceByTest[testCode] = {
          testCode,
          testName: test.testName,
        }
      }

      subjectPerformanceByTest[testCode][subject] = (test.marksObtained / test.maxMarks) * 100
    })
  })

  // Convert to array and sort by test code
  const chartData = Object.values(subjectPerformanceByTest).sort((a, b) => a.testCode.localeCompare(b.testCode))

  // Get unique subjects for the chart
  const subjects = Object.keys(subjectGroups)

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const testData = chartData.find((item) => item.testCode === label)

      return (
        <div className="bg-background p-3 border rounded-md shadow-sm">
          <p className="font-medium">{testData.testName}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
          <div className="mt-2">
            {payload.map((entry, index) => (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.name}: {entry.value.toFixed(1)}%
              </p>
            ))}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Trend</CardTitle>
        <CardDescription>Subject-wise performance over time</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="testCode" tick={{ fontSize: 12 }} tickFormatter={(value) => value.replace("PT", "")} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <Tooltip content={<CustomTooltip />} />

              {subjects.map((subject, index) => (
                <Area
                  key={subject}
                  type="monotone"
                  dataKey={subject}
                  name={subject}
                  stackId="1"
                  stroke={getSubjectColor(subject)}
                  fill={getSubjectColor(subject)}
                  fillOpacity={0.3}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">No performance data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Helper function to get a color for each subject
function getSubjectColor(subject) {
  const colorMap = {
    Polity: "hsl(var(--primary))",
    History: "hsl(var(--destructive))",
    Economy: "hsl(var(--warning))",
    Geography: "hsl(var(--success))",
    Science: "hsl(var(--info))",
  }

  return colorMap[subject] || `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`
}
