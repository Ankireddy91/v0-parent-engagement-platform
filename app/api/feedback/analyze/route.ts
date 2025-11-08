import { analyzeFeedback, generateAgentSuggestion, extractActionItems } from "@/lib/ai-analyzer"

export async function POST(request: Request) {
  try {
    const { feedbackId, subject, message, category } = await request.json()

    const analysis = await analyzeFeedback(subject, message, category)
    const suggestion = await generateAgentSuggestion(message, category)
    const actionItems = await extractActionItems(message)

    return Response.json({
      success: true,
      analysis: {
        ...analysis,
        actionItems,
      },
      suggestion,
    })
  } catch (error) {
    console.error("Error analyzing feedback:", error)
    return Response.json({ error: "Failed to analyze feedback" }, { status: 500 })
  }
}
