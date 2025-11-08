export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status } = body

    // TODO: Update feedback status in database

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: "Failed to update status" }, { status: 500 })
  }
}
