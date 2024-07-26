import Script from "next/script";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Metadata } from "next";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Paperclip Labs Frame Server",
  description: "Frame server that hosts all frames made by Paperclip Labs.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL!),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        {children}
        <Toaster />
      </body>
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
