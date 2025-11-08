export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { agentId } = body

    // TODO: Update feedback read status in database
    // TODO: Create notification for parent
    // TODO: Record read timestamp

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: "Failed to mark feedback as read" }, { status: 500 })
  }
}
