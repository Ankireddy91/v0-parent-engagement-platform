"use client"

import { useState } from "react"
import { ParentPortal } from "@/components/parent-portal"
import { AgentDashboard } from "@/components/agent-dashboard"

type UserRole = "parent" | "agent" | "selection"

export default function Home() {
  const [userRole, setUserRole] = useState<UserRole>("selection")

  if (userRole === "selection") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Parent-University Engagement Platform</h1>
            <p className="text-lg text-slate-600">AI-powered feedback and communication hub</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div
              onClick={() => setUserRole("parent")}
              className="bg-white rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-shadow border-2 border-transparent hover:border-blue-500"
            >
              <div className="text-5xl mb-4">👨‍👩‍👧</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Parent Portal</h2>
              <p className="text-slate-600 mb-6">
                Submit feedback, track status, and communicate with faculty and administration
              </p>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                Enter as Parent
              </button>
            </div>

            <div
              onClick={() => setUserRole("agent")}
              className="bg-white rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-shadow border-2 border-transparent hover:border-green-500"
            >
              <div className="text-5xl mb-4">👔</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Agent Dashboard</h2>
              <p className="text-slate-600 mb-6">
                Review feedback, provide responses, and manage parent communications
              </p>
              <button className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition">
                Enter as Agent
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <nav className="bg-slate-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Parent-University Engagement</h1>
        <button onClick={() => setUserRole("selection")} className="bg-slate-600 hover:bg-slate-700 px-4 py-2 rounded">
          Switch User
        </button>
      </nav>

      {userRole === "parent" && <ParentPortal />}
      {userRole === "agent" && <AgentDashboard />}
    </div>
  )
}
