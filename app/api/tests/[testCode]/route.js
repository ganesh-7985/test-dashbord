import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Test from "@/models/Test"

export async function GET(request, { params }) {
  try {
    await connectToDatabase()
    const test = await Test.findOne({ testCode: params.testCode })

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 })
    }

    return NextResponse.json(test)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request, { params }) {
  try {
    const body = await request.json()
    await connectToDatabase()

    const test = await Test.findOne({ testCode: params.testCode })

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 })
    }

    const updatedTest = await Test.findOneAndUpdate({ testCode: params.testCode }, { $set: body }, { new: true })

    return NextResponse.json(updatedTest)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
