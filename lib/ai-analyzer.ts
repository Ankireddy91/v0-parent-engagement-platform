interface SentimentAnalysis {
  sentiment: "positive" | "neutral" | "negative"
  score: number
  urgency: "low" | "normal" | "high" | "urgent"
  department: string
  summary: string
  keywords: string[]
}

const POSITIVE_WORDS = [
  "excellent",
  "great",
  "wonderful",
  "amazing",
  "fantastic",
  "love",
  "impressed",
  "satisfied",
  "happy",
  "pleased",
  "appreciate",
  "thank",
  "grateful",
  "proud",
  "best",
  "professional",
  "helpful",
  "supportive",
  "excellent",
  "commend",
]

const NEGATIVE_WORDS = [
  "terrible",
  "awful",
  "horrible",
  "disappointed",
  "frustrated",
  "angry",
  "upset",
  "poor",
  "bad",
  "worst",
  "fail",
  "failure",
  "problem",
  "issue",
  "complaint",
  "concerned",
  "worried",
  "difficult",
  "unacceptable",
  "poor",
  "inadequate",
  "negligent",
  "irresponsible",
  "unprofessional",
]

const URGENT_KEYWORDS = [
  "urgent",
  "immediately",
  "asap",
  "emergency",
  "critical",
  "danger",
  "safety",
  "harassment",
  "discrimination",
  "abuse",
  "unsafe",
  "health",
  "medical",
]

const DEPARTMENT_KEYWORDS: Record<string, string[]> = {
  academic: ["course", "grade", "curriculum", "professor", "teacher", "class", "exam", "assignment", "lecture"],
  facilities: ["building", "dorm", "facility", "maintenance", "repair", "clean", "room", "cafeteria", "parking"],
  "student-life": ["club", "event", "activity", "social", "community", "student", "dormitory", "residence"],
  financial: ["tuition", "fee", "cost", "bill", "refund", "financial", "scholarship", "aid", "payment"],
  health: ["health", "counseling", "mental", "wellness", "medical", "nurse", "doctor", "therapy"],
  admin: ["administration", "policy", "registration", "enrollment", "procedure", "bureaucracy", "document"],
}

function calculateSentimentScore(text: string): { sentiment: "positive" | "neutral" | "negative"; score: number } {
  const lowerText = text.toLowerCase()

  let positiveCount = 0
  let negativeCount = 0

  POSITIVE_WORDS.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi")
    const matches = lowerText.match(regex)
    if (matches) positiveCount += matches.length
  })

  NEGATIVE_WORDS.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi")
    const matches = lowerText.match(regex)
    if (matches) negativeCount += matches.length
  })

  let score = 5
  let sentiment: "positive" | "neutral" | "negative" = "neutral"

  if (positiveCount > negativeCount) {
    sentiment = "positive"
    score = Math.min(10, 5 + positiveCount * 1.5)
  } else if (negativeCount > positiveCount) {
    sentiment = "negative"
    score = Math.max(1, 5 - negativeCount * 1.5)
  }

  return { sentiment, score: Math.round(score) }
}

function determineDepartment(text: string, category: string): string {
  const lowerText = text.toLowerCase()

  let maxMatches = 0
  let bestDept = "admin"

  Object.entries(DEPARTMENT_KEYWORDS).forEach(([dept, keywords]) => {
    const matches = keywords.filter((kw) => lowerText.includes(kw)).length
    if (matches > maxMatches) {
      maxMatches = matches
      bestDept = dept
    }
  })

  // Map form category to department if no keywords found
  const categoryMap: Record<string, string> = {
    Academic: "academic",
    Facilities: "facilities",
    "Student Life": "student-life",
    Financial: "financial",
    "Health & Wellness": "health",
    Administrative: "admin",
  }

  return categoryMap[category] || bestDept
}

function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().split(/\s+/)
  const stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "is",
    "was",
    "are",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "should",
    "could",
    "may",
    "might",
  ])

  const keywords = words.filter((w) => w.length > 4 && !stopWords.has(w)).slice(0, 5)

  return [...new Set(keywords)]
}

export async function analyzeFeedback(subject: string, message: string, category: string): Promise<SentimentAnalysis> {
  const fullText = `${subject} ${message}`
  const { sentiment, score } = calculateSentimentScore(fullText)

  // Determine urgency based on sentiment and keywords
  let urgency: "low" | "normal" | "high" | "urgent" = "normal"
  const lowerText = fullText.toLowerCase()

  if (sentiment === "negative" && score <= 3) {
    urgency = "urgent"
  } else if (sentiment === "negative" && score <= 5) {
    urgency = "high"
  } else if (URGENT_KEYWORDS.some((kw) => lowerText.includes(kw))) {
    urgency = "urgent"
  } else if (sentiment === "positive") {
    urgency = "low"
  }

  const department = determineDepartment(fullText, category)
  const keywords = extractKeywords(fullText)
  const summary = `${sentiment.charAt(0).toUpperCase() + sentiment.slice(1)} feedback about ${category.toLowerCase()}`

  return {
    sentiment,
    score,
    urgency,
    department,
    summary,
    keywords,
  }
}

export async function generateAgentSuggestion(message: string, category: string): Promise<string> {
  const suggestions: Record<string, string> = {
    Academic:
      "Thank you for bringing this academic concern to our attention. We take student learning outcomes seriously and will review your feedback with the relevant faculty. Our team will reach out to you within 3-5 business days with a detailed response.",
    Facilities:
      "We appreciate your feedback regarding our facilities. Your input helps us maintain a safe and comfortable campus environment. Please expect a response from our facilities management team within 2-3 business days.",
    "Student Life":
      "Thank you for engaging with us about student life at our university. We value your perspective and will ensure this reaches our student affairs team for review and action within 3-5 business days.",
    Financial:
      "We understand your financial concerns are important. Our financial aid office will carefully review your feedback and contact you shortly to discuss potential solutions.",
    "Health & Wellness":
      "Your wellbeing matters to us. We will share your feedback with our health and wellness team, who will prioritize your concern and follow up with you promptly.",
    Administrative:
      "Thank you for your feedback on our administrative processes. We are committed to continuous improvement and will review your input with the appropriate department.",
  }

  return (
    suggestions[category] ||
    "Thank you for sharing your feedback with us. We value your input and will review your concern promptly. Our team will be in touch within 3-5 business days."
  )
}

export async function extractActionItems(feedbackMessage: string): Promise<string[]> {
  const items: string[] = []
  const lines = feedbackMessage.split(/[.!?]+/)

  lines.forEach((line) => {
    const trimmed = line.trim()
    if (trimmed.length > 0) {
      // Take up to 5 meaningful sentences as action items
      if (items.length < 5 && trimmed.split(/\s+/).length >= 3) {
        items.push(trimmed)
      }
    }
  })

  return items.length > 0 ? items : ["Review and respond to parent feedback"]
}
