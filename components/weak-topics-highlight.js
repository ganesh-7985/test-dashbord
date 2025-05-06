import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function WeakTopicsHighlight({ testsData }) {
  // Get all weak topics from completed tests
  const allWeakTopics = testsData
    .filter((test) => test.marksObtained !== null && test.weakTopics.length > 0)
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

  // Sort by count (most frequent first)
  const sortedTopics = Object.values(topicCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5) // Show only top 5 weak topics

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weak Topics</CardTitle>
        <CardDescription>Areas that need more attention</CardDescription>
      </CardHeader>
      <CardContent>
        {sortedTopics.length > 0 ? (
          <div className="space-y-4">
            {sortedTopics.map(({ topic, subject, count }, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{topic}</span>
                  <Badge variant={count > 1 ? "destructive" : "outline"}>
                    {count > 1 ? `${count} tests` : "1 test"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{subject}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-muted-foreground">No weak topics identified yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
