export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // TODO: Delete notification from database

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: "Failed to delete notification" }, { status: 500 })
  }
}
