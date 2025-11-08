"use client"

import { Card } from "@/components/ui/card"

interface ReadStatusIndicatorProps {
  feedbackId: string
  hasBeenRead: boolean
  readBy?: string[]
  readAt?: string
}

export function ReadStatusIndicator({ feedbackId, hasBeenRead, readBy = [], readAt }: ReadStatusIndicatorProps) {
  return (
    <Card
      className={`p-4 border-l-4 ${hasBeenRead ? "border-green-500 bg-green-50" : "border-yellow-500 bg-yellow-50"}`}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">{hasBeenRead ? "✓" : "⏱️"}</div>
        <div>
          <p className="font-semibold text-sm text-slate-900">{hasBeenRead ? "Read" : "Pending Review"}</p>
          <p className="text-xs text-slate-600 mt-1">
            {hasBeenRead
              ? readAt
                ? `Read on ${new Date(readAt).toLocaleDateString()}`
                : "This feedback has been read"
              : "Waiting for agent to review"}
          </p>
          {readBy && readBy.length > 0 && (
            <p className="text-xs text-slate-600 mt-2">
              Read by: <strong>{readBy.join(", ")}</strong>
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}
