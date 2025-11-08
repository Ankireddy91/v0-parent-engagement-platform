"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { ReadStatusIndicator } from "./read-status-indicator"

interface Feedback {
  id: string
  subject: string
  category: string
  priority: string
  status: string
  submittedAt: string
  lastUpdate: string
  isRead: boolean
  readAt?: string
}

export function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch("/api/feedback/user")
        if (response.ok) {
          const data = await response.json()
          setFeedbacks(data)
        }
      } catch (error) {
        console.error("Error fetching feedback:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeedback()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-slate-100 text-slate-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600"
      case "high":
        return "text-orange-600"
      case "normal":
        return "text-blue-600"
      case "low":
        return "text-green-600"
      default:
        return "text-slate-600"
    }
  }

  if (isLoading) {
    return (
      <Card className="p-8 bg-white shadow-lg text-center">
        <p className="text-slate-600">Loading your feedback history...</p>
      </Card>
    )
  }

  if (feedbacks.length === 0) {
    return (
      <Card className="p-8 bg-white shadow-lg text-center">
        <p className="text-slate-600">You haven't submitted any feedback yet.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {feedbacks.map((feedback) => (
        <Card key={feedback.id} className="p-6 bg-white shadow-lg hover:shadow-xl transition">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-slate-900">{feedback.subject}</h3>
                {!feedback.isRead && <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full" />}
              </div>
              <div className="flex flex-wrap gap-3 mb-3">
                <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full">{feedback.category}</span>
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getPriorityColor(feedback.priority)}`}>
                  {feedback.priority.toUpperCase()}
                </span>
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusColor(feedback.status)}`}>
                  {feedback.status.toUpperCase()}
                </span>
              </div>
              <div className="text-sm text-slate-600">
                <p>Submitted: {new Date(feedback.submittedAt).toLocaleDateString()}</p>
                <p>Last Update: {new Date(feedback.lastUpdate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex-shrink-0">
              {feedback.isRead ? (
                <div className="text-green-600 text-2xl">✓</div>
              ) : (
                <div className="text-yellow-600 text-2xl">⏱️</div>
              )}
            </div>
          </div>

          <ReadStatusIndicator feedbackId={feedback.id} hasBeenRead={feedback.isRead} readAt={feedback.readAt} />

          <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
            View Details
          </button>
        </Card>
      ))}
    </div>
  )
}
