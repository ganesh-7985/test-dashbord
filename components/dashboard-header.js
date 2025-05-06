import { ModeToggle } from "@/components/mode-toggle"

export default function DashboardHeader() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Track your UPSC preparation progress</p>
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
      </div>
    </div>
  )
}
