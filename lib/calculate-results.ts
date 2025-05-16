import { dimensionArchetypeMapping } from "@/data/archetypes"

type AnswerSet = Record<number, number | string>

// Define the dimensions
const dimensions = [
  "Self-Regulation vs. Impulsivity",
  "Time Management vs. Time Urgency",
  "Task Management vs. Task Reactivity",
  "Metacognitive Monitoring vs. Blind Execution",
  "Concentration vs. Distractibility",
  "Digital Literacy vs. Digital Overload",
  "Collaboration vs. Independence",
  "Adaptability vs. Rigidity",
  "Structured Note-Taking vs. Unstructured Capture",
  "Retention vs. Cramming",
  "Critical Thinking vs. Surface Learning",
  "Well-being Management vs. Burnout Vulnerability",
]

// Map questions to dimensions
const questionDimensions: Record<number, number> = {
  1: 0,
  2: 0,
  3: 0, // Self-Regulation vs. Impulsivity
  4: 1,
  5: 1,
  6: 1, // Time Management vs. Time Urgency
  7: 2,
  8: 2, // Task Management vs. Task Reactivity
  9: 3,
  10: 3, // Metacognitive Monitoring vs. Blind Execution
  11: 4,
  12: 4, // Concentration vs. Distractibility
  13: 5,
  14: 5, // Digital Literacy vs. Digital Overload
  15: 6,
  16: 6, // Collaboration vs. Independence
  17: 7,
  18: 7, // Adaptability vs. Rigidity
  19: 8,
  20: 8, // Structured Note-Taking vs. Unstructured Capture
  21: 9,
  22: 9, // Retention vs. Cramming
  23: 10,
  24: 10, // Critical Thinking vs. Surface Learning
  25: 11,
  26: 11, // Well-being Management vs. Burnout Vulnerability
}

// Questions that should be scored in reverse (7=1, 6=2, etc. for Likert)
const invertedQuestions = [2, 5, 10, 12, 14, 16, 18, 20, 24, 26]

// Map scenario answers to scores (A=7, B=5, C=4, D=2, E=1)
const scenarioScores: Record<string, number> = {
  A: 7, // Best option
  B: 5, // Good option
  C: 4, // Neutral option
  D: 2, // Poor option
  E: 1, // Worst option
}

interface DimensionResult {
  dimension: string
  score: number
}

interface ArchetypeScore {
  id: string
  score: number
  match: number // percentage match
}

interface AssessmentResult {
  dimensions: DimensionResult[]
  primaryArchetype: string
  secondaryArchetype: string
  archetypeScores: ArchetypeScore[]
}

export function calculateResults(answers: AnswerSet): AssessmentResult {
  // Initialize scores for each dimension
  const dimensionScores: number[] = Array(dimensions.length).fill(0)
  const dimensionCounts: number[] = Array(dimensions.length).fill(0)

  // Calculate scores based on answers
  Object.entries(answers).forEach(([questionIdStr, value]) => {
    const questionId = Number.parseInt(questionIdStr)
    const dimensionIndex = questionDimensions[questionId]

    let score: number

    // Handle Likert scale questions (numeric values)
    if (typeof value === "number") {
      // Adjust score if this is an inverted question
      score = invertedQuestions.includes(questionId) ? 8 - value : value
    }
    // Handle scenario questions (string values like 'A', 'B', etc.)
    else {
      score = scenarioScores[value] || 4 // Default to middle value if unknown
    }

    // Add to dimension score
    dimensionScores[dimensionIndex] += score
    dimensionCounts[dimensionIndex]++
  })

  // Calculate average scores for each dimension (0-100 scale)
  const normalizedScores = dimensionScores.map((score, index) => {
    if (dimensionCounts[index] === 0) return 50 // Default to middle if no data

    // Convert from 1-7 scale to 0-100 scale
    const avgScore = score / dimensionCounts[index]
    return Math.round(((avgScore - 1) / 6) * 100)
  })

  // Create dimension results
  const dimensionResults = dimensions.map((name, index) => ({
    dimension: name,
    score: normalizedScores[index],
  }))

  // Calculate archetype scores based on dimension results
  const archetypeScores: Record<string, number> = {
    organizer: 0,
    deepDiver: 0,
    collaborator: 0,
    adaptiveLearner: 0,
    reflectiveThinker: 0,
  }

  // For each dimension, add weighted scores to each archetype
  dimensionResults.forEach((result) => {
    const dimensionName = result.dimension
    const dimensionScore = result.score / 100 // Convert to 0-1 scale for weighting

    // Get the archetype weights for this dimension
    const archetypeWeights = dimensionArchetypeMapping[dimensionName]

    // Add weighted scores to each archetype
    if (archetypeWeights) {
      Object.entries(archetypeWeights).forEach(([archetypeId, weight]) => {
        archetypeScores[archetypeId] += dimensionScore * weight
      })
    }
  })

  // Calculate total possible score for normalization
  const totalPossibleScore = Object.values(dimensionArchetypeMapping).reduce((total, weights) => {
    const dimensionMax = Math.max(...Object.values(weights))
    return total + dimensionMax
  }, 0)

  // Normalize and sort archetype scores
  const normalizedArchetypeScores = Object.entries(archetypeScores).map(([id, score]) => ({
    id,
    score,
    match: Math.round((score / totalPossibleScore) * 100),
  }))

  // Sort by score (descending)
  normalizedArchetypeScores.sort((a, b) => b.score - a.score)

  // Get primary and secondary archetypes
  const primaryArchetype = normalizedArchetypeScores[0]?.id || "organizer"
  const secondaryArchetype = normalizedArchetypeScores[1]?.id || "deepDiver"

  return {
    dimensions: dimensionResults,
    primaryArchetype,
    secondaryArchetype,
    archetypeScores: normalizedArchetypeScores,
  }
}
