type AnswerSet = Record<number, number>

// Categories mapped to archetypes
const categoryMapping: Record<string, string[]> = {
  environment: ["focused", "practical"],
  social: ["collaborative", "explorer"],
  organization: ["focused", "conceptual"],
  curiosity: ["explorer", "conceptual"],
  tactile: ["practical", "collaborative"],
  focus: ["focused", "visual"],
  visual: ["visual", "conceptual"],
  time: ["focused", "practical"],
  conceptual: ["conceptual", "explorer"],
  memory: ["visual", "focused"],
  auditory: ["collaborative", "conceptual"],
  creativity: ["explorer", "visual"],
  consistency: ["focused", "practical"],
}

// Questions from our data file mapped to their categories
const questionCategories: Record<number, string> = {
  1: "environment",
  2: "social",
  3: "organization",
  4: "curiosity",
  5: "tactile",
  6: "focus",
  7: "visual",
  8: "social",
  9: "time",
  10: "conceptual",
  11: "tactile",
  12: "organization",
  13: "conceptual",
  14: "social", // Note: This is inverse (prefer to study alone)
  15: "memory",
  16: "focus", // Note: This is inverse (easily distracted)
  17: "auditory",
  18: "creativity",
  19: "environment",
  20: "consistency",
}

// Questions that should be scored in reverse (5=1, 4=2, etc.)
const inverseQuestions = [14, 16]

export function calculateArchetype(answers: AnswerSet): string {
  // Initialize scores for each archetype
  const archetypeScores: Record<string, number> = {
    focused: 0,
    collaborative: 0,
    visual: 0,
    explorer: 0,
    practical: 0,
    conceptual: 0,
  }

  // Calculate scores based on answers
  Object.entries(answers).forEach(([questionIdStr, value]) => {
    const questionId = Number.parseInt(questionIdStr)
    const category = questionCategories[questionId]

    // Adjust score if this is an inverse question
    const adjustedValue = inverseQuestions.includes(questionId) ? 6 - value : value

    // Add points to associated archetypes
    if (category && categoryMapping[category]) {
      categoryMapping[category].forEach((archetype) => {
        archetypeScores[archetype] += adjustedValue
      })
    }
  })

  // Find the archetype with the highest score
  let highestScore = 0
  let dominantArchetype = "focused" // Default

  Object.entries(archetypeScores).forEach(([archetype, score]) => {
    if (score > highestScore) {
      highestScore = score
      dominantArchetype = archetype
    }
  })

  return dominantArchetype
}
