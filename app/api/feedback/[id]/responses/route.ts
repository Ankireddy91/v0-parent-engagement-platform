export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // TODO: Fetch responses from database for this feedback
    const responses = []

    return Response.json(responses)
  } catch (error) {
    return Response.json({ error: "Failed to fetch responses" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { message, agentId } = body

    // TODO: Save response to database
    // TODO: Trigger notification to parent

    return Response.json({ success: true, id: "response-id" })
  } catch (error) {
    return Response.json({ error: "Failed to save response" }, { status: 500 })
  }
}
