"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function TopWeakTopicsChart({ testsData }) {
  // Get all weak topics from completed tests
  const allWeakTopics = testsData
    .filter((test) => test.marksObtained !== null && test.weakTopics.length > 0)
    .flatMap((test) =>
      test.weakTopics.map((topic) => ({
        topic,
        subject: test.subject,
      })),
    )

  // Count occurrences of each weak topic
  const topicCounts = allWeakTopics.reduce((acc, { topic, subject }) => {
    const key = topic
    if (!acc[key]) {
      acc[key] = { topic, subject, count: 0 }
    }
    acc[key].count += 1
    return acc
  }, {})

  // Sort by count (most frequent first) and take top 10
  const chartData = Object.values(topicCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-md shadow-sm">
          <p className="font-medium">{payload[0].payload.topic}</p>
          <p className="text-sm">Subject: {payload[0].payload.subject}</p>
          <p className="text-sm">
            Frequency: {payload[0].value} {payload[0].value === 1 ? "test" : "tests"}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Weak Topics</CardTitle>
        <CardDescription>Most frequently identified weak areas</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} horizontal={false} />
              <XAxis type="number" />
              <YAxis
                type="category"
                dataKey="topic"
                tick={{ fontSize: 12 }}
                width={150}
                tickFormatter={(value) => (value.length > 20 ? `${value.substring(0, 20)}...` : value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="hsl(var(--destructive))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">No weak topics identified yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
