import mongoose from "mongoose"

const TestSchema = new mongoose.Schema(
  {
    testCode: {
      type: String,
      required: true,
      unique: true,
    },
    testName: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    concepts: {
      type: [String],
      default: [],
    },
    maxMarks: {
      type: Number,
      required: true,
    },
    marksObtained: {
      type: Number,
      default: null,
    },
    weakTopics: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
)

// Check if the model already exists to prevent overwriting
const Test = mongoose.models.Test || mongoose.model("Test", TestSchema)

export default Test
