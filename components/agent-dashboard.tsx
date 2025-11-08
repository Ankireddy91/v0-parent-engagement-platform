"use client"

import { useState } from "react"
import { FeedbackQueue } from "./feedback-queue"
import { FeedbackDetail } from "./feedback-detail"
import { DashboardStats } from "./dashboard-stats"

interface SelectedFeedback {
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

export function AgentDashboard() {
  const [selectedFeedback, setSelectedFeedback] = useState<SelectedFeedback | null>(null)
  const [activeTab, setActiveTab] = useState<"queue" | "resolved">("queue")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Agent Dashboard</h1>
          <p className="text-slate-600">Review and manage parent feedback</p>
        </div>

        {/* Stats */}
        <DashboardStats />

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          {/* Feedback Queue */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex gap-2 mb-6 border-b border-slate-200">
                <button
                  onClick={() => setActiveTab("queue")}
                  className={`pb-3 font-semibold text-sm transition ${
                    activeTab === "queue"
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Queue
                </button>
                <button
                  onClick={() => setActiveTab("resolved")}
                  className={`pb-3 font-semibold text-sm transition ${
                    activeTab === "resolved"
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Resolved
                </button>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search feedback..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <FeedbackQueue
                status={activeTab === "queue" ? "submitted" : "resolved"}
                searchQuery={searchQuery}
                onSelectFeedback={setSelectedFeedback}
                selectedId={selectedFeedback?.id}
              />
            </div>
          </div>

          {/* Feedback Detail */}
          <div className="lg:col-span-2">
            {selectedFeedback ? (
              <FeedbackDetail
                feedback={selectedFeedback}
                onClose={() => setSelectedFeedback(null)}
                onStatusChange={() => {
                  setSelectedFeedback(null)
                }}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <p className="text-slate-500 text-lg">Select a feedback item to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
