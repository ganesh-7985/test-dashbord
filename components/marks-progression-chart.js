"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function MarksProgressionChart({ testsData }) {
  // Filter tests with marks and sort by test code
  const completedTests = testsData
    .filter((test) => test.marksObtained !== null)
    .sort((a, b) => a.testCode.localeCompare(b.testCode))

  // Prepare data for the chart
  const chartData = completedTests.map((test) => ({
    name: test.testCode,
    marks: test.marksObtained,
    percentage: (test.marksObtained / test.maxMarks) * 100,
    maxMarks: test.maxMarks,
    testName: test.testName,
  }))

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background p-3 border rounded-md shadow-sm">
          <p className="font-medium">{data.testName}</p>
          <p className="text-sm">
            Marks: {data.marks}/{data.maxMarks}
          </p>
          <p className="text-sm">Percentage: {data.percentage.toFixed(1)}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Marks Progression</CardTitle>
        <CardDescription>Your performance trend over time</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} tickFormatter={(value) => value.replace("PT", "")} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="percentage"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">No completed tests yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
