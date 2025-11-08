"use client"

import { useState } from "react"
import type { Feedback } from "@/lib/types"

interface ResponseModalProps {
  feedback: Feedback
  onSubmit: (response: string, reaction: string) => void
  onClose: () => void
}

export function ResponseModal({ feedback, onSubmit, onClose }: ResponseModalProps) {
  const [response, setResponse] = useState("")
  const [reaction, setReaction] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const reactions = [
    { emoji: "😊", label: "Positive" },
    { emoji: "😐", label: "Neutral" },
    { emoji: "😟", label: "Acknowledged" },
  ]

  const handleSubmit = () => {
    if (!response.trim() || !reaction) {
      alert("Please write a response and select a reaction")
      return
    }

    onSubmit(response, reaction)
    setSubmitted(true)
    setTimeout(() => {
      setResponse("")
      setReaction("")
      setSubmitted(false)
    }, 1500)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-slate-900">Respond to Feedback from {feedback.parentName}</h2>
          <p className="text-slate-600 text-sm mt-1">Student: {feedback.studentName}</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-semibold text-slate-900 mb-2">Original Feedback</h3>
            <p className="text-slate-700">{feedback.content}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Your Response</label>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              placeholder="Write your response to the parent..."
            />
            <p className="text-xs text-slate-500 mt-1">{response.length} / 1000 characters</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Your Reaction</label>
            <div className="flex gap-4">
              {reactions.map((r) => (
                <button
                  key={r.label}
                  onClick={() => setReaction(r.label)}
                  className={`flex flex-col items-center gap-2 px-4 py-3 rounded-lg border-2 transition ${
                    reaction === r.label ? "border-green-500 bg-green-50" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span className="text-3xl">{r.emoji}</span>
                  <span className="text-xs font-medium text-slate-700">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {submitted && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              ✓ Response sent to parent!
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
            >
              Send Response
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
