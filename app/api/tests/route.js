import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Test from "@/models/Test"

export async function GET() {
  try {
    await connectToDatabase()
    const tests = await Test.find({}).sort({ testCode: 1 })
    return NextResponse.json(tests)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
