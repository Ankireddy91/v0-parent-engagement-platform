interface CategoryBadgeProps {
  category: string
}

const categoryIcons: Record<string, string> = {
  Academic: "📚",
  Facilities: "🏫",
  Administrative: "📋",
  Faculty: "👨‍🏫",
  "Student Life": "🎓",
  Other: "💬",
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
      {categoryIcons[category] || "💬"} {category}
    </span>
  )
}
