export function frameErrorResponse(message: string): Response {
  return Response.json({ message: message.slice(0, 90) }, { status: 400 });
}
