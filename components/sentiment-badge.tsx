import { Card } from "@/components/ui/card"

interface SentimentBadgeProps {
  sentiment: "positive" | "neutral" | "negative"
  score: number
  urgency: "low" | "normal" | "high" | "urgent"
  summary: string
  keywords: string[]
}

export function SentimentBadge({ sentiment, score, urgency, summary, keywords }: SentimentBadgeProps) {
  const sentimentColors = {
    positive: "bg-green-100 text-green-800 border-green-300",
    neutral: "bg-blue-100 text-blue-800 border-blue-300",
    negative: "bg-red-100 text-red-800 border-red-300",
  }

  const urgencyColors = {
    low: "bg-green-50 text-green-700",
    normal: "bg-blue-50 text-blue-700",
    high: "bg-orange-50 text-orange-700",
    urgent: "bg-red-50 text-red-700",
  }

  return (
    <Card className={`p-4 border-2 ${sentimentColors[sentiment]}`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm">AI Analysis</p>
            <p className="text-xs opacity-75 mt-1">Sentiment: {sentiment.toUpperCase()}</p>
          </div>
          <div className="text-3xl font-bold">{score}/10</div>
        </div>

        <div>
          <p className="text-xs font-medium mb-1">Summary:</p>
          <p className="text-sm">{summary}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${urgencyColors[urgency]}`}>
            {urgency.toUpperCase()}
          </span>
        </div>

        {keywords.length > 0 && (
          <div>
            <p className="text-xs font-medium mb-2">Key Topics:</p>
            <div className="flex flex-wrap gap-1">
              {keywords.map((keyword, i) => (
                <span key={i} className="text-xs bg-white bg-opacity-50 px-2 py-1 rounded">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
