"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, TrendingDown, TrendingUp } from "lucide-react"

export default function ImprovementSuggestions({ testsData }) {
  // Only consider completed tests
  const completedTests = testsData.filter((test) => test.marksObtained !== null)

  if (completedTests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Improvement Suggestions</CardTitle>
          <CardDescription>Complete some tests to get personalized suggestions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-6 text-center">
            <p className="text-muted-foreground">No completed tests yet</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Group tests by subject
  const subjectGroups = completedTests.reduce((acc, test) => {
    if (!acc[test.subject]) {
      acc[test.subject] = []
    }
    acc[test.subject].push(test)
    return acc
  }, {})

  // Calculate average performance by subject
  const subjectPerformance = Object.entries(subjectGroups)
    .map(([subject, tests]) => {
      const avgPercentage =
        tests.reduce((sum, test) => sum + (test.marksObtained / test.maxMarks) * 100, 0) / tests.length

      return {
        subject,
        performance: avgPercentage,
        testsCount: tests.length,
      }
    })
    .sort((a, b) => a.performance - b.performance)

  // Get weakest and strongest subjects
  const weakestSubjects = subjectPerformance.slice(0, Math.min(2, subjectPerformance.length))
  const strongestSubjects = [...subjectPerformance]
    .sort((a, b) => b.performance - a.performance)
    .slice(0, Math.min(2, subjectPerformance.length))

  // Get all weak topics
  const allWeakTopics = completedTests
    .filter((test) => test.weakTopics.length > 0)
    .flatMap((test) =>
      test.weakTopics.map((topic) => ({
        topic,
        subject: test.subject,
        testCode: test.testCode,
      })),
    )

  // Count occurrences of each weak topic
  const topicCounts = allWeakTopics.reduce((acc, { topic, subject }) => {
    const key = `${subject}: ${topic}`
    if (!acc[key]) {
      acc[key] = { topic, subject, count: 0 }
    }
    acc[key].count += 1
    return acc
  }, {})

  // Get most frequent weak topics
  const frequentWeakTopics = Object.values(topicCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Generate suggestions
  const suggestions = []

  // Suggestion based on weakest subjects
  if (weakestSubjects.length > 0) {
    weakestSubjects.forEach((subject) => {
      suggestions.push({
        type: "subject",
        icon: TrendingDown,
        title: `Focus on ${subject.subject}`,
        description: `Your average score in ${subject.subject} is ${subject.performance.toFixed(1)}%, which is lower than other subjects.`,
      })
    })
  }

  // Suggestion based on frequent weak topics
  if (frequentWeakTopics.length > 0) {
    frequentWeakTopics.slice(0, 3).forEach((topic) => {
      suggestions.push({
        type: "topic",
        icon: Lightbulb,
        title: `Revise ${topic.topic}`,
        description: `This topic has been marked as weak ${topic.count} ${topic.count === 1 ? "time" : "times"} in ${topic.subject}.`,
      })
    })
  }

  // Suggestion based on strongest subjects
  if (strongestSubjects.length > 0) {
    strongestSubjects.forEach((subject) => {
      suggestions.push({
        type: "strength",
        icon: TrendingUp,
        title: `Maintain ${subject.subject} strength`,
        description: `Your average score in ${subject.subject} is ${subject.performance.toFixed(1)}%, which is strong. Keep it up!`,
      })
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Improvement Suggestions</CardTitle>
        <CardDescription>Personalized recommendations based on your performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex gap-4 p-4 bg-muted rounded-lg">
              <div className="mt-0.5">
                <suggestion.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{suggestion.title}</h3>
                  <Badge variant={suggestion.type === "strength" ? "outline" : "secondary"}>
                    {suggestion.type === "subject"
                      ? "Subject Focus"
                      : suggestion.type === "topic"
                        ? "Topic Review"
                        : "Strength"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{suggestion.description}</p>
              </div>
            </div>
          ))}

          {suggestions.length === 0 && (
            <div className="py-6 text-center">
              <p className="text-muted-foreground">
                Add more test results and mark weak topics to get personalized suggestions
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
