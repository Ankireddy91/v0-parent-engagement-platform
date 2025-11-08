"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

interface Stats {
  pending: number
  processing: number
  resolved: number
  avgSentiment: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stats>({ pending: 0, processing: 0, resolved: 0, avgSentiment: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      label: "Pending Review",
      value: stats.pending,
      color: "bg-red-50 text-red-600 border-red-200",
      icon: "📋",
    },
    {
      label: "In Processing",
      value: stats.processing,
      color: "bg-yellow-50 text-yellow-600 border-yellow-200",
      icon: "⚙️",
    },
    {
      label: "Resolved",
      value: stats.resolved,
      color: "bg-green-50 text-green-600 border-green-200",
      icon: "✓",
    },
    {
      label: "Avg Sentiment",
      value: `${stats.avgSentiment.toFixed(1)}/10`,
      color: "bg-blue-50 text-blue-600 border-blue-200",
      icon: "😊",
    },
  ]

  return (
    <div className="grid md:grid-cols-4 gap-4">
      {statCards.map((stat, i) => (
        <Card key={i} className={`p-6 border-2 ${stat.color}`}>
          <div className="text-3xl mb-2">{stat.icon}</div>
          <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
          <p className={`text-2xl font-bold ${stat.color.split(" ")[1]}`}>{stat.value}</p>
        </Card>
      ))}
    </div>
  )
}
