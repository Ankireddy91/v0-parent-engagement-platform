"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

interface FeedbackItem {
  id: string
  parentName: string
  studentName: string
  subject: string
  priority: string
  status: string
  submittedAt: string
  sentiment?: string
}

interface FeedbackQueueProps {
  status: string
  searchQuery: string
  onSelectFeedback: (feedback: any) => void
  selectedId?: string
}

export function FeedbackQueue({ status, searchQuery, onSelectFeedback, selectedId }: FeedbackQueueProps) {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch(`/api/feedback/queue?status=${status}`)
        if (response.ok) {
          const data = await response.json()
          setFeedbacks(data)
        }
      } catch (error) {
        console.error("Error fetching feedbacks:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeedbacks()
  }, [status])

  const filteredFeedbacks = feedbacks.filter(
    (f) =>
      f.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.parentName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-700"
      case "high":
        return "bg-orange-100 text-orange-700"
      case "normal":
        return "bg-blue-100 text-blue-700"
      case "low":
        return "bg-green-100 text-green-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  if (isLoading) {
    return <div className="text-slate-600 text-sm">Loading feedbacks...</div>
  }

  if (filteredFeedbacks.length === 0) {
    return <div className="text-slate-600 text-sm text-center py-8">No feedbacks found</div>
  }

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto">
      {filteredFeedbacks.map((feedback) => (
        <Card
          key={feedback.id}
          onClick={() => onSelectFeedback(feedback)}
          className={`p-4 cursor-pointer transition border-2 ${
            selectedId === feedback.id
              ? "border-green-500 bg-green-50"
              : "border-slate-200 hover:border-green-300 hover:bg-slate-50"
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-semibold text-slate-900 text-sm flex-1 line-clamp-2">{feedback.subject}</h4>
            <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${getPriorityColor(feedback.priority)}`}>
              {feedback.priority}
            </span>
          </div>
          <p className="text-xs text-slate-600 mb-2">{feedback.parentName}</p>
          <p className="text-xs text-slate-500">{new Date(feedback.submittedAt).toLocaleDateString()}</p>
        </Card>
      ))}
    </div>
  )
}
