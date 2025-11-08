export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // TODO: Calculate metrics from database
    const metrics = []

    return Response.json(metrics)
  } catch (error) {
    return Response.json({ error: "Failed to fetch metrics" }, { status: 500 })
  }
}
