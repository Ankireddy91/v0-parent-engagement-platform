export async function PATCH(request: Request) {
  try {
    // TODO: Mark all notifications as read for current user in database

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: "Failed to mark all as read" }, { status: 500 })
  }
}
