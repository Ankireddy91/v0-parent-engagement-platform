export interface Feedback {
  id: string
  parentName: string
  email: string
  studentName: string
  content: string
  createdAt: string
  sentiment: "positive" | "neutral" | "negative"
  category: string
  status: "submitted" | "responded"
  agentResponse: string | null
  agentReaction: string | null
  isRead: boolean
  responseDate?: string
}
