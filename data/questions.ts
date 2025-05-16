export type QuestionType = "likert" | "scenario"

export interface Option {
  label: string
  value: string
}

export interface Question {
  id: number
  text: string
  type: QuestionType
  category: string
  dimension: string
  options?: Option[]
  inverted?: boolean // For Likert questions where higher score means lower trait
}

export const questions: Question[] = [
  // 1. Self-Regulation vs. Impulsivity
  {
    id: 1,
    text: "I set specific goals for each study session and stick to them.",
    type: "likert",
    category: "self-regulation",
    dimension: "Self-Regulation vs. Impulsivity",
  },
  {
    id: 2,
    text: "I often switch tasks without finishing what I started (e.g., I begin an assignment, then check social media mid-way).",
    type: "likert",
    category: "self-regulation",
    dimension: "Self-Regulation vs. Impulsivity",
    inverted: true,
  },
  {
    id: 3,
    text: "If you're in the middle of studying and a friend invites you to a party, you would…",
    type: "scenario",
    category: "self-regulation",
    dimension: "Self-Regulation vs. Impulsivity",
    options: [
      { label: "Politely decline and keep studying until you hit your goal.", value: "A" },
      { label: "Tell them you'll join later, then finish your study block first.", value: "B" },
      { label: "Study for a bit longer, then go for a short while.", value: "C" },
      { label: "Pause studying and go to the party, planning to resume afterward.", value: "D" },
      { label: "Drop your study plans and head straight to the party.", value: "E" },
    ],
  },

  // 2. Time Management vs. Time Urgency
  {
    id: 4,
    text: "You have a big project due in two weeks. You would…",
    type: "scenario",
    category: "time-management",
    dimension: "Time Management vs. Time Urgency",
    options: [
      { label: "Break it into clear tasks with deadlines and follow that schedule.", value: "A" },
      { label: "Write down the tasks now, but tweak the plan as you go.", value: "B" },
      { label: "Start most parts early but leave some pieces for the last few days.", value: "C" },
      { label: "Delay most of it until the final 2–3 days before it's due.", value: "D" },
      { label: "Put it all off and cram it into one long session right before the deadline.", value: "E" },
    ],
  },
  {
    id: 5,
    text: "I often feel like I don't have enough time to complete all my study tasks.",
    type: "likert",
    category: "time-management",
    dimension: "Time Management vs. Time Urgency",
    inverted: true,
  },
  {
    id: 6,
    text: "I schedule specific hours each week for studying and try to stick to that schedule.",
    type: "likert",
    category: "time-management",
    dimension: "Time Management vs. Time Urgency",
  },

  // 3. Task Management vs. Task Reactivity
  {
    id: 7,
    text: "I keep a clear, prioritized list of study tasks and follow it during my study sessions.",
    type: "likert",
    category: "task-management",
    dimension: "Task Management vs. Task Reactivity",
  },
  {
    id: 8,
    text: 'A new, "urgent" study task comes up while you\'re working on something else. You would…',
    type: "scenario",
    category: "task-management",
    dimension: "Task Management vs. Task Reactivity",
    options: [
      { label: "Finish your current task before even looking at the new one.", value: "A" },
      { label: "Jot down the new task, then complete your current one first.", value: "B" },
      { label: "Switch immediately to the new task, planning to return later.", value: "C" },
      { label: "Drop your original task and focus fully on the new request.", value: "D" },
      { label: "Abandon both tasks and do something completely different.", value: "E" },
    ],
  },

  // 4. Metacognitive Monitoring vs. Blind Execution
  {
    id: 9,
    text: "I regularly stop during studying to check if I really understand the material before moving on.",
    type: "likert",
    category: "metacognition",
    dimension: "Metacognitive Monitoring vs. Blind Execution",
  },
  {
    id: 10,
    text: "I often only realize I didn't fully understand something after I've already completed the task.",
    type: "likert",
    category: "metacognition",
    dimension: "Metacognitive Monitoring vs. Blind Execution",
    inverted: true,
  },

  // 5. Concentration vs. Distractibility
  {
    id: 11,
    text: "I can usually focus on studying even if I'm in a noisy or distracting environment.",
    type: "likert",
    category: "concentration",
    dimension: "Concentration vs. Distractibility",
  },
  {
    id: 12,
    text: "Minor interruptions (like a phone notification or noise) often derail my focus when I'm studying.",
    type: "likert",
    category: "concentration",
    dimension: "Concentration vs. Distractibility",
    inverted: true,
  },

  // 6. Digital Literacy vs. Digital Overload
  {
    id: 13,
    text: "I enjoy trying new educational apps or tools and usually learn how to use them quickly.",
    type: "likert",
    category: "digital-literacy",
    dimension: "Digital Literacy vs. Digital Overload",
  },
  {
    id: 14,
    text: "My phone or computer notifications frequently interrupt my studying.",
    type: "likert",
    category: "digital-literacy",
    dimension: "Digital Literacy vs. Digital Overload",
    inverted: true,
  },

  // 7. Collaboration vs. Independence
  {
    id: 15,
    text: "I enjoy collaborating with classmates (studying together or working on projects) to learn or solve problems.",
    type: "likert",
    category: "collaboration",
    dimension: "Collaboration vs. Independence",
  },
  {
    id: 16,
    text: "I usually prefer to study or solve academic problems on my own rather than asking others for help.",
    type: "likert",
    category: "collaboration",
    dimension: "Collaboration vs. Independence",
    inverted: true,
  },

  // 8. Adaptability vs. Rigidity
  {
    id: 17,
    text: "When my study plan changes unexpectedly, I can quickly adapt and come up with a new plan.",
    type: "likert",
    category: "adaptability",
    dimension: "Adaptability vs. Rigidity",
  },
  {
    id: 18,
    text: "Changes to my schedule or study plan often make me feel stressed or anxious.",
    type: "likert",
    category: "adaptability",
    dimension: "Adaptability vs. Rigidity",
    inverted: true,
  },

  // 9. Structured Note-Taking vs. Unstructured Capture
  {
    id: 19,
    text: "I organize my notes with headings, bullet points, or diagrams to keep information clear.",
    type: "likert",
    category: "note-taking",
    dimension: "Structured Note-Taking vs. Unstructured Capture",
  },
  {
    id: 20,
    text: "I often write notes in a hurry without organizing them, resulting in confusing scribbles.",
    type: "likert",
    category: "note-taking",
    dimension: "Structured Note-Taking vs. Unstructured Capture",
    inverted: true,
  },

  // 10. Retention vs. Cramming
  {
    id: 21,
    text: "I review my class notes and materials regularly throughout the term, not just before exams.",
    type: "likert",
    category: "retention",
    dimension: "Retention vs. Cramming",
  },
  {
    id: 22,
    text: "An exam is one week away. You would…",
    type: "scenario",
    category: "retention",
    dimension: "Retention vs. Cramming",
    options: [
      { label: "Review your notes weekly throughout the term and continue that habit.", value: "A" },
      { label: "Do some early review but still plan for a couple of cramming sessions.", value: "B" },
      { label: "Wait until 2–3 days before and then study intensively.", value: "C" },
      { label: "Begin studying the night before the exam only.", value: "D" },
      { label: "Skip scheduled review and try to learn everything during the exam itself.", value: "E" },
    ],
  },

  // 11. Critical Thinking vs. Surface Learning
  {
    id: 23,
    text: "I try to understand the underlying ideas behind what I learn, rather than just memorizing facts.",
    type: "likert",
    category: "critical-thinking",
    dimension: "Critical Thinking vs. Surface Learning",
  },
  {
    id: 24,
    text: "I often rely on rote memorization instead of understanding the concepts deeply.",
    type: "likert",
    category: "critical-thinking",
    dimension: "Critical Thinking vs. Surface Learning",
    inverted: true,
  },

  // 12. Well-being Management vs. Burnout Vulnerability
  {
    id: 25,
    text: "I regularly take breaks and practice self-care (like exercise or relaxation) to manage stress during study periods.",
    type: "likert",
    category: "well-being",
    dimension: "Well-being Management vs. Burnout Vulnerability",
  },
  {
    id: 26,
    text: "I often force myself to keep studying even when I'm physically or mentally exhausted.",
    type: "likert",
    category: "well-being",
    dimension: "Well-being Management vs. Burnout Vulnerability",
    inverted: true,
  },
]
