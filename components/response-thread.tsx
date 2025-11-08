"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

interface Response {
  id: string
  agentName: string
  agentRole: string
  message: string
  timestamp: string
  helpful?: boolean
  rating?: number
}

interface ResponseThreadProps {
  responses: Response[]
  onSubmitReaction: (responseId: string, reaction: "helpful" | "not-helpful", rating?: number) => Promise<void>
  isParentView?: boolean
}

export function ResponseThread({ responses, onSubmitReaction, isParentView = false }: ResponseThreadProps) {
  const [submittingId, setSubmittingId] = useState<string | null>(null)
  const [userReactions, setUserReactions] = useState<Record<string, { helpful?: boolean; rating?: number }>>({})

  const handleReaction = async (responseId: string, helpful: boolean, rating?: number) => {
    setSubmittingId(responseId)
    try {
      await onSubmitReaction(responseId, helpful ? "helpful" : "not-helpful", rating)
      setUserReactions((prev) => ({
        ...prev,
        [responseId]: { helpful, rating },
      }))
    } catch (error) {
      console.error("Error submitting reaction:", error)
    } finally {
      setSubmittingId(null)
    }
  }

  if (responses.length === 0) {
    return (
      <Card className="p-6 bg-blue-50 border-2 border-blue-200">
        <p className="text-blue-800 text-sm">No responses yet. An agent will review your feedback shortly.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {responses.map((response) => {
        const userReaction = userReactions[response.id] || { helpful: response.helpful }
        return (
          <Card key={response.id} className="p-6 bg-white shadow-lg border-l-4 border-green-500">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="font-semibold text-slate-900">{response.agentName}</p>
                <p className="text-xs text-slate-600">{response.agentRole}</p>
              </div>
              <p className="text-xs text-slate-500">{new Date(response.timestamp).toLocaleDateString()}</p>
            </div>

            <p className="text-slate-700 whitespace-pre-wrap mb-4">{response.message}</p>

            {isParentView && (
              <div className="border-t border-slate-200 pt-4">
                <p className="text-xs font-semibold text-slate-600 mb-3">Was this response helpful?</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <button
                    onClick={() => handleReaction(response.id, true)}
                    disabled={submittingId === response.id}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      userReaction.helpful === true
                        ? "bg-green-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    } disabled:opacity-50`}
                  >
                    👍 Helpful
                  </button>
                  <button
                    onClick={() => handleReaction(response.id, false)}
                    disabled={submittingId === response.id}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      userReaction.helpful === false
                        ? "bg-red-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    } disabled:opacity-50`}
                  >
                    👎 Not Helpful
                  </button>
                </div>

                <p className="text-xs font-semibold text-slate-600 mb-2">Rate this response:</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleReaction(response.id, userReaction.helpful !== false, star)}
                      disabled={submittingId === response.id}
                      className={`text-2xl transition ${
                        userReaction.rating && userReaction.rating >= star
                          ? "text-yellow-400"
                          : "text-slate-300 hover:text-yellow-200"
                      } disabled:opacity-50`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}
