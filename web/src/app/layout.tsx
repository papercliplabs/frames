import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Analytics />
    </html>
  );
}

function Analytics() {
  return (
    <>
      {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
        <Script
          defer
          src="https://umami.paperclip.xyz/script.js"
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
        />
      )}
      {process.env.NEXT_PUBLIC_PLAUSIBLE_DATA_DOMAIN && (
        <Script
          defer
          src="https://plausible.paperclip.xyz/js/script.js"
          data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DATA_DOMAIN}
        />
      )}
    </>
  );
}
