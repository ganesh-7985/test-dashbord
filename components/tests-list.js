"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, CheckCircle, Clock } from "lucide-react"

export default function TestsList({ testsData }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Get unique subjects for filter
  const subjects = [...new Set(testsData.map((test) => test.subject))]

  // Apply filters
  const filteredTests = testsData.filter((test) => {
    // Search filter
    const matchesSearch =
      test.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.testCode.toLowerCase().includes(searchQuery.toLowerCase())

    // Subject filter
    const matchesSubject = subjectFilter === "all" || test.subject === subjectFilter

    // Status filter
    const isCompleted = test.marksObtained !== null
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "completed" && isCompleted) ||
      (statusFilter === "pending" && !isCompleted)

    return matchesSearch && matchesSubject && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <Input
          placeholder="Search tests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:w-1/3"
        />

        <div className="flex flex-1 gap-4">
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredTests.length > 0 ? (
        <div className="grid gap-4">
          {filteredTests.map((test) => (
            <Card key={test.testCode}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{test.testName}</span>
                      <Badge variant="outline">{test.subject}</Badge>
                      {test.marksObtained !== null ? (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          <span>Completed</span>
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Pending</span>
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {test.testCode} • {test.maxMarks} marks
                      {test.marksObtained !== null &&
                        ` • Score: ${test.marksObtained} (${((test.marksObtained / test.maxMarks) * 100).toFixed(1)}%)`}
                    </p>
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Topics:</span> {test.concepts.slice(0, 3).join(", ")}
                        {test.concepts.length > 3 && "..."}
                      </p>
                    </div>
                  </div>
                  <Link href={`/tests/${test.testCode}`}>
                    <Button variant="ghost" size="icon">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No tests found matching your filters</p>
        </div>
      )}
    </div>
  )
}
