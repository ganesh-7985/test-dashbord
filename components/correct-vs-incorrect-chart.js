"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export default function CorrectVsIncorrectChart({ testsData }) {
  // Calculate total marks obtained and total possible marks
  const completedTests = testsData.filter((test) => test.marksObtained !== null)
  const totalMarksObtained = completedTests.reduce((sum, test) => sum + test.marksObtained, 0)
  const totalPossibleMarks = completedTests.reduce((sum, test) => sum + test.maxMarks, 0)
  const totalIncorrectMarks = totalPossibleMarks - totalMarksObtained

  // Prepare data for the chart
  const chartData = [
    { name: "Correct", value: totalMarksObtained },
    { name: "Incorrect", value: totalIncorrectMarks },
  ]

  // Colors for the chart
  const COLORS = ["hsl(var(--primary))", "hsl(var(--destructive))"]

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / totalPossibleMarks) * 100).toFixed(1)
      return (
        <div className="bg-background p-3 border rounded-md shadow-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">Marks: {payload[0].value}</p>
          <p className="text-sm">Percentage: {percentage}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Correct vs Incorrect</CardTitle>
        <CardDescription>Distribution of correct and incorrect answers</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {completedTests.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">No test data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
