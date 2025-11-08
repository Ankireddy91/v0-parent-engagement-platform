export async function GET(request: Request) {
  try {
    // TODO: Fetch user's feedback from database
    const feedbacks = []

    return Response.json(feedbacks)
  } catch (error) {
    return Response.json({ error: "Failed to fetch feedback" }, { status: 500 })
  }
}
