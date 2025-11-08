export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    // TODO: Update notification in database

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: "Failed to mark as read" }, { status: 500 })
  }
}
