"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { CheckCircle, Clock, Download, Save } from "lucide-react"
import { jsPDF } from "jspdf"

export default function TestDetails({ test }) {
  const router = useRouter()
  const [marksObtained, setMarksObtained] = useState(test.marksObtained || "")
  const [notes, setNotes] = useState(test.notes || "")
  const [weakTopics, setWeakTopics] = useState(test.weakTopics || [])
  const [newWeakTopic, setNewWeakTopic] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSaveMarks = async () => {
    if (marksObtained === "" || isNaN(Number(marksObtained))) {
      toast({
        title: "Invalid marks",
        description: "Please enter a valid number for marks obtained",
        variant: "destructive",
      })
      return
    }

    if (Number(marksObtained) > test.maxMarks) {
      toast({
        title: "Invalid marks",
        description: `Marks cannot exceed maximum marks (${test.maxMarks})`,
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/tests/${test.testCode}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          marksObtained: Number(marksObtained),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update marks")
      }

      toast({
        title: "Marks updated",
        description: "Your marks have been saved successfully",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveNotes = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/tests/${test.testCode}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save notes")
      }

      toast({
        title: "Notes saved",
        description: "Your notes have been saved successfully",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddWeakTopic = async () => {
    if (!newWeakTopic.trim()) return

    if (weakTopics.includes(newWeakTopic.trim())) {
      toast({
        title: "Topic already exists",
        description: "This topic is already in your weak topics list",
        variant: "destructive",
      })
      return
    }

    const updatedWeakTopics = [...weakTopics, newWeakTopic.trim()]
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/tests/${test.testCode}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weakTopics: updatedWeakTopics,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update weak topics")
      }

      setWeakTopics(updatedWeakTopics)
      setNewWeakTopic("")

      toast({
        title: "Weak topic added",
        description: "Your weak topics have been updated",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemoveWeakTopic = async (topicToRemove) => {
    const updatedWeakTopics = weakTopics.filter((topic) => topic !== topicToRemove)
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/tests/${test.testCode}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weakTopics: updatedWeakTopics,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update weak topics")
      }

      setWeakTopics(updatedWeakTopics)

      toast({
        title: "Weak topic removed",
        description: "Your weak topics have been updated",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownloadNotes = () => {
    const doc = new jsPDF()

    // Add title
    doc.setFontSize(16)
    doc.text(`Notes: ${test.testName} (${test.testCode})`, 20, 20)

    // Add test details
    doc.setFontSize(12)
    doc.text(`Subject: ${test.subject}`, 20, 30)
    doc.text(`Max Marks: ${test.maxMarks}`, 20, 40)
    if (test.marksObtained) {
      doc.text(
        `Marks Obtained: ${test.marksObtained} (${((test.marksObtained / test.maxMarks) * 100).toFixed(1)}%)`,
        20,
        50,
      )
    }

    // Add concepts
    doc.setFontSize(14)
    doc.text("Concepts Covered:", 20, 65)
    doc.setFontSize(10)
    test.concepts.forEach((concept, index) => {
      doc.text(`• ${concept}`, 25, 75 + index * 7)
    })

    // Add weak topics if any
    let yPosition = 75 + test.concepts.length * 7 + 10
    if (weakTopics.length > 0) {
      doc.setFontSize(14)
      doc.text("Weak Topics:", 20, yPosition)
      doc.setFontSize(10)
      weakTopics.forEach((topic, index) => {
        doc.text(`• ${topic}`, 25, yPosition + 10 + index * 7)
      })
      yPosition = yPosition + 10 + weakTopics.length * 7 + 10
    }

    // Add notes
    doc.setFontSize(14)
    doc.text("Notes:", 20, yPosition)

    // Split notes into lines to fit the page
    const splitNotes = doc.splitTextToSize(notes, 170)
    doc.setFontSize(10)
    doc.text(splitNotes, 20, yPosition + 10)

    // Save the PDF
    doc.save(`${test.testCode}_notes.pdf`)

    toast({
      title: "Notes downloaded",
      description: "Your notes have been downloaded as a PDF",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{test.testName}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">{test.subject}</Badge>
            <Badge variant="secondary">{test.testCode}</Badge>
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
        </div>

        {notes && (
          <Button variant="outline" size="sm" onClick={handleDownloadNotes}>
            <Download className="mr-2 h-4 w-4" />
            Download Notes
          </Button>
        )}
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="weak-topics">Weak Topics</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Information</CardTitle>
              <CardDescription>Details about this mock test</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Concepts Covered</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {test.concepts.map((concept, index) => (
                    <li key={index} className="text-sm">
                      {concept}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Marks</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Maximum Marks</p>
                    <p className="font-medium">{test.maxMarks}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Marks Obtained</p>
                    {test.marksObtained !== null ? (
                      <p className="font-medium">
                        {test.marksObtained} ({((test.marksObtained / test.maxMarks) * 100).toFixed(1)}%)
                      </p>
                    ) : (
                      <p className="text-muted-foreground">Not attempted yet</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <Label htmlFor="marks">Update Marks</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    id="marks"
                    type="number"
                    min="0"
                    max={test.maxMarks}
                    value={marksObtained}
                    onChange={(e) => setMarksObtained(e.target.value)}
                    placeholder="Enter marks obtained"
                  />
                  <Button onClick={handleSaveMarks} disabled={isSubmitting}>
                    Save
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Study Notes</CardTitle>
              <CardDescription>Add your notes for this test</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write your notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[200px]"
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleDownloadNotes} disabled={!notes}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button onClick={handleSaveNotes} disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                Save Notes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="weak-topics">
          <Card>
            <CardHeader>
              <CardTitle>Weak Topics</CardTitle>
              <CardDescription>Track topics that need more attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add a weak topic..."
                  value={newWeakTopic}
                  onChange={(e) => setNewWeakTopic(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddWeakTopic()
                    }
                  }}
                />
                <Button onClick={handleAddWeakTopic} disabled={isSubmitting || !newWeakTopic.trim()}>
                  Add
                </Button>
              </div>

              {weakTopics.length > 0 ? (
                <div className="space-y-2">
                  {weakTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                      <span className="text-sm">{topic}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveWeakTopic(topic)}
                        disabled={isSubmitting}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">No weak topics added yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
