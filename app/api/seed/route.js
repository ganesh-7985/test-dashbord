import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Test from "@/models/Test"

const initialData = [
  {
    testCode: "PT24007",
    testName: "Polity Part 1",
    subject: "Polity",
    concepts: [
      "Indian Constitution- Historical underpinnings",
      "Evolution, Making of the Constitution",
      "Significant Polity Provisions",
      "Preamble of Constitution",
      "Fundamental Rights and Duties",
      "Directive Principles",
      "Federal System, Centre-State Relations, Emergency Provisions",
    ],
    maxMarks: 200,
    marksObtained: null,
    weakTopics: [],
    notes: "",
  },
  {
    testCode: "PT24008",
    testName: "Polity Part 2",
    subject: "Polity",
    concepts: [
      "Parliament and State Legislatures",
      "Union Executive and State Executive",
      "Judiciary: Supreme Court and High Courts",
      "Constitutional and Non-Constitutional Bodies",
      "Union Territories and Local Government",
      "Elections and Official Language",
    ],
    maxMarks: 200,
    marksObtained: null,
    weakTopics: [],
    notes: "",
  },
  {
    testCode: "PT24009",
    testName: "Modern India Part 1",
    subject: "History",
    concepts: [
      "Advent of Europeans in India",
      "British Expansion and Consolidation",
      "Early Resistance Movements",
      "Revolt of 1857",
      "Socio-Religious Reform Movements",
      "Pre-INC Nationalism",
    ],
    maxMarks: 200,
    marksObtained: null,
    weakTopics: [],
    notes: "",
  },
  {
    testCode: "PT24010",
    testName: "Modern India Part 2",
    subject: "History",
    concepts: [
      "INC and Moderate Phase",
      "Extremist and Revolutionary Activities",
      "Gandhian Phase Movements",
      "Constitutional Developments",
      "Economic Impact of British Rule",
      "Peasant and Worker Movements",
    ],
    maxMarks: 200,
    marksObtained: null,
    weakTopics: [],
    notes: "",
  },
  {
    testCode: "PT24011",
    testName: "Ancient India and Art & Culture",
    subject: "History",
    concepts: [
      "Stone Age to Pre-Harappan Phase",
      "Indus Valley Civilization",
      "Vedic Periods",
      "Buddhism and Jainism",
      "Mauryan Empire",
      "Gupta Empire",
      "Sangam Period and South Indian Dynasties",
      "Indian Art, Architecture and Sculpture",
    ],
    maxMarks: 200,
    marksObtained: null,
    weakTopics: [],
    notes: "",
  },
  {
    testCode: "PT24012",
    testName: "Medieval India",
    subject: "History",
    concepts: [
      "Pratiharas, Palas, Chalukyas, Rashtrakutas",
      "Delhi Sultanate Dynasties",
      "Bhakti and Sufi Movements",
      "Mughal Empire",
      "Marathas",
      "Medieval Art, Culture and Architecture",
    ],
    maxMarks: 200,
    marksObtained: null,
    weakTopics: [],
    notes: "",
  },
  {
    testCode: "PT24013",
    testName: "Economy Part 1",
    subject: "Economy",
    concepts: [
      "Economic Growth and Development",
      "Inflation, Monetary and Fiscal Policy",
      "Money and Banking",
      "Financial Market Instruments",
      "Banking Reforms",
      "Public Finance and Budgeting",
    ],
    maxMarks: 200,
    marksObtained: null,
    weakTopics: [],
    notes: "",
  },
]

export async function GET() {
  try {
    await connectToDatabase()

    // Clear existing data
    await Test.deleteMany({})

    // Insert seed data
    await Test.insertMany(initialData)

    return NextResponse.json({ message: "Database seeded successfully" })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
