export async function GET(request: Request) {
  try {
    // TODO: Fetch real stats from database
    const stats = {
      pending: 12,
      processing: 5,
      resolved: 48,
      avgSentiment: 7.2,
    }

    return Response.json(stats)
  } catch (error) {
    return Response.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
