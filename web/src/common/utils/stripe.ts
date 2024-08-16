import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type AppName = "superrare";

const STRIPE_PARAMS_FOR_APP: Record<AppName, { customerId: string; eventName: string }> = {
  superrare: { customerId: "cus_QfqtarAIfC3ijD", eventName: "superrare_frame_api" },
};

export async function stripeReportUsage(appName: AppName) {
  const { eventName, customerId } = STRIPE_PARAMS_FOR_APP[appName];
  try {
    await stripe.billing.meterEvents.create({
      event_name: eventName,
      payload: {
        stripe_customer_id: customerId,
      },
    });
  } catch (e) {
    console.error("ERROR REPORTING STRIPE USAGE", eventName, e);
  }
}
