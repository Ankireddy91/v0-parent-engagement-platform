"use client"

import { useState } from "react"
import type { Feedback } from "@/lib/types"
import { SentimentBadge } from "./sentiment-badge"
import { CategoryBadge } from "./category-badge"
import { StatusBadge } from "./status-badge"

interface FeedbackCardProps {
  feedback: Feedback
  onMarkAsRead: (id: string) => void
  onRespond: (feedback: Feedback) => void
}

export function FeedbackCard({ feedback, onMarkAsRead, onRespond }: FeedbackCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleOpen = () => {
    if (!feedback.isRead) {
      onMarkAsRead(feedback.id)
    }
    setIsExpanded(!isExpanded)
  }

  return (
    <div
      className={`border rounded-lg overflow-hidden transition ${
        !feedback.isRead ? "border-green-300 bg-green-50" : "border-slate-200 bg-white"
      }`}
    >
      <div onClick={handleOpen} className="p-6 cursor-pointer hover:bg-slate-50 transition">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-slate-900 text-lg">{feedback.parentName}</h3>
              {!feedback.isRead && <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>}
            </div>
            <p className="text-sm text-slate-600">
              {feedback.studentName} • {new Date(feedback.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <SentimentBadge sentiment={feedback.sentiment} />
            <CategoryBadge category={feedback.category} />
            <StatusBadge status={feedback.status} />
          </div>
        </div>

        <p className="text-slate-700 line-clamp-2">{feedback.content}</p>
      </div>

      {isExpanded && (
        <div className="border-t border-slate-200 bg-slate-50 p-6 space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Full Feedback</h4>
            <p className="text-slate-700 whitespace-pre-wrap">{feedback.content}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-600">Parent Email</p>
              <p className="text-slate-900">{feedback.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Category</p>
              <p className="text-slate-900">{feedback.category}</p>
            </div>
          </div>

          {feedback.agentResponse && (
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">
                Your Response {feedback.agentReaction && `(${feedback.agentReaction})`}
              </h4>
              <p className="text-slate-700 mb-2">{feedback.agentResponse}</p>
              <p className="text-xs text-slate-500">
                Responded on {new Date(feedback.responseDate || feedback.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}

          {feedback.status === "submitted" && (
            <button
              onClick={() => onRespond(feedback)}
              className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
            >
              Write Response
            </button>
          )}
        </div>
      )}
    </div>
  )
}
