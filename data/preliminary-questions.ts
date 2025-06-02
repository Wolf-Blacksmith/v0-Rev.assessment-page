export interface PreliminaryQuestion {
  id: number
  text: string
  type: "multiple-choice" | "text"
  category: string
  options?: {
    label: string
    value: string
  }[]
}

export const preliminaryQuestions: PreliminaryQuestion[] = [
  {
    id: 1,
    text: "Which faculty are you currently enrolled in?",
    type: "multiple-choice",
    category: "academic-background",
    options: [
      { label: "Arts & Humanities", value: "arts-humanities" },
      { label: "Engineering", value: "engineering" },
      { label: "Business/Management", value: "business" },
      { label: "Sciences", value: "sciences" },
      { label: "Social Sciences", value: "social-sciences" },
      { label: "Education", value: "education" },
      { label: "Law", value: "law" },
      { label: "Other", value: "other" },
    ],
  },
  {
    id: 2,
    text: "What is your current year or level of study?",
    type: "multiple-choice",
    category: "academic-background",
    options: [
      { label: "Year 1 (Freshman)", value: "year-1" },
      { label: "Year 2 (Sophomore)", value: "year-2" },
      { label: "Year 3 (Junior)", value: "year-3" },
      { label: "Year 4+ (Senior/Final year)", value: "year-4" },
      { label: "Postgraduate/Master's/PhD", value: "postgraduate" },
    ],
  },
  {
    id: 3,
    text: "Approximately how many credit hours or courses are you taking this semester?",
    type: "multiple-choice",
    category: "academic-background",
    options: [
      { label: "1-2 courses", value: "1-2" },
      { label: "3-4 courses", value: "3-4" },
      { label: "5-6 courses", value: "5-6" },
      { label: "7+ courses", value: "7+" },
    ],
  },
  {
    id: 4,
    text: "What are your main academic goals? (Select all that apply)",
    type: "multiple-choice",
    category: "goals",
    options: [
      { label: "Improve grades", value: "grades" },
      { label: "Better time management", value: "time-management" },
      { label: "Develop better study habits", value: "habits" },
      { label: "Reduce stress and anxiety", value: "stress-reduction" },
      { label: "Improve focus and concentration", value: "focus" },
    ],
  },
]
