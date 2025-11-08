"use client"

import { useState } from "react"
import type { Feedback } from "@/lib/types"
import { SentimentBadge } from "./sentiment-badge"
import { CategoryBadge } from "./category-badge"
import { StatusBadge } from "./status-badge"

interface ParentFeedbackListProps {
  feedbacks: Feedback[]
  setFeedbacks: (feedbacks: Feedback[]) => void
}

export function ParentFeedbackList({ feedbacks, setFeedbacks }: ParentFeedbackListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleMarkAsRead = (id: string) => {
    const updated = feedbacks.map((f) => (f.id === id ? { ...f, isRead: true } : f))
    setFeedbacks(updated)
    localStorage.setItem("feedbacks", JSON.stringify(updated))
  }

  if (feedbacks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📋</div>
        <p className="text-slate-600 text-lg">No feedback submitted yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {feedbacks.map((feedback) => (
        <div
          key={feedback.id}
          className={`border rounded-lg overflow-hidden transition ${
            !feedback.isRead ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white"
          }`}
        >
          <div
            onClick={() => {
              setExpandedId(expandedId === feedback.id ? null : feedback.id)
              if (!feedback.isRead) {
                handleMarkAsRead(feedback.id)
              }
            }}
            className="p-6 cursor-pointer hover:bg-slate-50 transition"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-900 text-lg">{feedback.studentName}</h3>
                <p className="text-sm text-slate-600">{new Date(feedback.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <SentimentBadge sentiment={feedback.sentiment} />
                <CategoryBadge category={feedback.category} />
                <StatusBadge status={feedback.status} />
              </div>
            </div>

            <p className="text-slate-700 line-clamp-2">{feedback.content}</p>

            {!feedback.isRead && (
              <div className="mt-3 text-xs font-semibold text-blue-600">
                NEW • Click to view details and agent response
              </div>
            )}
          </div>

          {expandedId === feedback.id && (
            <div className="border-t border-slate-200 bg-slate-50 p-6 space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Full Feedback</h4>
                <p className="text-slate-700 whitespace-pre-wrap">{feedback.content}</p>
              </div>

              {feedback.agentResponse && (
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2">
                    Agent Response {feedback.agentReaction && `(${feedback.agentReaction})`}
                  </h4>
                  <p className="text-slate-700 mb-3">{feedback.agentResponse}</p>
                  <p className="text-xs text-slate-500">
                    Read on {new Date(feedback.responseDate || feedback.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}

              {!feedback.agentResponse && feedback.status === "submitted" && (
                <div className="text-sm text-slate-600 italic">⏳ Waiting for agent review...</div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
