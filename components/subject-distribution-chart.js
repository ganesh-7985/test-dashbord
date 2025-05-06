"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export default function SubjectDistributionChart({ testsData }) {
  // Group tests by subject
  const subjectGroups = testsData.reduce((acc, test) => {
    if (!acc[test.subject]) {
      acc[test.subject] = []
    }
    acc[test.subject].push(test)
    return acc
  }, {})

  // Prepare data for the chart
  const chartData = Object.entries(subjectGroups).map(([subject, tests]) => ({
    name: subject,
    value: tests.length,
    color: getSubjectColor(subject),
  }))

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-md shadow-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">{payload[0].value} tests</p>
          <p className="text-sm">{((payload[0].value / testsData.length) * 100).toFixed(1)}% of total</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subject Distribution</CardTitle>
        <CardDescription>Breakdown of tests by subject</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
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
