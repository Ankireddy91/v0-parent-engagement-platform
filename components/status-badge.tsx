interface StatusBadgeProps {
  status: "submitted" | "responded"
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colors = {
    submitted: "bg-yellow-100 text-yellow-700",
    responded: "bg-green-100 text-green-700",
  }

  const icons = {
    submitted: "⏳",
    responded: "✓",
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status]}`}>
      {icons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
