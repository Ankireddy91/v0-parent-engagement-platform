import type { Feedback } from "@/lib/types"

interface AgentStatsProps {
  feedbacks: Feedback[]
}

export function AgentStats({ feedbacks }: AgentStatsProps) {
  const totalFeedbacks = feedbacks.length
  const pendingFeedbacks = feedbacks.filter((f) => f.status === "submitted").length
  const respondedFeedbacks = feedbacks.filter((f) => f.status === "responded").length
  const unreadFeedbacks = feedbacks.filter((f) => !f.isRead).length

  const stats = [
    {
      label: "Total Feedback",
      value: totalFeedbacks,
      bg: "bg-blue-50",
      text: "text-blue-700",
    },
    {
      label: "Pending Review",
      value: pendingFeedbacks,
      bg: "bg-yellow-50",
      text: "text-yellow-700",
    },
    {
      label: "Responded",
      value: respondedFeedbacks,
      bg: "bg-green-50",
      text: "text-green-700",
    },
    {
      label: "Unread",
      value: unreadFeedbacks,
      bg: "bg-red-50",
      text: "text-red-700",
    },
  ]

  return (
    <div className="grid md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className={`${stat.bg} rounded-lg p-6`}>
          <p className={`text-sm font-medium ${stat.text} mb-1`}>{stat.label}</p>
          <p className={`text-3xl font-bold ${stat.text}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  )
}
