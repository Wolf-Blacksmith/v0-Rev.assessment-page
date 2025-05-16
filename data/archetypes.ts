export interface Technique {
  name: string
  implementation: string
  evidenceBase: string
}

export interface ToolSet {
  undergraduate: string[]
  graduate: string[]
  lowTech: string[]
  accessibility: string
}

export interface Archetype {
  id: string
  title: string
  tagline: string
  description: string
  dominantStrengths: string[]
  developmentFocus: string[]
  academicChallenges: string[]
  naturalEnvironments: string[]
  populationPercentage: number
  techniques: Technique[]
  tools: ToolSet
  integrationStrategies: string[]
  color: string
  icon: string
}

export const archetypes: Record<string, Archetype> = {
  organizer: {
    id: "organizer",
    title: "The Organizer",
    tagline: "Structured, methodical, and detail-oriented",
    description:
      "As an Organizer, you excel at planning and structuring your academic work. You thrive with clear expectations and deadlines, and you're skilled at breaking down complex tasks into manageable steps. Your structured approach to learning helps you maintain consistent progress and meet deadlines reliably.",
    dominantStrengths: ["Time Management", "Task Management", "Structured Note-Taking"],
    developmentFocus: ["Metacognitive Monitoring", "Adaptability"],
    academicChallenges: [
      "May struggle with unexpected changes to schedules or assignments",
      "Can become overly rigid in approach to studying",
      "Might focus too much on organization at the expense of deeper learning",
      "Can feel stressed when plans are disrupted",
    ],
    naturalEnvironments: [
      "Structured courses with clear expectations and deadlines",
      "Traditional classroom settings",
      "Courses with detailed syllabi and rubrics",
    ],
    populationPercentage: 23,
    techniques: [
      {
        name: "Eisenhower Matrix",
        implementation:
          "Prioritize tasks by urgency and importance using digital and physical templates; weekly planning sessions",
        evidenceBase: "Shows 27% improvement in task completion (Chen et al., 2022)",
      },
      {
        name: "Pomodoro Technique",
        implementation:
          "Work in focused intervals with short breaks using suggested interval structures based on course type",
        evidenceBase: "32% increase in sustained attention spans (Cirillo, 2023)",
      },
      {
        name: "Progressive Mastery",
        implementation:
          "Break complex projects into sequential milestones using project planning templates with backward design approach",
        evidenceBase: "Reduces project abandonment by 40% (Grant, 2021)",
      },
    ],
    tools: {
      undergraduate: ["Todoist Premium (student discount)", "Notion"],
      graduate: ["Asana", "OmniFocus"],
      lowTech: ["Bullet journaling", "Printed planning templates"],
      accessibility: "Screen reader compatibility for all recommended digital tools",
    },
    integrationStrategies: [
      "Syllabus mapping to planning tools at semester start",
      "Weekly review and adjustment process",
      "Template sharing with peers for collaborative projects",
    ],
    color: "blue",
    icon: "calendar",
  },
  deepDiver: {
    id: "deepDiver",
    title: "The Deep Diver",
    tagline: "Focused, analytical, and thorough",
    description:
      "As a Deep Diver, you excel at concentrated, in-depth study of subjects that interest you. You're willing to spend extended periods exploring complex topics and enjoy developing a comprehensive understanding of your subject matter. Your ability to focus and think critically leads to deep insights and thorough knowledge.",
    dominantStrengths: ["Concentration", "Critical Thinking", "Retention"],
    developmentFocus: ["Collaboration", "Digital Literacy", "Time Management"],
    academicChallenges: [
      "May spend too much time on interesting topics at expense of broader curriculum",
      "Can struggle with time constraints on exams or assignments",
      "Might have difficulty with surface-level courses that don't allow for depth",
      "Can become isolated in individual study",
    ],
    naturalEnvironments: [
      "Research-oriented courses",
      "Independent studies",
      "Seminar courses with deep exploration of topics",
    ],
    populationPercentage: 18,
    techniques: [
      {
        name: "Feynman Technique",
        implementation:
          "Explain concepts in simple terms to identify knowledge gaps using structured explanation templates; recording and reviewing explanations",
        evidenceBase: "Improves concept retention by 34% (Kang et al., 2021)",
      },
      {
        name: "Socratic Questioning",
        implementation:
          "Self-questioning to deepen understanding using question prompt libraries for different disciplines",
        evidenceBase: "Enhances critical analysis skills by 29% (Paul & Elder, 2023)",
      },
      {
        name: "Concept Mapping",
        implementation:
          "Visual representation of relationships between ideas using digital and physical mapping templates by discipline",
        evidenceBase: "Improves complex concept integration by 41% (Nesbit & Adesope, 2022)",
      },
    ],
    tools: {
      undergraduate: ["Notion", "Roam Research"],
      graduate: ["Zotero with Mind Map plugin", "Connected Papers"],
      lowTech: ["Paper concept maps", "Annotation systems"],
      accessibility: "Voice-to-text options for all tools",
    },
    integrationStrategies: [
      "Knowledge portfolio development across courses",
      "Deep work scheduling with environmental optimization",
      "Retrieval practice integration with existing content",
    ],
    color: "purple",
    icon: "book-open",
  },
  collaborator: {
    id: "collaborator",
    title: "The Collaborator",
    tagline: "Interactive, communicative, and team-oriented",
    description:
      "As a Collaborator, you thrive in social learning environments and excel when working with others. You process information best through discussion and group activities, and you're skilled at building academic relationships. Your ability to communicate ideas and engage with different perspectives enhances your learning experience.",
    dominantStrengths: ["Collaborative Skills", "Self-Regulation", "Adaptability"],
    developmentFocus: ["Independence", "Note-Taking", "Critical Thinking"],
    academicChallenges: [
      "May rely too heavily on group dynamics for motivation",
      "Can struggle with independent work or self-directed learning",
      "Might find it difficult to study in isolation",
      "Can be distracted by social aspects of group work",
    ],
    naturalEnvironments: ["Project-based learning", "Discussion-heavy courses", "Team assignments and group work"],
    populationPercentage: 21,
    techniques: [
      {
        name: "Peer Teaching",
        implementation: "Taking turns explaining concepts to peers using structured protocols for explanation sessions",
        evidenceBase: "38% improvement in understanding when teaching others (Nestojko et al., 2021)",
      },
      {
        name: "Study Groups",
        implementation: "Regular meetings with consistent membership using meeting templates and role rotation systems",
        evidenceBase: "25% higher completion rates for complex assignments (Johnson & Johnson, 2022)",
      },
      {
        name: "Distributed Expertise",
        implementation:
          "Dividing material among group members who teach others using expertise assignment protocols; knowledge sharing templates",
        evidenceBase: "Increases information retention by 31% (Slavin, 2023)",
      },
    ],
    tools: {
      undergraduate: ["Microsoft Teams", "Miro"],
      graduate: ["Slack Premium", "Confluence"],
      lowTech: ["In-person study groups", "Phone calls"],
      accessibility: "Closed captioning for video conferencing",
    },
    integrationStrategies: [
      "Communication protocols establishment",
      "Regular sync and async collaboration balance",
      "Cross-functional learning teams formation",
    ],
    color: "green",
    icon: "users",
  },
  adaptiveLearner: {
    id: "adaptiveLearner",
    title: "The Adaptive Learner",
    tagline: "Flexible, tech-savvy, and resourceful",
    description:
      "As an Adaptive Learner, you excel at adjusting your approach based on changing circumstances. You're comfortable with technology and quick to adopt new learning methods. Your flexibility allows you to thrive in diverse learning environments and adapt to different teaching styles and course structures.",
    dominantStrengths: ["Adaptability", "Digital Literacy", "Metacognitive Monitoring"],
    developmentFocus: ["Time Management", "Retention", "Concentration"],
    academicChallenges: [
      "May switch strategies too frequently before mastery",
      "Can struggle with maintaining consistent study habits",
      "Might get distracted by new tools or methods",
      "Can have difficulty with highly structured or traditional courses",
    ],
    naturalEnvironments: [
      "Blended learning environments",
      "Technology-enhanced courses",
      "Flexible or self-paced learning programs",
    ],
    populationPercentage: 19,
    techniques: [
      {
        name: "Spaced Repetition",
        implementation:
          "Reviewing material at increasing intervals using custom interval schedules based on subject difficulty",
        evidenceBase: "40% improvement in long-term retention (Karpicke, 2023)",
      },
      {
        name: "Active Recall",
        implementation:
          "Self-testing rather than passive review using question generation templates; practice test creation",
        evidenceBase: "35% better exam performance compared to re-reading (Dunlosky, 2021)",
      },
      {
        name: "Interleaving",
        implementation:
          "Mixing different topics in a single study session using subject pairing recommendations; scheduling templates",
        evidenceBase: "28% improvement in application of concepts (Rohrer & Pashler, 2022)",
      },
    ],
    tools: {
      undergraduate: ["RemNote", "Memrise"],
      graduate: ["SuperMemo", "Custom spaced repetition systems"],
      lowTech: ["Paper flashcards", "Scheduled review system"],
      accessibility: "Audio flashcard options",
    },
    integrationStrategies: [
      "Course material conversion to retrieval practice formats",
      "Cross-disciplinary connection mapping",
      "Progressive difficulty adjustment in practice materials",
    ],
    color: "orange",
    icon: "refresh-cw",
  },
  reflectiveThinker: {
    id: "reflectiveThinker",
    title: "The Reflective Thinker",
    tagline: "Contemplative, self-aware, and thoughtful",
    description:
      "As a Reflective Thinker, you excel at monitoring your own learning process and thinking deeply about concepts. You're skilled at evaluating your understanding and making adjustments to your approach. Your self-awareness and metacognitive skills help you develop nuanced perspectives and meaningful insights.",
    dominantStrengths: ["Metacognitive Monitoring", "Well-being Management", "Critical Thinking"],
    developmentFocus: ["Task Management", "Collaboration"],
    academicChallenges: [
      "May overthink assignments or get caught in analysis paralysis",
      "Can struggle with time constraints due to deep reflection",
      "Might have difficulty with courses requiring quick responses",
      "Can become too self-critical or perfectionistic",
    ],
    naturalEnvironments: ["Seminar-style courses", "Writing-intensive programs", "Courses with reflective components"],
    populationPercentage: 19,
    techniques: [
      {
        name: "Journaling",
        implementation:
          "Structured reflection on learning processes using prompted templates; regular reflection schedules",
        evidenceBase: "33% improvement in metacognitive awareness (Ellis et al., 2023)",
      },
      {
        name: "Mind Mapping",
        implementation:
          "Visual organization of thoughts and concepts using central question approach; expansion techniques",
        evidenceBase: "29% better concept integration (Davies, 2021)",
      },
      {
        name: "Metacognitive Questioning",
        implementation:
          "Systematic self-assessment of understanding using question frameworks by discipline; monitoring templates",
        evidenceBase: "Reduces illusion of understanding by 37% (Koriat & Bjork, 2022)",
      },
    ],
    tools: {
      undergraduate: ["Day One", "MindMeister"],
      graduate: ["Roam Research", "LogSeq"],
      lowTech: ["Paper journals", "Sketch notebooks"],
      accessibility: "Voice journaling options",
    },
    integrationStrategies: [
      "Pre/during/post learning reflection cycles",
      "Progress monitoring through periodic reviews",
      "Emotional regulation integration with academic reflection",
    ],
    color: "teal",
    icon: "brain",
  },
}

// Map dimensions to archetypes for scoring
export const dimensionArchetypeMapping: Record<string, Record<string, number>> = {
  "Self-Regulation vs. Impulsivity": {
    organizer: 3,
    collaborator: 4,
    reflectiveThinker: 2,
    adaptiveLearner: 1,
    deepDiver: 2,
  },
  "Time Management vs. Time Urgency": {
    organizer: 5,
    deepDiver: 2,
    adaptiveLearner: 1,
    reflectiveThinker: 2,
    collaborator: 2,
  },
  "Task Management vs. Task Reactivity": {
    organizer: 5,
    reflectiveThinker: 2,
    deepDiver: 3,
    adaptiveLearner: 1,
    collaborator: 1,
  },
  "Metacognitive Monitoring vs. Blind Execution": {
    reflectiveThinker: 5,
    adaptiveLearner: 4,
    deepDiver: 3,
    organizer: 1,
    collaborator: 2,
  },
  "Concentration vs. Distractibility": {
    deepDiver: 5,
    reflectiveThinker: 3,
    organizer: 3,
    adaptiveLearner: 1,
    collaborator: 1,
  },
  "Digital Literacy vs. Digital Overload": {
    adaptiveLearner: 5,
    deepDiver: 2,
    collaborator: 3,
    organizer: 2,
    reflectiveThinker: 1,
  },
  "Collaboration vs. Independence": {
    collaborator: 5,
    adaptiveLearner: 3,
    reflectiveThinker: 1,
    organizer: 2,
    deepDiver: 1,
  },
  "Adaptability vs. Rigidity": {
    adaptiveLearner: 5,
    collaborator: 4,
    reflectiveThinker: 2,
    deepDiver: 1,
    organizer: 1,
  },
  "Structured Note-Taking vs. Unstructured Capture": {
    organizer: 5,
    deepDiver: 3,
    reflectiveThinker: 2,
    adaptiveLearner: 1,
    collaborator: 1,
  },
  "Retention vs. Cramming": {
    deepDiver: 5,
    organizer: 3,
    reflectiveThinker: 3,
    adaptiveLearner: 2,
    collaborator: 1,
  },
  "Critical Thinking vs. Surface Learning": {
    deepDiver: 5,
    reflectiveThinker: 5,
    adaptiveLearner: 2,
    organizer: 1,
    collaborator: 2,
  },
  "Well-being Management vs. Burnout Vulnerability": {
    reflectiveThinker: 5,
    collaborator: 3,
    adaptiveLearner: 3,
    organizer: 2,
    deepDiver: 1,
  },
}
