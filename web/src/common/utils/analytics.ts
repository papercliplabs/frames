export async function sendAnalyticsEvent(name: string, value: Record<string, string | number>): Promise<void> {
  if (process.env.NEXT_PUBLIC_URL === "https://frames.paperclip.xyz") {
    const payload = {
      client_id: "frame_server",
      events: [
        {
          name,
          params: value,
        },
      ],
    };

    try {
      const response = await fetch(
        `https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA_MEASUREMENT_ID!}&api_secret=${process.env.GA_API_SECRET!}`,
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to send event to Google Analytics");
      }
    } catch (e) {
      console.error("Error sending ga event: ", e);
    }
  }
}
