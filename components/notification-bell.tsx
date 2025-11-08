"use client"

import { useState, useEffect } from "react"
import { NotificationCenter } from "./notification-center"

interface NotificationBellProps {
  userId: string
}

export function NotificationBell({ userId }: NotificationBellProps) {
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await fetch("/api/notifications/unread-count")
        if (res.ok) {
          const data = await res.json()
          setUnreadCount(data.count)
        }
      } catch (error) {
        console.error("Error fetching unread count:", error)
      }
    }

    fetchUnreadCount()

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="relative p-2 rounded-lg hover:bg-slate-100 transition">
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
      <NotificationCenter userId={userId} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
