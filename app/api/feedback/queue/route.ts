export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status") || "submitted"

  try {
    // TODO: Fetch feedbacks from database based on status
    const feedbacks = []

    return Response.json(feedbacks)
  } catch (error) {
    return Response.json({ error: "Failed to fetch feedback queue" }, { status: 500 })
  }
}
