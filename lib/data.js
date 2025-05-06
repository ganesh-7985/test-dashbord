export async function getTestsData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/tests`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch tests")
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching tests:", error)
    return []
  }
}

export async function getTestByCode(testCode) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/tests/${testCode}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error("Failed to fetch test")
    }

    return response.json()
  } catch (error) {
    console.error(`Error fetching test ${testCode}:`, error)
    return null
  }
}

export async function getTestsWithNotes() {
  try {
    const tests = await getTestsData()
    return tests.filter((test) => test.notes && test.notes.trim() !== "")
  } catch (error) {
    console.error("Error fetching tests with notes:", error)
    return []
  }
}
