"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

interface ResponseMetric {
  id: string
  message: string
  helpful: number
  notHelpful: number
  avgRating: number
  totalRatings: number
}

export function AgentResponseView({ feedbackId }: { feedbackId: string }) {
  const [metrics, setMetrics] = useState<ResponseMetric[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch(`/api/feedback/${feedbackId}/response-metrics`)
        if (res.ok) {
          const data = await res.json()
          setMetrics(data)
        }
      } catch (error) {
        console.error("Error fetching metrics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetrics()
  }, [feedbackId])

  if (isLoading) {
    return <p className="text-slate-600 text-sm">Loading metrics...</p>
  }

  if (metrics.length === 0) {
    return (
      <Card className="p-4 bg-slate-50 border border-slate-200">
        <p className="text-slate-600 text-sm">No responses sent yet.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {metrics.map((metric) => {
        const totalFeedback = metric.helpful + metric.notHelpful
        const helpfulPercent = totalFeedback > 0 ? (metric.helpful / totalFeedback) * 100 : 0

        return (
          <Card key={metric.id} className="p-4 bg-white shadow">
            <p className="text-sm font-medium text-slate-900 mb-3">{metric.message.substring(0, 100)}...</p>

            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-600 mb-1">Helpful</p>
                <p className="text-lg font-bold text-green-600">{metric.helpful}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-1">Not Helpful</p>
                <p className="text-lg font-bold text-red-600">{metric.notHelpful}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-1">Avg Rating</p>
                <p className="text-lg font-bold text-yellow-600">{metric.avgRating.toFixed(1)}/5</p>
              </div>
            </div>

            {totalFeedback > 0 && (
              <div className="mt-3">
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-green-600 h-full transition-all" style={{ width: `${helpfulPercent}%` }} />
                </div>
                <p className="text-xs text-slate-600 mt-1">{helpfulPercent.toFixed(0)}% found helpful</p>
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}
