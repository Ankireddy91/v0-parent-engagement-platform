export async function POST(request: Request, { params }: { params: { id: string; responseId: string } }) {
  try {
    const body = await request.json()
    const { reaction, rating } = body

    // TODO: Save reaction to database
    // TODO: Update response metrics

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: "Failed to save reaction" }, { status: 500 })
  }
}
