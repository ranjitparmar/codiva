import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";

const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://codiva.dev"), // change to your real domain

  title: "Codiva — Prompt to Production",
  description:
    "Describe what you want to build. Codiva generates and deploys it live in seconds.",

  keywords: [
    "AI website builder",
    "prompt to website",
    "AI site generator",
    "AI web development",
  ],

  authors: [{ name: "Codiva" }],

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Codiva — Prompt to Production",
    description:
      "Describe what you want to build. Codiva generates and deploys it live in seconds.",
    images: ["/og-image.png"],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Codiva — Prompt to Production",
    description:
      "Describe what you want to build. Codiva generates and deploys it live in seconds.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistMono.variable} antialiased`}>
        <Providers>

          {children}
          <Toaster
            position="bottom-right"
            richColors
            toastOptions={{
              style: {
                fontFamily: "DM Sans, sans-serif",
                fontSize: "14px",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}