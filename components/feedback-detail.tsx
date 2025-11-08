"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SentimentBadge } from "./sentiment-badge"
import { ResponseThread } from "./response-thread"

interface FeedbackDetailProps {
  feedback: {
    id: string
    parentName: string
    studentName: string
    subject: string
    category: string
    priority: string
    message: string
    status: string
    submittedAt: string
  }
  onClose: () => void
  onStatusChange: () => void
}

interface Analysis {
  sentiment: "positive" | "neutral" | "negative"
  score: number
  urgency: "low" | "normal" | "high" | "urgent"
  department: string
  summary: string
  keywords: string[]
  actionItems: string[]
}

interface Response {
  id: string
  agentName: string
  agentRole: string
  message: string
  timestamp: string
  helpful?: boolean
  rating?: number
}

export function FeedbackDetail({ feedback, onClose, onStatusChange }: FeedbackDetailProps) {
  const [response, setResponse] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newStatus, setNewStatus] = useState(feedback.status)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [suggestion, setSuggestion] = useState("")
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(true)
  const [responses, setResponses] = useState<Response[]>([])
  const [isLoadingResponses, setIsLoadingResponses] = useState(true)

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        const res = await fetch("/api/feedback/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            feedbackId: feedback.id,
            subject: feedback.subject,
            message: feedback.message,
            category: feedback.category,
          }),
        })

        if (res.ok) {
          const data = await res.json()
          setAnalysis(data.analysis)
          setSuggestion(data.suggestion)
        }
      } catch (error) {
        console.error("Error loading analysis:", error)
      } finally {
        setIsLoadingAnalysis(false)
      }
    }

    const loadResponses = async () => {
      try {
        const res = await fetch(`/api/feedback/${feedback.id}/responses`)
        if (res.ok) {
          const data = await res.json()
          setResponses(data)
        }
      } catch (error) {
        console.error("Error loading responses:", error)
      } finally {
        setIsLoadingResponses(false)
      }
    }

    loadAnalysis()
    loadResponses()
  }, [feedback])

  const handleSubmitResponse = async () => {
    if (!response.trim()) return

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/feedback/${feedback.id}/response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response, status: newStatus }),
      })

      if (res.ok) {
        setResponse("")
        onStatusChange()
      }
    } catch (error) {
      console.error("Error submitting response:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusChange = async (status: string) => {
    try {
      const res = await fetch(`/api/feedback/${feedback.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        setNewStatus(status)
      }
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const handleSubmitReaction = async (responseId: string, reaction: "helpful" | "not-helpful", rating?: number) => {
    try {
      const res = await fetch(`/api/feedback/${feedback.id}/responses/${responseId}/reaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reaction, rating }),
      })

      if (!res.ok) {
        throw new Error("Failed to submit reaction")
      }
    } catch (error) {
      console.error("Error submitting reaction:", error)
      throw error
    }
  }

  return (
    <Card className="p-8 bg-white shadow-lg overflow-y-auto max-h-[80vh]">
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{feedback.subject}</h2>
            <p className="text-slate-600">
              {feedback.parentName} - {feedback.studentName}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 text-2xl font-light">
            ×
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
            {feedback.category}
          </span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            {feedback.priority}
          </span>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">{newStatus}</span>
        </div>

        <p className="text-sm text-slate-600">Submitted on {new Date(feedback.submittedAt).toLocaleDateString()}</p>
      </div>

      {isLoadingAnalysis ? (
        <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4 mb-6">
          <p className="text-slate-600 text-sm">Analyzing feedback with AI...</p>
        </div>
      ) : analysis ? (
        <div className="mb-6">
          <SentimentBadge
            sentiment={analysis.sentiment}
            score={analysis.score}
            urgency={analysis.urgency}
            summary={analysis.summary}
            keywords={analysis.keywords}
          />
        </div>
      ) : null}

      <div className="border-t border-slate-200 pt-6 mb-6">
        <h3 className="font-semibold text-slate-900 mb-3">Feedback Message</h3>
        <p className="text-slate-700 whitespace-pre-wrap">{feedback.message}</p>
      </div>

      {analysis?.actionItems && analysis.actionItems.length > 0 && (
        <div className="border-t border-slate-200 pt-6 mb-6">
          <h3 className="font-semibold text-slate-900 mb-3">Key Issues Identified</h3>
          <ul className="space-y-2">
            {analysis.actionItems.map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-blue-600 font-semibold">•</span>
                <span className="text-slate-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="border-t border-slate-200 pt-6 mb-6">
        <h3 className="font-semibold text-slate-900 mb-3">Status Management</h3>
        <div className="flex gap-2 flex-wrap">
          {["submitted", "processing", "resolved", "closed"].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                newStatus === status ? "bg-green-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-200 pt-6 mb-6">
        <h3 className="font-semibold text-slate-900 mb-4">Responses</h3>
        {isLoadingResponses ? (
          <p className="text-slate-600 text-sm">Loading responses...</p>
        ) : (
          <ResponseThread responses={responses} onSubmitReaction={handleSubmitReaction} isParentView={true} />
        )}
      </div>

      <div>
        <h3 className="font-semibold text-slate-900 mb-3">Send Response</h3>
        {suggestion && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
            <p className="text-xs font-semibold text-blue-900 mb-1">AI Suggested Response:</p>
            <p className="text-sm text-blue-800">{suggestion}</p>
            <button
              onClick={() => setResponse(suggestion)}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold mt-2"
            >
              Use this response
            </button>
          </div>
        )}
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Type your response to the parent..."
          rows={4}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-3"
        />
        <Button
          onClick={handleSubmitResponse}
          disabled={isSubmitting || !response.trim()}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {isSubmitting ? "Sending..." : "Send Response"}
        </Button>
      </div>
    </Card>
  )
}
