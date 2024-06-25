async function response(): Promise<Response> {
  return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/nouns-town/0`, 302);
}

export const GET = response;
export const POST = response;
