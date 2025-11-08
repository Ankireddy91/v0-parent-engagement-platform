"use client"

import { useState, useEffect } from "react"

interface Notification {
  id: string
  type: "response" | "status-change" | "feedback-received"
  title: string
  message: string
  timestamp: string
  isRead: boolean
  relatedFeedbackId: string
}

interface NotificationCenterProps {
  userId: string
  isOpen: boolean
  onClose: () => void
}

export function NotificationCenter({ userId, isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  useEffect(() => {
    if (!isOpen) return

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`/api/notifications?filter=${filter}`)
        if (res.ok) {
          const data = await res.json()
          setNotifications(data)
        }
      } catch (error) {
        console.error("Error fetching notifications:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotifications()
  }, [filter, isOpen])

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PATCH",
      })
      setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await fetch("/api/notifications/mark-all-read", {
        method: "PATCH",
      })
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    } catch (error) {
      console.error("Error marking all as read:", error)
    }
  }

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      })
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }

  const filteredNotifications = filter === "unread" ? notifications.filter((n) => !n.isRead) : notifications
  const unreadCount = notifications.filter((n) => !n.isRead).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "response":
        return "💬"
      case "status-change":
        return "📊"
      case "feedback-received":
        return "📝"
      default:
        return "🔔"
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-end pt-16">
      <div className="w-96 max-w-full bg-white rounded-lg shadow-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-slate-200 p-4 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900">Notifications</h2>
            {unreadCount > 0 && <span className="text-xs text-slate-600">{unreadCount} unread</span>}
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 text-xl">
            ×
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-slate-200 p-4">
          <button
            onClick={() => setFilter("all")}
            className={`text-sm px-3 py-1 rounded transition ${
              filter === "all" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`text-sm px-3 py-1 rounded transition ${
              filter === "unread" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Unread
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-slate-600 text-sm">Loading notifications...</div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-600 text-sm">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 transition hover:bg-slate-50 ${!notification.isRead ? "bg-blue-50" : ""}`}
                >
                  <div className="flex gap-3">
                    <div className="text-2xl flex-shrink-0">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-sm text-slate-900">{notification.title}</h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-sm text-slate-700 mt-1">{notification.message}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        {new Date(notification.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="text-xs px-2 py-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {unreadCount > 0 && (
          <div className="border-t border-slate-200 p-4">
            <button
              onClick={handleMarkAllAsRead}
              className="w-full text-sm bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Mark all as read
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
