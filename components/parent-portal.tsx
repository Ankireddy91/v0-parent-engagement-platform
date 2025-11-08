"use client"

import { useState } from "react"
import { FeedbackForm } from "./feedback-form"
import { FeedbackList } from "./feedback-list"

export function ParentPortal() {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [activeTab, setActiveTab] = useState<"submit" | "history">("submit")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Parent Feedback Portal</h1>
          <p className="text-slate-600">Share your thoughts and concerns with our administration</p>
        </div>

        <div className="flex gap-4 mb-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("submit")}
            className={`pb-4 font-semibold transition ${
              activeTab === "submit"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Submit Feedback
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`pb-4 font-semibold transition ${
              activeTab === "history"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Feedback History
          </button>
        </div>

        {activeTab === "submit" && (
          <FeedbackForm
            onSubmitSuccess={() => {
              setFeedbackSubmitted(true)
              setTimeout(() => setFeedbackSubmitted(false), 3000)
            }}
          />
        )}
        {activeTab === "history" && <FeedbackList />}

        {feedbackSubmitted && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
            Feedback submitted successfully!
          </div>
        )}
      </div>
    </div>
  )
}
