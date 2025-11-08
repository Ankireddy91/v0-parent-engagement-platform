export async function GET(request: Request) {
  try {
    // TODO: Count unread notifications for current user from database
    const count = 0

    return Response.json({ count })
  } catch (error) {
    return Response.json({ error: "Failed to fetch unread count" }, { status: 500 })
  }
}
