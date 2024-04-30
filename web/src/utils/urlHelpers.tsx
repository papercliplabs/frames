export function relativeEndpointUrl(req: Request, url: string) {
  const currentUrl = new URL(req.url);
  const base = process.env.NEXT_PUBLIC_URL + currentUrl.pathname;
  return base + url;
}

export function localImageUrl(image: string) {
  return `${process.env.NEXT_PUBLIC_URL}/images${image}`;
  //   return `/Users/spencerperkins/Developer/Paperclip/frames/web/public/images${image}`;
}
