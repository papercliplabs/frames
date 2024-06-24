import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Analytics />
      <GoogleAnalytics gaId={process.env.GA_MEASUREMENT_ID!} />
    </html>
  );
}
