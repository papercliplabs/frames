import umami from "@umami/node";

umami.init({
  websiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
  hostUrl: "https://umami.paperclip.xyz",
});

export async function trackEvent(name: string, payload: Record<string, string | number>) {
  console.log("TRACKING EVENT", name, payload);

  // Umami
  if (process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID) {
    try {
      const resp = await umami.track(name, payload);
      if (!resp.ok) {
        console.error("Event tracking failed", resp.status, await resp.text());
      }
    } catch (e) {
      console.error("Umami event tracking failed", e);
    }
  }

  // Plausible
  if (process.env.NEXT_PUBLIC_PLAUSIBLE_DATA_DOMAIN) {
    try {
      await fetch("https://plausible.paperclip.xyz/api/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain: process.env.NEXT_PUBLIC_PLAUSIBLE_DATA_DOMAIN,
          name,
          url: "",
          props: payload,
        }),
      });
    } catch (e) {
      console.error("Plausible event tracking failed", e);
    }
  }
}
