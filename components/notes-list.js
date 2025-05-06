import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function NotesList({ testsWithNotes }) {
  return (
    <div className="space-y-6">
      {testsWithNotes.length > 0 ? (
        <div className="grid gap-4">
          {testsWithNotes.map((test) => (
            <Card key={test.testCode}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{test.testName}</span>
                      <Badge variant="outline">{test.subject}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{test.testCode}</p>
                    <div className="mt-2">
                      <p className="text-sm line-clamp-2">{test.notes}</p>
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
          <p className="text-muted-foreground">No notes found</p>
          <Link href="/tests">
            <Button variant="link" className="mt-2">
              Go to tests to add notes
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
