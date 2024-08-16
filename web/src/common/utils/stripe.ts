type AppName = "superrare";

const STRIPE_PARAMS_FOR_APP: Record<AppName, { customerId: string; eventName: string }> = {
  superrare: { customerId: "cus_QfqtarAIfC3ijD", eventName: "superrare_frame_api" },
};

export async function stripeReportUsage(appName: AppName) {
  const { eventName, customerId } = STRIPE_PARAMS_FOR_APP[appName];
  try {
    const credentials = btoa(`${process.env.STRIPE_SECRET_KEY!}:`);
    const params = new URLSearchParams({
      event_name: eventName,
      timestamp: Math.floor(Date.now() / 1000).toString(),
      "payload[stripe_customer_id]": customerId,
    });

    const resp = await fetch("https://api.stripe.com/v1/billing/meter_events", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!resp.ok) {
      throw Error(await resp.text());
    }
  } catch (e) {
    console.error("ERROR REPORTING STRIPE USAGE", {
      appName,
      eventName,
      customerId,
      error: e instanceof Error ? e.message : JSON.stringify(e),
    });
  }
}
